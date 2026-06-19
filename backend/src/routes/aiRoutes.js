import express from "express";
import { aiSchema, askAssistant } from "../controllers/aiController.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/ask", validate(aiSchema), askAssistant);

export default router;
