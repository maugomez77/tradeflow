const statusStyles: Record<string, string> = {
  // Job statuses
  scheduled: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  invoiced: "bg-purple-100 text-purple-800",
  // Compliance
  valid: "bg-green-100 text-green-800",
  expiring: "bg-yellow-100 text-yellow-800",
  expired: "bg-red-100 text-red-800",
  // Equipment
  operational: "bg-green-100 text-green-800",
  needs_service: "bg-yellow-100 text-yellow-800",
  out_of_service: "bg-red-100 text-red-800",
  // Generic
  available: "bg-green-100 text-green-800",
  on_job: "bg-blue-100 text-blue-800",
  off_duty: "bg-slate-100 text-slate-800",
  // Customer types
  residential: "bg-blue-100 text-blue-800",
  commercial: "bg-indigo-100 text-indigo-800",
};

const labelMap: Record<string, string> = {
  in_progress: "In Progress",
  needs_service: "Needs Service",
  out_of_service: "Out of Service",
  on_job: "On Job",
  off_duty: "Off Duty",
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] || "bg-slate-100 text-slate-800";
  const label =
    labelMap[status] || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style}`}
    >
      {label}
    </span>
  );
}
