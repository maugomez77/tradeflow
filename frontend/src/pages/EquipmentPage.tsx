import { useState, useEffect } from "react";
import { fetchEquipment, Equipment } from "../api/equipment";
import StatusBadge from "../components/ui/StatusBadge";

function healthColor(score: number): string {
  if (score >= 80) return "text-green-600 bg-green-50";
  if (score >= 60) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
}

function healthBarColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
}

const typeLabels: Record<string, string> = {
  vehicle: "Vehicle",
  tool: "Tool",
  heavy_equipment: "Heavy Equipment",
};

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Equipment | null>(null);

  useEffect(() => {
    fetchEquipment()
      .then(setEquipment)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12 text-sm text-slate-400">
        Loading equipment...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Equipment Fleet</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">
            {equipment.length}
          </p>
          <p className="text-xs text-slate-500">Total Items</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {equipment.filter((e) => e.status === "operational").length}
          </p>
          <p className="text-xs text-slate-500">Operational</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {equipment.filter((e) => e.status === "needs_service").length}
          </p>
          <p className="text-xs text-slate-500">Needs Service</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">
            {equipment.filter((e) => e.status === "out_of_service").length}
          </p>
          <p className="text-xs text-slate-500">Out of Service</p>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipment.map((eq) => (
          <div
            key={eq.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelected(selected?.id === eq.id ? null : eq)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {eq.name}
                </h3>
                <span className="text-xs text-slate-500">
                  {typeLabels[eq.type] || eq.type}
                </span>
              </div>
              <StatusBadge status={eq.status} />
            </div>

            {/* Health Score */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-600">
                  Health Score
                </span>
                <span
                  className={`text-sm font-bold px-2 py-0.5 rounded ${healthColor(
                    eq.health_score
                  )}`}
                >
                  {eq.health_score}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${healthBarColor(
                    eq.health_score
                  )}`}
                  style={{ width: `${eq.health_score}%` }}
                />
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              {eq.assigned_to && (
                <p>
                  Assigned to: <span className="font-medium">{eq.assigned_to}</span>
                </p>
              )}
              <p>
                Last service: <span className="font-medium">{eq.last_service}</span>
              </p>
              <p>
                Next service: <span className="font-medium">{eq.next_service}</span>
              </p>
              <p>
                Value:{" "}
                <span className="font-medium">
                  ${eq.value.toLocaleString()}
                </span>
              </p>
            </div>

            {eq.notes && (
              <p className="mt-2 text-xs text-yellow-700 bg-yellow-50 px-2 py-1 rounded">
                {eq.notes}
              </p>
            )}

            {/* Expanded: Maintenance History */}
            {selected?.id === eq.id && eq.maintenance_history.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-900 mb-2">
                  Maintenance History
                </h4>
                <div className="space-y-2">
                  {eq.maintenance_history.map((m, i) => (
                    <div
                      key={i}
                      className="text-xs bg-slate-50 rounded-lg p-2"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-700">
                          {m.date}
                        </span>
                        <span className="text-slate-500">
                          ${m.cost.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{m.description}</p>
                      <p className="text-slate-400 mt-0.5">
                        By: {m.technician}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
