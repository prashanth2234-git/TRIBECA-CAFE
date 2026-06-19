import { CheckCircle2, FilePlus2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [active, setActive] = useState(null);
  const [form, setForm] = useState({ diagnosis: "", notes: "", medicines: [{ name: "", dosage: "", frequency: "", duration: "" }] });

  async function load() {
    const { data } = await api.get("/doctors/today/appointments");
    setAppointments(data);
  }

  useEffect(() => { load(); }, []);

  const current = useMemo(() => appointments.find((item) => item.status === "in-consultation") || appointments[0], [appointments]);

  async function complete(id) {
    await api.put(`/appointments/${id}`, { status: "completed" });
    await load();
  }

  async function savePrescription(event) {
    event.preventDefault();
    await api.post("/prescriptions", {
      appointmentId: active._id,
      diagnosis: form.diagnosis,
      notes: form.notes,
      medicines: form.medicines.filter((item) => item.name)
    });
    setForm({ diagnosis: "", notes: "", medicines: [{ name: "", dosage: "", frequency: "", duration: "" }] });
    await complete(active._id);
    setActive(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <div className="panel overflow-hidden">
        <div className="border-b border-slate-200 p-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-clinic-teal">Doctor dashboard</p>
          <h1 className="text-2xl font-bold text-clinic-navy">Today's appointments</h1>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Time</th><th className="p-3">Patient</th><th className="p-3">Symptoms</th><th className="p-3">Status</th><th className="p-3"></th></tr></thead>
            <tbody>
              {appointments.map((item) => (
                <tr key={item._id} className="border-t border-slate-100">
                  <td className="p-3">{item.timeSlot}</td>
                  <td className="p-3">{item.patient?.name}</td>
                  <td className="p-3">{item.symptoms}</td>
                  <td className="p-3 capitalize">{item.status}</td>
                  <td className="p-3">
                    <button className="btn-secondary py-1" onClick={() => setActive(item)}><FilePlus2 className="h-4 w-4" /> Notes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <form onSubmit={savePrescription} className="panel p-4">
        <h2 className="font-semibold text-clinic-navy">Consultation notes</h2>
        <p className="mt-1 text-sm text-slate-500">{active ? `${active.patient?.name} - ${active.appointmentId}` : current ? `Select a patient, e.g. ${current.patient?.name}` : "No appointments today"}</p>
        <div className="mt-4 grid gap-3">
          <input className="field" placeholder="Diagnosis" value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} required disabled={!active} />
          {form.medicines.map((medicine, index) => (
            <div key={index} className="grid gap-2 rounded-md border border-slate-200 p-3 sm:grid-cols-2">
              <input className="field" placeholder="Medicine" value={medicine.name} onChange={(e) => {
                const medicines = [...form.medicines];
                medicines[index] = { ...medicine, name: e.target.value };
                setForm({ ...form, medicines });
              }} />
              <input className="field" placeholder="Dosage" value={medicine.dosage} onChange={(e) => {
                const medicines = [...form.medicines];
                medicines[index] = { ...medicine, dosage: e.target.value };
                setForm({ ...form, medicines });
              }} />
              <input className="field" placeholder="Frequency" value={medicine.frequency} onChange={(e) => {
                const medicines = [...form.medicines];
                medicines[index] = { ...medicine, frequency: e.target.value };
                setForm({ ...form, medicines });
              }} />
              <input className="field" placeholder="Duration" value={medicine.duration} onChange={(e) => {
                const medicines = [...form.medicines];
                medicines[index] = { ...medicine, duration: e.target.value };
                setForm({ ...form, medicines });
              }} />
            </div>
          ))}
          <button type="button" className="btn-secondary" onClick={() => setForm({ ...form, medicines: [...form.medicines, { name: "", dosage: "", frequency: "", duration: "" }] })}>Add medicine</button>
          <textarea className="field" rows="4" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} disabled={!active} />
          <button className="btn-primary" disabled={!active}><CheckCircle2 className="h-4 w-4" /> Save prescription and complete</button>
        </div>
      </form>
    </div>
  );
}
