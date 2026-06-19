import { z } from "zod";
import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const patientSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    age: z.number().min(0).max(120).optional(),
    gender: z.enum(["male", "female", "other", "prefer-not-to-say"]).optional(),
    phone: z.string().min(7),
    email: z.string().email().optional(),
    address: z.string().optional(),
    medicalHistory: z.string().optional(),
    allergies: z.array(z.string()).optional()
  })
});

export const listPatients = asyncHandler(async (req, res) => {
  const q = req.query.q;
  const filter = q ? { $text: { $search: q } } : {};
  const patients = await Patient.find(filter).sort({ updatedAt: -1 }).limit(100);
  res.json(patients);
});

export const getPatient = asyncHandler(async (req, res) => {
  const id = req.params.id === "me"
    ? (await Patient.findOne({ user: req.user._id }))?._id
    : req.params.id;

  const patient = await Patient.findById(id);
  if (!patient) return res.status(404).json({ message: "Patient not found" });

  const [appointments, prescriptions] = await Promise.all([
    Appointment.find({ patient: patient._id }).populate("doctor").sort({ date: -1 }),
    Prescription.find({ patient: patient._id }).populate("doctor appointment").sort({ createdAt: -1 })
  ]);

  res.json({ patient, appointments, prescriptions });
});

export const createPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.create(req.validated.body);
  res.status(201).json(patient);
});

export const updatePatient = asyncHandler(async (req, res) => {
  const id = req.params.id === "me"
    ? (await Patient.findOne({ user: req.user._id }))?._id
    : req.params.id;
  const patient = await Patient.findByIdAndUpdate(id, req.validated.body, { new: true });
  if (!patient) return res.status(404).json({ message: "Patient not found" });
  res.json(patient);
});
