import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Queue from "../models/Queue.js";
import { todayISO } from "../utils/slotUtils.js";
import { notifyToken } from "./notificationService.js";
import { emitQueueUpdate } from "./socketService.js";

async function nextToken(doctorId, date) {
  const count = await Queue.countDocuments({ doctor: doctorId, date });
  return `T${String(count + 1).padStart(3, "0")}`;
}

export async function buildQueueSnapshot({ doctorId, date = todayISO() } = {}) {
  const filter = { date };
  if (doctorId) filter.doctor = doctorId;

  const rows = await Queue.find(filter)
    .populate("patient", "name phone")
    .populate("doctor", "name specialization avgConsultationMinutes")
    .populate("appointment", "appointmentId timeSlot status")
    .sort({ checkedInAt: 1 });

  const waiting = rows.filter((row) => row.status === "waiting");
  const current = rows.find((row) => row.status === "current") || null;
  const next = waiting[0] || null;
  const avgMinutes = current?.doctor?.avgConsultationMinutes || next?.doctor?.avgConsultationMinutes || 12;

  return {
    date,
    currentToken: current?.tokenNumber || null,
    nextToken: next?.tokenNumber || null,
    patientsAhead: waiting.length,
    estimatedWaitingTime: waiting.length * avgMinutes,
    entries: rows.map((row, index) => ({
      id: row._id,
      tokenNumber: row.tokenNumber,
      status: row.status,
      position: row.status === "waiting" ? waiting.findIndex((item) => item._id.equals(row._id)) + 1 : 0,
      estimatedWaitMinutes: row.status === "waiting" ? (waiting.findIndex((item) => item._id.equals(row._id)) + 1) * avgMinutes : 0,
      patient: row.patient,
      doctor: row.doctor,
      appointment: row.appointment,
      checkedInAt: row.checkedInAt
    }))
  };
}

export async function checkInAppointment(appointmentId) {
  const appointment = await Appointment.findById(appointmentId).populate(["patient", "doctor"]);
  if (!appointment) throw new Error("Appointment not found");
  if (appointment.status === "cancelled") throw new Error("Cancelled appointments cannot be checked in");

  const existing = await Queue.findOne({ appointment: appointment._id });
  if (existing) return existing.populate(["patient", "doctor", "appointment"]);

  const tokenNumber = await nextToken(appointment.doctor._id, appointment.date);
  const queueEntry = await Queue.create({
    appointment: appointment._id,
    patient: appointment.patient._id,
    doctor: appointment.doctor._id,
    date: appointment.date,
    tokenNumber
  });

  appointment.status = "checked-in";
  appointment.tokenNumber = tokenNumber;
  appointment.checkedInAt = new Date();
  await appointment.save();
  await notifyToken({ user: appointment.patient.user, patient: appointment.patient, appointment });

  const snapshot = await buildQueueSnapshot({ doctorId: appointment.doctor._id, date: appointment.date });
  emitQueueUpdate(snapshot);
  return queueEntry.populate(["patient", "doctor", "appointment"]);
}

export async function callNextPatient({ doctorId, date = todayISO() }) {
  const current = await Queue.findOne({ doctor: doctorId, date, status: "current" });
  if (current) {
    current.status = "completed";
    current.completedAt = new Date();
    await current.save();
    await Appointment.findByIdAndUpdate(current.appointment, { status: "completed", completedAt: new Date() });
  }

  const next = await Queue.findOne({ doctor: doctorId, date, status: "waiting" }).sort({ checkedInAt: 1 });
  if (!next) {
    const snapshot = await buildQueueSnapshot({ doctorId, date });
    emitQueueUpdate(snapshot);
    return null;
  }

  next.status = "current";
  next.calledAt = new Date();
  await next.save();
  await Appointment.findByIdAndUpdate(next.appointment, { status: "in-consultation", startedAt: new Date() });

  const snapshot = await buildQueueSnapshot({ doctorId, date });
  emitQueueUpdate(snapshot);
  return next.populate(["patient", "doctor", "appointment"]);
}

export async function completeCurrent({ doctorId, date = todayISO() }) {
  const current = await Queue.findOne({ doctor: doctorId, date, status: "current" });
  if (!current) return null;

  current.status = "completed";
  current.completedAt = new Date();
  await current.save();
  await Appointment.findByIdAndUpdate(current.appointment, { status: "completed", completedAt: new Date() });

  const snapshot = await buildQueueSnapshot({ doctorId, date });
  emitQueueUpdate(snapshot);
  return current.populate(["patient", "doctor", "appointment"]);
}
