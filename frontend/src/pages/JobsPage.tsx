import { useState, useEffect } from "react";
import { fetchJobs, Job } from "../api/jobs";
import StatusBadge from "../components/ui/StatusBadge";

const statusFilters = [
  { value: "", label: "All" },
  { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "invoiced", label: "Invoiced" },
];

const typeLabels: Record<string, string> = {
  plumbing: "Plumbing",
  hvac: "HVAC",
  electrical: "Electrical",
  general: "General",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchJobs(statusFilter ? { status: statusFilter } : undefined)
      .then(setJobs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const filtered = jobs.filter(
    (j) =>
      !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      j.technician_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Work Orders</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === f.value
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Jobs Table */}
      {loading ? (
        <div className="text-center py-12 text-sm text-slate-400">
          Loading jobs...
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Job #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase hidden sm:table-cell">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase hidden md:table-cell">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase hidden lg:table-cell">
                    Technician
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase hidden lg:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((job) => (
                  <>
                    <tr
                      key={job.id}
                      className="cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() =>
                        setExpanded(expanded === job.id ? null : job.id)
                      }
                    >
                      <td className="px-4 py-3 text-sm font-mono text-slate-500">
                        {job.id.toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 max-w-[200px] truncate">
                        {job.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 hidden sm:table-cell">
                        {job.customer_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 hidden md:table-cell">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                          {typeLabels[job.type] || job.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 hidden lg:table-cell">
                        {job.technician_name}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 text-right">
                        $
                        {(
                          job.actual_cost || job.estimated_cost
                        ).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 hidden lg:table-cell">
                        {job.scheduled_date}
                      </td>
                    </tr>
                    {expanded === job.id && (
                      <tr key={`${job.id}-detail`}>
                        <td
                          colSpan={8}
                          className="px-6 py-4 bg-slate-50 border-t border-slate-100"
                        >
                          <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-semibold text-slate-900 mb-1">
                                Description
                              </p>
                              <p className="text-slate-600">
                                {job.description}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <span className="font-semibold text-slate-900">
                                  Address:{" "}
                                </span>
                                <span className="text-slate-600">
                                  {job.address}
                                </span>
                              </div>
                              <div>
                                <span className="font-semibold text-slate-900">
                                  Estimated:{" "}
                                </span>
                                <span className="text-slate-600">
                                  ${job.estimated_cost.toLocaleString()}
                                </span>
                              </div>
                              {job.actual_cost && (
                                <div>
                                  <span className="font-semibold text-slate-900">
                                    Actual:{" "}
                                  </span>
                                  <span className="text-slate-600">
                                    ${job.actual_cost.toLocaleString()}
                                  </span>
                                </div>
                              )}
                              {job.completed_date && (
                                <div>
                                  <span className="font-semibold text-slate-900">
                                    Completed:{" "}
                                  </span>
                                  <span className="text-slate-600">
                                    {job.completed_date}
                                  </span>
                                </div>
                              )}
                              {job.notes && (
                                <div>
                                  <span className="font-semibold text-slate-900">
                                    Notes:{" "}
                                  </span>
                                  <span className="text-slate-600">
                                    {job.notes}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-sm text-slate-400"
                    >
                      No jobs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
