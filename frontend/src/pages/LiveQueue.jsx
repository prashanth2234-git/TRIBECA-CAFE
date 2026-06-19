import { PlayCircle, RefreshCcw, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocketQueue } from "../hooks/useSocketQueue";
import api from "../services/api";

export default function LiveQueue() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [snapshot, setSnapshot] = useSocketQueue(null);

  useEffect(() => {
    api.get("/doctors").then(({ data }) => {
      setDoctors(data);
      if (data[0]) setDoctorId(data[0]._id);
    });
  }, []);

  useEffect(() => {
    api.get("/queue/live", { params: { doctorId } }).then(({ data }) => setSnapshot(data));
  }, [doctorId, setSnapshot]);

  async function callNext() {
    await api.post("/queue/next", { doctorId });
    const { data } = await api.get("/queue/live", { params: { doctorId } });
    setSnapshot(data);
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-clinic-teal">Live queue</p>
          <h1 className="text-3xl font-bold text-clinic-navy">Token status and waiting time</h1>
        </div>
        <div className="flex gap-2">
          <select className="field max-w-xs" value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
            {doctors.map((doctor) => <option key={doctor._id} value={doctor._id}>{doctor.name}</option>)}
          </select>
          {["doctor", "admin", "receptionist"].includes(user?.role) && <button className="btn-primary" onClick={callNext}><PlayCircle className="h-4 w-4" /> Next</button>}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="stat"><p className="text-sm text-slate-500">Current token</p><p className="text-4xl font-bold text-clinic-navy">{snapshot?.currentToken || "--"}</p></div>
        <div className="stat"><p className="text-sm text-slate-500">Next token</p><p className="text-4xl font-bold text-clinic-teal">{snapshot?.nextToken || "--"}</p></div>
        <div className="stat"><p className="text-sm text-slate-500">Patients ahead</p><p className="text-4xl font-bold text-clinic-navy">{snapshot?.patientsAhead || 0}</p></div>
        <div className="stat"><p className="text-sm text-slate-500">Estimated wait</p><p className="text-4xl font-bold text-clinic-navy">{snapshot?.estimatedWaitingTime || 0}m</p></div>
      </div>
      <div className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h2 className="flex items-center gap-2 font-semibold text-clinic-navy"><Users className="h-5 w-5 text-clinic-teal" /> Queue entries</h2>
          <RefreshCcw className="h-4 w-4 text-slate-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Token</th><th className="p-3">Patient</th><th className="p-3">Doctor</th><th className="p-3">Position</th><th className="p-3">Wait</th><th className="p-3">Status</th></tr></thead>
            <tbody>
              {(snapshot?.entries || []).map((entry) => (
                <tr key={entry.id} className="border-t border-slate-100">
                  <td className="p-3 font-bold text-clinic-navy">{entry.tokenNumber}</td>
                  <td className="p-3">{entry.patient?.name}</td>
                  <td className="p-3">{entry.doctor?.name}</td>
                  <td className="p-3">{entry.position || "-"}</td>
                  <td className="p-3">{entry.estimatedWaitMinutes}m</td>
                  <td className="p-3 capitalize">{entry.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
