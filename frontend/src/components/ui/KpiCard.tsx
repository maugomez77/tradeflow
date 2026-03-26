interface KpiCardProps {
  icon: string;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export default function KpiCard({
  icon,
  label,
  value,
  trend,
  trendUp,
  color = "text-blue-600",
}: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          {trend && (
            <p
              className={`mt-1 text-sm font-medium ${
                trendUp ? "text-green-600" : "text-red-600"
              }`}
            >
              {trendUp ? "\u2191" : "\u2193"} {trend}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
            color === "text-blue-600"
              ? "bg-blue-50"
              : color === "text-green-600"
              ? "bg-green-50"
              : color === "text-yellow-600"
              ? "bg-yellow-50"
              : color === "text-purple-600"
              ? "bg-purple-50"
              : "bg-slate-50"
          }`}
        >
          <span>{icon}</span>
        </div>
      </div>
    </div>
  );
}
