import express from "express";
import { callNext, checkIn, checkInSchema, complete, liveQueue } from "../controllers/queueController.js";
import { authorize, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/live", protect, liveQueue);
router.post("/checkin", protect, authorize("admin", "receptionist"), validate(checkInSchema), checkIn);
router.post("/next", protect, authorize("doctor", "admin", "receptionist"), callNext);
router.post("/complete", protect, authorize("doctor", "admin", "receptionist"), complete);

export default router;
