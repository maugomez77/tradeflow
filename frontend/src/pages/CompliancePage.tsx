import { useState, useEffect } from "react";
import { fetchCompliance, ComplianceItem } from "../api/compliance";
import StatusBadge from "../components/ui/StatusBadge";

const categoryLabels: Record<string, string> = {
  license: "License",
  permit: "Permit",
  insurance: "Insurance",
  certification: "Certification",
};

export default function CompliancePage() {
  const [items, setItems] = useState<ComplianceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchCompliance()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter ? items.filter((i) => i.status === filter) : items;

  const counts = {
    valid: items.filter((i) => i.status === "valid").length,
    expiring: items.filter((i) => i.status === "expiring").length,
    expired: items.filter((i) => i.status === "expired").length,
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-sm text-slate-400">
        Loading compliance data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Compliance Tracker</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => setFilter(filter === "valid" ? "" : "valid")}
          className={`rounded-xl p-4 text-center border transition-colors ${
            filter === "valid"
              ? "bg-green-50 border-green-300"
              : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
        >
          <p className="text-2xl font-bold text-green-600">{counts.valid}</p>
          <p className="text-xs text-slate-500">Valid</p>
        </button>
        <button
          onClick={() => setFilter(filter === "expiring" ? "" : "expiring")}
          className={`rounded-xl p-4 text-center border transition-colors ${
            filter === "expiring"
              ? "bg-yellow-50 border-yellow-300"
              : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
        >
          <p className="text-2xl font-bold text-yellow-600">
            {counts.expiring}
          </p>
          <p className="text-xs text-slate-500">Expiring Soon</p>
        </button>
        <button
          onClick={() => setFilter(filter === "expired" ? "" : "expired")}
          className={`rounded-xl p-4 text-center border transition-colors ${
            filter === "expired"
              ? "bg-red-50 border-red-300"
              : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
        >
          <p className="text-2xl font-bold text-red-600">{counts.expired}</p>
          <p className="text-xs text-slate-500">Expired</p>
        </button>
      </div>

      {/* Compliance Items */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                Item
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase hidden sm:table-cell">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase hidden md:table-cell">
                Authority
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase hidden lg:table-cell">
                Reference
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                Expiry
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <tr
                key={item.id}
                className={`${
                  item.status === "expired"
                    ? "bg-red-50/50"
                    : item.status === "expiring"
                    ? "bg-yellow-50/50"
                    : ""
                }`}
              >
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">
                    {item.name}
                  </p>
                  {item.notes && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.notes}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700 hidden sm:table-cell">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                    {categoryLabels[item.category] || item.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 hidden md:table-cell">
                  {item.issuing_authority}
                </td>
                <td className="px-4 py-3 text-xs font-mono text-slate-500 hidden lg:table-cell">
                  {item.reference_number}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {item.expiry_date}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-slate-400"
                >
                  No compliance items match the filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
