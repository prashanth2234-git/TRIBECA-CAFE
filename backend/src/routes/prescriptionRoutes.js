import express from "express";
import { createPrescription, listPrescriptions, prescriptionSchema } from "../controllers/prescriptionController.js";
import { authorize, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/", protect, listPrescriptions);
router.post("/", protect, authorize("doctor", "admin"), validate(prescriptionSchema), createPrescription);

export default router;
