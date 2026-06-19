import { z } from "zod";
import Prescription from "../models/Prescription.js";
import Appointment from "../models/Appointment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generatePrescriptionPdf } from "../services/prescriptionService.js";

export const prescriptionSchema = z.object({
  body: z.object({
    appointmentId: z.string(),
    diagnosis: z.string().min(2),
    medicines: z.array(z.object({
      name: z.string().min(1),
      dosage: z.string().optional(),
      frequency: z.string().optional(),
      duration: z.string().optional(),
      instructions: z.string().optional()
    })).default([]),
    notes: z.string().optional()
  })
});

export const createPrescription = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.validated.body.appointmentId).populate(["patient", "doctor"]);
  if (!appointment) return res.status(404).json({ message: "Appointment not found" });

  let prescription = await Prescription.create({
    appointment: appointment._id,
    patient: appointment.patient._id,
    doctor: appointment.doctor._id,
    diagnosis: req.validated.body.diagnosis,
    medicines: req.validated.body.medicines,
    notes: req.validated.body.notes
  });

  prescription = await prescription.populate(["patient", "doctor", "appointment"]);
  const pdf = generatePrescriptionPdf(prescription);
  prescription.pdfPath = pdf.publicPath;
  await prescription.save();

  res.status(201).json(prescription);
});

export const listPrescriptions = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.patientId) filter.patient = req.query.patientId;
  const prescriptions = await Prescription.find(filter).populate(["patient", "doctor", "appointment"]).sort({ createdAt: -1 });
  res.json(prescriptions);
});
