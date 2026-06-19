import { ClipboardCheck, Search, Ticket, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import MetricCard from "../components/MetricCard";
import api from "../services/api";

export default function AdminDashboard() {
  const [report, setReport] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patientForm, setPatientForm] = useState({ name: "", phone: "", email: "", age: "", gender: "prefer-not-to-say" });
  const [doctorForm, setDoctorForm] = useState({ name: "", specialization: "", phone: "", email: "", room: "", consultationFee: 500 });
  const [q, setQ] = useState("");

  async function load() {
    const [reportRes, appointmentRes, patientRes] = await Promise.all([
      api.get("/reports/dashboard"),
      api.get("/appointments", { params: { date: new Date().toISOString().slice(0, 10) } }),
      api.get("/patients", { params: { q } })
    ]);
    setReport(reportRes.data);
    setAppointments(appointmentRes.data);
    setPatients(patientRes.data);
  }

  useEffect(() => { load(); }, []);

  async function checkIn(appointmentId) {
    await api.post("/queue/checkin", { appointmentId });
    await load();
  }

  async function createPatient(event) {
    event.preventDefault();
    await api.post("/patients", { ...patientForm, age: patientForm.age ? Number(patientForm.age) : undefined });
    setPatientForm({ name: "", phone: "", email: "", age: "", gender: "prefer-not-to-say" });
    await load();
  }

  async function createDoctor(event) {
    event.preventDefault();
    await api.post("/doctors", { ...doctorForm, consultationFee: Number(doctorForm.consultationFee) });
    setDoctorForm({ name: "", specialization: "", phone: "", email: "", room: "", consultationFee: 500 });
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-clinic-teal">Reception and admin</p>
        <h1 className="text-3xl font-bold text-clinic-navy">Daily clinic control center</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard icon={Users} label="Total patients" value={report?.totalPatients ?? "--"} />
        <MetricCard icon={ClipboardCheck} label="Today's appointments" value={report?.todayAppointments ?? "--"} />
        <MetricCard icon={ClipboardCheck} label="Completed" value={report?.completedAppointments ?? "--"} />
        <MetricCard icon={Ticket} label="Avg wait" value={`${report?.averageWaitingTime ?? 0}m`} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel overflow-hidden">
          <div className="border-b border-slate-200 p-4">
            <h2 className="font-semibold text-clinic-navy">Today's appointments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Time</th><th className="p-3">Patient</th><th className="p-3">Doctor</th><th className="p-3">Token</th><th className="p-3">Status</th><th className="p-3"></th></tr></thead>
              <tbody>
                {appointments.map((item) => (
                  <tr key={item._id} className="border-t border-slate-100">
                    <td className="p-3">{item.timeSlot}</td>
                    <td className="p-3">{item.patient?.name}</td>
                    <td className="p-3">{item.doctor?.name}</td>
                    <td className="p-3">{item.tokenNumber || "-"}</td>
                    <td className="p-3 capitalize">{item.status}</td>
                    <td className="p-3">{item.status === "booked" && <button className="btn-secondary py-1" onClick={() => checkIn(item._id)}>Check in</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="grid gap-6">
          <form onSubmit={createPatient} className="panel p-4">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-clinic-navy"><UserPlus className="h-5 w-5 text-clinic-teal" /> Create patient</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="field" placeholder="Name" value={patientForm.name} onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })} required />
              <input className="field" placeholder="Phone" value={patientForm.phone} onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })} required />
              <input className="field" placeholder="Email" value={patientForm.email} onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })} />
              <input className="field" placeholder="Age" type="number" value={patientForm.age} onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })} />
            </div>
            <button className="btn-primary mt-3">Save patient</button>
          </form>
          <form onSubmit={createDoctor} className="panel p-4">
            <h2 className="mb-3 font-semibold text-clinic-navy">Add doctor</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="field" placeholder="Name" value={doctorForm.name} onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })} required />
              <input className="field" placeholder="Specialization" value={doctorForm.specialization} onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })} required />
              <input className="field" placeholder="Room" value={doctorForm.room} onChange={(e) => setDoctorForm({ ...doctorForm, room: e.target.value })} />
              <input className="field" placeholder="Fee" type="number" value={doctorForm.consultationFee} onChange={(e) => setDoctorForm({ ...doctorForm, consultationFee: e.target.value })} />
            </div>
            <button className="btn-primary mt-3">Save doctor</button>
          </form>
        </div>
      </div>
      <div className="panel p-4">
        <div className="mb-3 flex items-center gap-2">
          <Search className="h-5 w-5 text-clinic-teal" />
          <input className="field max-w-sm" placeholder="Search patient records" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} />
          <button className="btn-secondary" onClick={load}>Search</button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {patients.slice(0, 9).map((patient) => (
            <div key={patient._id} className="rounded-md border border-slate-200 p-3">
              <p className="font-semibold text-clinic-navy">{patient.name}</p>
              <p className="text-sm text-slate-500">{patient.phone}</p>
              <p className="text-xs text-slate-400">{patient.medicalHistory || "No medical history recorded"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
