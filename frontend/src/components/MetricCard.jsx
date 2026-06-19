export default function MetricCard({ icon: Icon, label, value, helper }) {
  return (
    <div className="stat">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-clinic-navy">{value}</p>
        </div>
        {Icon && <Icon className="h-8 w-8 text-clinic-teal" aria-hidden="true" />}
      </div>
      {helper && <p className="mt-2 text-xs text-slate-500">{helper}</p>}
    </div>
  );
}
