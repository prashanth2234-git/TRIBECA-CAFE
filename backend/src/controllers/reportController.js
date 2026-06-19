import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Queue from "../models/Queue.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const dashboardReport = asyncHandler(async (req, res) => {
  const today = req.query.date || new Date().toISOString().slice(0, 10);
  const [
    totalPatients,
    todayAppointments,
    completedAppointments,
    cancelledAppointments,
    queues,
    doctors
  ] = await Promise.all([
    Patient.countDocuments(),
    Appointment.countDocuments({ date: today }),
    Appointment.countDocuments({ date: today, status: "completed" }),
    Appointment.countDocuments({ date: today, status: "cancelled" }),
    Queue.find({ date: today, completedAt: { $exists: true } }),
    Doctor.find()
  ]);

  const waitTimes = queues
    .filter((row) => row.completedAt && row.checkedInAt)
    .map((row) => Math.round((row.completedAt - row.checkedInAt) / 60000));
  const averageWaitingTime = waitTimes.length
    ? Math.round(waitTimes.reduce((sum, item) => sum + item, 0) / waitTimes.length)
    : 0;

  const doctorWisePerformance = await Appointment.aggregate([
    { $match: { date: today } },
    { $group: { _id: "$doctor", total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } } } },
    { $lookup: { from: "doctors", localField: "_id", foreignField: "_id", as: "doctor" } },
    { $unwind: "$doctor" },
    { $project: { doctor: "$doctor.name", total: 1, completed: 1 } }
  ]);

  const statusBreakdown = await Appointment.aggregate([
    { $match: { date: today } },
    { $group: { _id: "$status", value: { $sum: 1 } } },
    { $project: { name: "$_id", value: 1, _id: 0 } }
  ]);

  res.json({
    date: today,
    totalPatients,
    todayAppointments,
    completedAppointments,
    cancelledAppointments,
    averageWaitingTime,
    activeDoctors: doctors.filter((doctor) => doctor.isActive).length,
    doctorWisePerformance,
    statusBreakdown
  });
});
