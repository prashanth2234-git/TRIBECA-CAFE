import { Activity, Calendar, ClipboardList, LayoutDashboard, LogOut, Menu, Users } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/patient", label: "Patient", icon: Calendar, roles: ["patient"] },
  { to: "/book", label: "Book", icon: ClipboardList, roles: ["patient", "admin", "receptionist"] },
  { to: "/doctor", label: "Doctor", icon: Activity, roles: ["doctor"] },
  { to: "/admin", label: "Admin", icon: LayoutDashboard, roles: ["admin", "receptionist"] },
  { to: "/queue", label: "Queue", icon: Users, roles: ["patient", "doctor", "admin", "receptionist"] },
  { to: "/reports", label: "Reports", icon: ClipboardList, roles: ["admin", "receptionist"] }
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const visible = navItems.filter((item) => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-[#f6fbf9]">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-bold text-clinic-navy">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-clinic-teal text-white">CF</span>
            ClinicFlow AI
          </Link>
          <button className="btn-secondary md:hidden" onClick={() => setOpen((value) => !value)} title="Menu">
            <Menu className="h-4 w-4" />
          </button>
          <nav className="hidden items-center gap-2 md:flex">
            {visible.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-clinic-mint text-clinic-navy" : "text-slate-600 hover:bg-slate-100"}`}>
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
            <button onClick={logout} className="btn-secondary" title="Log out">
              <LogOut className="h-4 w-4" />
            </button>
          </nav>
        </div>
        {open && (
          <nav className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
            <div className="grid gap-2">
              {visible.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
              <button onClick={logout} className="btn-secondary justify-start"><LogOut className="h-4 w-4" /> Log out</button>
            </div>
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
