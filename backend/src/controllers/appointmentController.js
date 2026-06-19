import { z } from "zod";
import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createAppointment } from "../services/appointmentService.js";

export const appointmentSchema = z.object({
  body: z.object({
    patientId: z.string().optional(),
    doctorId: z.string(),
    date: z.string(),
    timeSlot: z.string(),
    symptoms: z.string().optional()
  })
});

export const bookAppointment = asyncHandler(async (req, res) => {
  let patientId = req.validated.body.patientId;
  if (!patientId && req.user.role === "patient") {
    const patient = await Patient.findOne({ user: req.user._id });
    patientId = patient?._id?.toString();
  }
  if (!patientId) return res.status(400).json({ message: "patientId is required" });

  const appointment = await createAppointment({
    ...req.validated.body,
    patientId
  });
  res.status(201).json(appointment);
});

export const listAppointments = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.date) filter.date = req.query.date;
  if (req.query.doctorId) filter.doctor = req.query.doctorId;

  if (req.user.role === "patient") {
    const patient = await Patient.findOne({ user: req.user._id });
    filter.patient = patient?._id;
  }

  const appointments = await Appointment.find(filter)
    .populate("patient")
    .populate("doctor")
    .sort({ date: -1, timeSlot: 1 });
  res.json(appointments);
});

export const updateAppointment = asyncHandler(async (req, res) => {
  const allowed = ["status", "symptoms", "cancellationReason"];
  const update = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) update[key] = req.body[key];
  });
  if (update.status === "cancelled") update.cancelledAt = new Date();
  if (update.status === "completed") update.completedAt = new Date();

  const appointment = await Appointment.findByIdAndUpdate(req.params.id, update, { new: true })
    .populate("patient")
    .populate("doctor");
  if (!appointment) return res.status(404).json({ message: "Appointment not found" });
  res.json(appointment);
});

export const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: "Appointment not found" });
  appointment.status = "cancelled";
  appointment.cancellationReason = req.body.reason || "Cancelled by user";
  appointment.cancelledAt = new Date();
  await appointment.save();
  res.json({ message: "Appointment cancelled", appointment });
});
