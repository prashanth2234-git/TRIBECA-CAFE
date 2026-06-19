import { BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import MetricCard from "../components/MetricCard";
import api from "../services/api";

const colors = ["#0E7C7B", "#F06449", "#12343B", "#8EC3B0", "#A855F7"];

export default function ReportsPage() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    api.get("/reports/dashboard").then(({ data }) => setReport(data));
  }, []);

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-clinic-teal">Reports</p>
        <h1 className="text-3xl font-bold text-clinic-navy">Business performance dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard icon={BarChart3} label="Total patients" value={report?.totalPatients ?? "--"} />
        <MetricCard icon={BarChart3} label="Today's appointments" value={report?.todayAppointments ?? "--"} />
        <MetricCard icon={BarChart3} label="Cancelled" value={report?.cancelledAppointments ?? "--"} />
        <MetricCard icon={BarChart3} label="Average wait" value={`${report?.averageWaitingTime ?? 0}m`} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-4">
          <h2 className="mb-4 font-semibold text-clinic-navy">Doctor-wise performance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report?.doctorWisePerformance || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="doctor" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#12343B" />
                <Bar dataKey="completed" fill="#0E7C7B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel p-4">
          <h2 className="mb-4 font-semibold text-clinic-navy">Appointment status</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={report?.statusBreakdown || []} dataKey="value" nameKey="name" outerRadius={100} label>
                  {(report?.statusBreakdown || []).map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
