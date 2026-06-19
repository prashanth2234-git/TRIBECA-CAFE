import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", age: "", gender: "prefer-not-to-say", role: "patient" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await register({ ...form, age: form.age ? Number(form.age) : undefined });
      navigate("/patient");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#f6fbf9] px-4">
      <form onSubmit={submit} className="panel w-full max-w-xl p-6">
        <Link to="/" className="text-sm font-semibold text-clinic-teal">ClinicFlow AI</Link>
        <h1 className="mt-3 text-2xl font-bold text-clinic-navy">Patient registration</h1>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
          <input className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
          <input className="field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
          <input className="field" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
          <input className="field" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Age" />
          <select className="field" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            <option value="prefer-not-to-say">Prefer not to say</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
        {error && <p className="mt-3 rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</p>}
        <button className="btn-primary mt-4" disabled={loading}><UserPlus className="h-4 w-4" /> Create account</button>
      </form>
    </div>
  );
}
