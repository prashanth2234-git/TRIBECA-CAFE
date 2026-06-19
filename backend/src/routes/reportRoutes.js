import express from "express";
import { dashboardReport } from "../controllers/reportController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", protect, authorize("admin", "receptionist"), dashboardReport);

export default router;
