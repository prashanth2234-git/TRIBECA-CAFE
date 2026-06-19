import { LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function target(role) {
  if (role === "doctor") return "/doctor";
  if (role === "admin" || role === "receptionist") return "/admin";
  return "/patient";
}

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "admin@clinicflow.ai", password: "password123" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      const user = await login(form.email, form.password);
      navigate(target(user.role));
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#f6fbf9] px-4">
      <form onSubmit={submit} className="panel w-full max-w-md p-6">
        <Link to="/" className="text-sm font-semibold text-clinic-teal">ClinicFlow AI</Link>
        <h1 className="mt-3 text-2xl font-bold text-clinic-navy">Login</h1>
        <div className="mt-5 grid gap-3">
          <input className="field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
          <input className="field" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
          {error && <p className="rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</p>}
          <button className="btn-primary" disabled={loading}><LogIn className="h-4 w-4" /> Login</button>
        </div>
        <p className="mt-4 text-sm text-slate-500">No account? <Link className="font-semibold text-clinic-teal" to="/register">Register as patient</Link></p>
      </form>
    </div>
  );
}
