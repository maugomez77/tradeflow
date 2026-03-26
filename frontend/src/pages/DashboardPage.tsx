import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { fetchDashboard, DashboardMetrics } from "../api/dashboard";
import KpiCard from "../components/ui/KpiCard";
import StatusBadge from "../components/ui/StatusBadge";

const PIE_COLORS = ["#2563eb", "#eab308", "#22c55e", "#a855f7"];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400 text-sm">Loading dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 text-sm">
          Failed to load dashboard. Make sure the API is running on port 8000.
        </div>
      </div>
    );
  }

  const pieData = [
    { name: "Scheduled", value: data.jobs_by_status.scheduled },
    { name: "In Progress", value: data.jobs_by_status.in_progress },
    { name: "Completed", value: data.jobs_by_status.completed },
    { name: "Invoiced", value: data.jobs_by_status.invoiced },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon="$"
          label="Total Revenue"
          value={`$${data.total_revenue.toLocaleString()}`}
          trend="12% vs last month"
          trendUp={true}
          color="text-green-600"
        />
        <KpiCard
          icon="#"
          label="Active Jobs"
          value={String(data.active_jobs)}
          trend="3 new this week"
          trendUp={true}
          color="text-blue-600"
        />
        <KpiCard
          icon="H"
          label="Equipment Health"
          value={`${data.equipment_health_avg}%`}
          trend={data.equipment_health_avg >= 80 ? "Good condition" : "Needs attention"}
          trendUp={data.equipment_health_avg >= 80}
          color="text-yellow-600"
        />
        <KpiCard
          icon="C"
          label="Compliance Score"
          value={`${data.compliance_score}%`}
          trend={
            data.compliance_deadlines.length > 0
              ? `${data.compliance_deadlines.length} items need attention`
              : "All current"
          }
          trendUp={data.compliance_score >= 80}
          color="text-purple-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            Revenue (Last 12 Months)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.revenue_by_month}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => v.split(" ")[0]}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Jobs by Status */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            Jobs by Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={PIE_COLORS[i % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-900">
              Recent Jobs
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {data.recent_jobs.map((job) => (
              <div key={job.id} className="px-6 py-3 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {job.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {job.customer_name} &middot; {job.technician_name}
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-900">
                    ${(job.actual_cost || job.estimated_cost).toLocaleString()}
                  </span>
                  <StatusBadge status={job.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Deadlines */}
        <div className="space-y-6">
          {/* Equipment Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">
                Equipment Alerts
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {data.equipment_alerts.length === 0 ? (
                <div className="px-6 py-4 text-sm text-slate-400">
                  All equipment in good condition
                </div>
              ) : (
                data.equipment_alerts.map((eq) => (
                  <div
                    key={eq.id}
                    className="px-6 py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {eq.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Health: {eq.health_score}% &middot; Next service:{" "}
                        {eq.next_service}
                      </p>
                    </div>
                    <StatusBadge status={eq.status} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Compliance Deadlines */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">
                Compliance Deadlines
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {data.compliance_deadlines.length === 0 ? (
                <div className="px-6 py-4 text-sm text-slate-400">
                  All compliance items current
                </div>
              ) : (
                data.compliance_deadlines.map((c) => (
                  <div
                    key={c.id}
                    className="px-6 py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {c.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Expires: {c.expiry_date}
                      </p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">
                Top Customers
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {data.top_customers.map((c) => (
                <div
                  key={c.id}
                  className="px-6 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {c.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {c.job_count} jobs
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    ${c.total_spent.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
