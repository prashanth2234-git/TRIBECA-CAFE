import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function PatientProfile() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/patients/me").then(({ data }) => setProfile(data.patient));
  }, []);

  async function save(event) {
    event.preventDefault();
    const { data } = await api.put("/patients/me", {
      ...profile,
      allergies: Array.isArray(profile.allergies) ? profile.allergies : String(profile.allergies || "").split(",").map((item) => item.trim()).filter(Boolean)
    });
    setProfile(data);
    setMessage("Profile updated");
  }

  if (!profile) return <div className="panel p-6">Loading profile...</div>;

  return (
    <form onSubmit={save} className="panel p-5">
      <p className="text-sm font-semibold uppercase tracking-wide text-clinic-teal">Patient profile</p>
      <h1 className="text-2xl font-bold text-clinic-navy">Medical and contact record</h1>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <input className="field" value={profile.name || ""} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        <input className="field" value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
        <input className="field" value={profile.email || ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
        <input className="field" type="number" value={profile.age || ""} onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })} />
        <textarea className="field md:col-span-2" rows="3" value={profile.address || ""} onChange={(e) => setProfile({ ...profile, address: e.target.value })} placeholder="Address" />
        <textarea className="field md:col-span-2" rows="4" value={profile.medicalHistory || ""} onChange={(e) => setProfile({ ...profile, medicalHistory: e.target.value })} placeholder="Medical history" />
        <input className="field md:col-span-2" value={(profile.allergies || []).join(", ")} onChange={(e) => setProfile({ ...profile, allergies: e.target.value })} placeholder="Allergies, comma-separated" />
      </div>
      <button className="btn-primary mt-4"><Save className="h-4 w-4" /> Save profile</button>
      {message && <p className="mt-3 text-sm font-semibold text-clinic-teal">{message}</p>}
    </form>
  );
}
