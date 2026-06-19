import { Activity, ArrowRight, BarChart3, CalendarCheck, Clock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import AssistantWidget from "../components/AssistantWidget";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f6fbf9]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-clinic-navy">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-clinic-teal text-white">CF</span>
            ClinicFlow AI
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-secondary">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </div>
        </div>
      </header>
      <main>
        <section className="bg-[linear-gradient(135deg,#12343B_0%,#0E7C7B_55%,#F6FBF9_55%)]">
          <div className="mx-auto grid min-h-[560px] max-w-7xl items-center gap-8 px-4 py-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl text-white">
              <p className="text-sm font-semibold uppercase tracking-wide text-clinic-mint">NIAT BRAVE clinic operations platform</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">ClinicFlow AI</h1>
              <p className="mt-4 text-lg text-white/90">A smart appointment and live queue system that helps local clinics reduce waiting time, protect doctor calendars, and turn daily operations into measurable reports.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/book" className="btn-primary bg-white text-clinic-navy hover:bg-clinic-mint">
                  Book appointment <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/queue" className="btn-secondary border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                  View queue
                </Link>
              </div>
            </div>
            <div className="panel overflow-hidden">
              <div className="bg-clinic-navy p-5 text-white">
                <p className="text-sm text-clinic-mint">Today at Sunrise Family Clinic</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div><p className="text-3xl font-bold">42</p><p className="text-xs text-white/70">Patients</p></div>
                  <div><p className="text-3xl font-bold">18m</p><p className="text-xs text-white/70">Avg wait</p></div>
                  <div><p className="text-3xl font-bold">96%</p><p className="text-xs text-white/70">Slots used</p></div>
                </div>
              </div>
              <div className="grid gap-3 p-5">
                {[
                  ["T004", "Current token", "Consultation 1"],
                  ["T005", "Next token", "Please be ready"],
                  ["T006", "Patients ahead", "Estimated 24 minutes"]
                ].map((row) => (
                  <div key={row[0]} className="flex items-center justify-between rounded-md border border-slate-200 p-3">
                    <div><p className="font-semibold text-clinic-navy">{row[1]}</p><p className="text-sm text-slate-500">{row[2]}</p></div>
                    <span className="rounded-md bg-clinic-mint px-3 py-2 font-bold text-clinic-navy">{row[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-3">
          {[
            [CalendarCheck, "Appointment control", "Prevent double booking and unavailable-slot bookings automatically."],
            [Clock, "Live queue visibility", "Token numbers, patients ahead, and estimated wait time update in real time."],
            [BarChart3, "Business analytics", "Track patient volume, cancellations, completion rate, and doctor performance."],
            [Activity, "Doctor workflow", "Doctors can complete visits, add consultation notes, and generate prescription PDFs."],
            [ShieldCheck, "Secure roles", "JWT authentication, role-based access, validation, Helmet, CORS, and rate limits."],
            [ArrowRight, "AI clinic assistant", "Answers clinic FAQs while avoiding diagnosis and medical advice."]
          ].map(([Icon, title, text]) => (
            <div key={title} className="panel p-5">
              <Icon className="h-7 w-7 text-clinic-teal" />
              <h3 className="mt-3 font-semibold text-clinic-navy">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </section>
        <section className="mx-auto max-w-7xl px-4 pb-10">
          <AssistantWidget />
        </section>
      </main>
    </div>
  );
}
