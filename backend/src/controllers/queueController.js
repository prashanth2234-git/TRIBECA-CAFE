import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { buildQueueSnapshot, callNextPatient, checkInAppointment, completeCurrent } from "../services/queueService.js";

export const checkInSchema = z.object({
  body: z.object({
    appointmentId: z.string()
  })
});

export const checkIn = asyncHandler(async (req, res) => {
  const entry = await checkInAppointment(req.validated.body.appointmentId);
  res.status(201).json(entry);
});

export const liveQueue = asyncHandler(async (req, res) => {
  const snapshot = await buildQueueSnapshot({ doctorId: req.query.doctorId, date: req.query.date });
  res.json(snapshot);
});

export const callNext = asyncHandler(async (req, res) => {
  const entry = await callNextPatient({ doctorId: req.body.doctorId, date: req.body.date });
  res.json(entry || { message: "No waiting patients" });
});

export const complete = asyncHandler(async (req, res) => {
  const entry = await completeCurrent({ doctorId: req.body.doctorId, date: req.body.date });
  res.json(entry || { message: "No current patient" });
});
