import { z } from "zod";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getAvailableSlots } from "../services/appointmentService.js";

export const doctorSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    specialization: z.string().min(2),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    room: z.string().optional(),
    consultationFee: z.number().optional(),
    workingDays: z.array(z.string()).optional(),
    workingHours: z.object({ start: z.string(), end: z.string() }).optional(),
    breakTimes: z.array(z.object({ start: z.string(), end: z.string() })).optional(),
    leaveDays: z.array(z.string()).optional(),
    slotDuration: z.number().optional(),
    avgConsultationMinutes: z.number().optional(),
    isActive: z.boolean().optional()
  })
});

export const listDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({ isActive: true }).sort({ name: 1 });
  res.json(doctors);
});

export const createDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.create(req.validated.body);
  res.status(201).json(doctor);
});

export const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.validated.body, { new: true });
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  res.json(doctor);
});

export const getDoctorSlots = asyncHandler(async (req, res) => {
  const slots = await getAvailableSlots(req.params.id, req.query.date);
  res.json(slots);
});

export const todayAppointments = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  const doctorId = req.query.doctorId || doctor?._id;
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  const appointments = await Appointment.find({ doctor: doctorId, date })
    .populate("patient")
    .populate("doctor")
    .sort({ timeSlot: 1 });
  res.json(appointments);
});
