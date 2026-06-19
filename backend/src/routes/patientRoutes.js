import express from "express";
import { createPatient, getPatient, listPatients, patientSchema, updatePatient } from "../controllers/patientController.js";
import { authorize, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/", protect, authorize("admin", "receptionist", "doctor"), listPatients);
router.get("/:id", protect, getPatient);
router.post("/", protect, authorize("admin", "receptionist"), validate(patientSchema), createPatient);
router.put("/:id", protect, validate(patientSchema), updatePatient);

export default router;
