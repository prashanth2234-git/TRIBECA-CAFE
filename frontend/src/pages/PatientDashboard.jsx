import { CalendarPlus, Clock, FileText, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AssistantWidget from "../components/AssistantWidget";
import MetricCard from "../components/MetricCard";
import api from "../services/api";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [queue, setQueue] = useState(null);

  useEffect(() => {
    api.get("/appointments").then(({ data }) => setAppointments(data));
    api.get("/queue/live").then(({ data }) => setQueue(data));
  }, []);

  async function cancel(id) {
    await api.delete(`/appointments/${id}`, { data: { reason: "Cancelled by patient" } });
    setAppointments((items) => items.map((item) => item._id === id ? { ...item, status: "cancelled" } : item));
  }

  const upcoming = appointments.filter((item) => ["booked", "checked-in", "in-consultation"].includes(item.status));

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-clinic-teal">Patient dashboard</p>
          <h1 className="text-3xl font-bold text-clinic-navy">Appointments and queue status</h1>
        </div>
        <div className="flex gap-2">
          <Link className="btn-primary" to="/book"><CalendarPlus className="h-4 w-4" /> Book</Link>
          <Link className="btn-secondary" to="/patient/profile"><UserCircle className="h-4 w-4" /> Profile</Link>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={Clock} label="Upcoming visits" value={upcoming.length} />
        <MetricCard icon={FileText} label="History" value={appointments.length} />
        <MetricCard icon={Clock} label="Estimated wait" value={`${queue?.estimatedWaitingTime || 0} min`} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="panel overflow-hidden">
          <div className="border-b border-slate-200 p-4">
            <h2 className="font-semibold text-clinic-navy">Appointment history</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr><th className="p-3">ID</th><th className="p-3">Doctor</th><th className="p-3">Date</th><th className="p-3">Slot</th><th className="p-3">Status</th><th className="p-3"></th></tr>
              </thead>
              <tbody>
                {appointments.map((item) => (
                  <tr key={item._id} className="border-t border-slate-100">
                    <td className="p-3 font-medium">{item.appointmentId}</td>
                    <td className="p-3">{item.doctor?.name}</td>
                    <td className="p-3">{item.date}</td>
                    <td className="p-3">{item.timeSlot}</td>
                    <td className="p-3 capitalize">{item.status}</td>
                    <td className="p-3">{item.status === "booked" && <button className="text-sm font-semibold text-clinic-coral" onClick={() => cancel(item._id)}>Cancel</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <AssistantWidget />
      </div>
    </div>
  );
}
