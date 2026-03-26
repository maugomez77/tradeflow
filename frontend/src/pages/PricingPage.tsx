import { useState, useEffect } from "react";
import {
  fetchPricingRules,
  calculatePrice,
  PricingRule,
  PriceCalculation,
} from "../api/pricing";

export default function PricingPage() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculator state
  const [jobType, setJobType] = useState("plumbing");
  const [hours, setHours] = useState(2);
  const [isEmergency, setIsEmergency] = useState(false);
  const [isWeekend, setIsWeekend] = useState(false);
  const [isPeak, setIsPeak] = useState(false);
  const [result, setResult] = useState<PriceCalculation | null>(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    fetchPricingRules()
      .then(setRules)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCalculate = async () => {
    setCalculating(true);
    try {
      const calc = await calculatePrice({
        job_type: jobType,
        hours,
        is_emergency: isEmergency,
        is_weekend: isWeekend,
        is_peak: isPeak,
      });
      setResult(calc);
    } catch (err) {
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-sm text-slate-400">
        Loading pricing...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Dynamic Pricing</h1>

      {/* Pricing Rules */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-5"
          >
            <h3 className="text-sm font-semibold text-slate-900">
              {rule.name}
            </h3>
            <p className="mt-2 text-3xl font-extrabold text-blue-600">
              ${rule.base_rate}
              <span className="text-sm font-normal text-slate-500 ml-1">
                /hr
              </span>
            </p>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Peak Hours</span>
                <span className="font-semibold text-slate-900">
                  {rule.peak_multiplier}x
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Emergency</span>
                <span className="font-semibold text-red-600">
                  {rule.emergency_multiplier}x
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Weekend</span>
                <span className="font-semibold text-slate-900">
                  {rule.weekend_multiplier}x
                </span>
              </div>
              {rule.seasonal_adjustment !== 1.0 && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Seasonal</span>
                  <span className="font-semibold text-yellow-600">
                    {rule.seasonal_adjustment}x
                  </span>
                </div>
              )}
            </div>
            {rule.notes && (
              <p className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-3">
                {rule.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Price Calculator */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            Price Calculator
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="plumbing">Plumbing</option>
                <option value="hvac">HVAC</option>
                <option value="electrical">Electrical</option>
                <option value="general">General</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Estimated Hours
              </label>
              <input
                type="number"
                min={0.5}
                step={0.5}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-slate-700">
                  Emergency / After-Hours
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isWeekend}
                  onChange={(e) => setIsWeekend(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-slate-700">
                  Weekend Service
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPeak}
                  onChange={(e) => setIsPeak(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-slate-700">
                  Peak Hours (10AM - 2PM)
                </span>
              </label>
            </div>

            <button
              onClick={handleCalculate}
              disabled={calculating}
              className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {calculating ? "Calculating..." : "Calculate Price"}
            </button>
          </div>
        </div>

        {/* Result */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            Quote Estimate
          </h3>
          {result ? (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Base Rate</span>
                  <span className="font-medium text-slate-900">
                    ${result.base_rate}/hr
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Hours</span>
                  <span className="font-medium text-slate-900">
                    {result.hours}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Multiplier</span>
                  <span className="font-medium text-slate-900">
                    {result.multiplier}x
                  </span>
                </div>

                {/* Multiplier reasons */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-slate-700 mb-1">
                    Applied rates:
                  </p>
                  {result.multiplier_reasons.map((r, i) => (
                    <p key={i} className="text-xs text-slate-600">
                      &bull; {r}
                    </p>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium text-slate-900">
                      ${result.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-slate-600">Tax (8.75%)</span>
                    <span className="font-medium text-slate-900">
                      ${result.tax.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="border-t-2 border-slate-900 pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-bold text-slate-900">
                      Total
                    </span>
                    <span className="text-2xl font-extrabold text-blue-600">
                      ${result.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-sm text-slate-400">
              Configure options and click Calculate
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
