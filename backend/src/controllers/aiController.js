import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { askClinicAssistant } from "../services/aiService.js";

export const aiSchema = z.object({
  body: z.object({
    question: z.string().min(2).max(1000)
  })
});

export const askAssistant = asyncHandler(async (req, res) => {
  const result = await askClinicAssistant(req.validated.body.question);
  res.json(result);
});
