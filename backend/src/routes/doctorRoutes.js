import express from "express";
import { createDoctor, doctorSchema, getDoctorSlots, listDoctors, todayAppointments, updateDoctor } from "../controllers/doctorController.js";
import { authorize, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/", protect, listDoctors);
router.get("/today/appointments", protect, authorize("doctor", "admin", "receptionist"), todayAppointments);
router.get("/:id/slots", protect, getDoctorSlots);
router.post("/", protect, authorize("admin", "receptionist"), validate(doctorSchema), createDoctor);
router.put("/:id", protect, authorize("admin", "receptionist"), validate(doctorSchema), updateDoctor);

export default router;
