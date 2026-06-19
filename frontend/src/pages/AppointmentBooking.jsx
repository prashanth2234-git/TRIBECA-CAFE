import { CalendarCheck } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function AppointmentBooking() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ doctorId: "", patientId: "", date: new Date().toISOString().slice(0, 10), timeSlot: "", symptoms: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/doctors").then(({ data }) => setDoctors(data));
    api.get("/patients").then(({ data }) => setPatients(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.doctorId || !form.date) return;
    api.get(`/doctors/${form.doctorId}/slots`, { params: { date: form.date } }).then(({ data }) => setSlots(data));
  }, [form.doctorId, form.date]);

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    try {
      const payload = { ...form };
      if (!payload.patientId) delete payload.patientId;
      const { data } = await api.post("/appointments", payload);
      setMessage(`Appointment ${data.appointmentId} confirmed.`);
      setForm({ ...form, timeSlot: "", symptoms: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Booking failed");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <form onSubmit={submit} className="panel p-5">
        <div className="mb-5 flex items-center gap-2">
          <CalendarCheck className="h-6 w-6 text-clinic-teal" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-clinic-teal">Appointment booking</p>
            <h1 className="text-2xl font-bold text-clinic-navy">Create a confirmed appointment</h1>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <select className="field" value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value, timeSlot: "" })} required>
            <option value="">Select doctor</option>
            {doctors.map((doctor) => <option key={doctor._id} value={doctor._id}>{doctor.name} - {doctor.specialization}</option>)}
          </select>
          <select className="field" value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}>
            <option value="">Use my patient profile</option>
            {patients.map((patient) => <option key={patient._id} value={patient._id}>{patient.name} - {patient.phone}</option>)}
          </select>
          <input className="field" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value, timeSlot: "" })} required />
          <select className="field" value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} required>
            <option value="">Select slot</option>
            {slots.map((slot) => <option key={slot.time} value={slot.time} disabled={!slot.available}>{slot.time} {slot.available ? "" : "(unavailable)"}</option>)}
          </select>
          <textarea className="field md:col-span-2" rows="4" value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} placeholder="Symptoms or reason for visit" />
        </div>
        <button className="btn-primary mt-4">Confirm appointment</button>
        {message && <p className="mt-4 rounded-md bg-clinic-mint p-3 text-sm text-clinic-navy">{message}</p>}
      </form>
      <div className="panel p-5">
        <h2 className="font-semibold text-clinic-navy">Availability rules</h2>
        <div className="mt-4 grid gap-3 text-sm text-slate-600">
          <p>Slots are generated from each doctor's working days, hours, break times, leave days, and slot duration.</p>
          <p>Booked and cancelled states are handled separately, so cancelled slots can reopen while active bookings remain protected.</p>
          <p>Reception can create walk-in patient records first, then book on their behalf.</p>
        </div>
      </div>
    </div>
  );
}
