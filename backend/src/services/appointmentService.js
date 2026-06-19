import crypto from "crypto";
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import { generateDoctorSlots } from "../utils/slotUtils.js";
import { notifyAppointmentConfirmation } from "./notificationService.js";

function appointmentCode() {
  return `APT-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function getAvailableSlots(doctorId, date) {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  const appointments = await Appointment.find({
    doctor: doctorId,
    date,
    status: { $ne: "cancelled" }
  }).select("timeSlot");

  return generateDoctorSlots(doctor, date, appointments.map((item) => item.timeSlot));
}

export async function createAppointment({ patientId, doctorId, date, timeSlot, symptoms }) {
  const [patient, doctor] = await Promise.all([
    Patient.findById(patientId),
    Doctor.findById(doctorId)
  ]);

  if (!patient) throw new Error("Patient not found");
  if (!doctor) throw new Error("Doctor not found");

  const slots = await getAvailableSlots(doctorId, date);
  const selected = slots.find((slot) => slot.time === timeSlot);
  if (!selected || !selected.available) {
    const error = new Error("Selected time slot is unavailable");
    error.statusCode = 409;
    throw error;
  }

  const appointment = await Appointment.create({
    appointmentId: appointmentCode(),
    patient: patient._id,
    doctor: doctor._id,
    patientSnapshot: {
      name: patient.name,
      phone: patient.phone,
      email: patient.email
    },
    date,
    timeSlot,
    symptoms
  });

  await notifyAppointmentConfirmation({ user: patient.user, patient, appointment, doctor });
  return appointment.populate(["patient", "doctor"]);
}
