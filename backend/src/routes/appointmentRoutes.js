import express from "express";
import { appointmentSchema, bookAppointment, cancelAppointment, listAppointments, updateAppointment } from "../controllers/appointmentController.js";
import { authorize, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/", protect, listAppointments);
router.post("/", protect, authorize("patient", "admin", "receptionist"), validate(appointmentSchema), bookAppointment);
router.put("/:id", protect, authorize("admin", "receptionist", "doctor"), updateAppointment);
router.delete("/:id", protect, cancelAppointment);

export default router;
