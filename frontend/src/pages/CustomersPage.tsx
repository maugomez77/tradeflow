import { useState, useEffect } from "react";
import {
  fetchCustomers,
  fetchCustomerDetail,
  Customer,
  CustomerDetail,
} from "../api/customers";
import StatusBadge from "../components/ui/StatusBadge";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDetail, setSelectedDetail] = useState<CustomerDetail | null>(
    null
  );
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchCustomers()
      .then(setCustomers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSelectCustomer = async (id: string) => {
    if (selectedDetail?.customer.id === id) {
      setSelectedDetail(null);
      return;
    }
    setDetailLoading(true);
    try {
      const detail = await fetchCustomerDetail(id);
      setSelectedDetail(detail);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-sm text-slate-400">
        Loading customers...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Customers</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase hidden sm:table-cell">
                    Type
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">
                    Total Spent
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase hidden sm:table-cell">
                    Jobs
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase hidden md:table-cell">
                    Last Service
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr
                    key={c.id}
                    className={`cursor-pointer transition-colors ${
                      selectedDetail?.customer.id === c.id
                        ? "bg-blue-50"
                        : "hover:bg-slate-50"
                    }`}
                    onClick={() => handleSelectCustomer(c.id)}
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-900">
                        {c.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate max-w-[200px]">
                        {c.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <StatusBadge status={c.type} />
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 text-right">
                      ${c.total_spent.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 text-right hidden sm:table-cell">
                      {c.job_count}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500 hidden md:table-cell">
                      {c.last_service || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Detail */}
        <div>
          {detailLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center text-sm text-slate-400">
              Loading details...
            </div>
          ) : selectedDetail ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedDetail.customer.name}
                </h3>
                <StatusBadge status={selectedDetail.customer.type} />
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>{selectedDetail.customer.address}</p>
                  <p>{selectedDetail.customer.phone}</p>
                  <p>{selectedDetail.customer.email}</p>
                  {selectedDetail.customer.notes && (
                    <p className="text-xs bg-slate-50 p-2 rounded mt-2">
                      {selectedDetail.customer.notes}
                    </p>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-slate-900">
                      ${selectedDetail.customer.total_spent.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">Total Spent</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-slate-900">
                      {selectedDetail.customer.job_count}
                    </p>
                    <p className="text-xs text-slate-500">Total Jobs</p>
                  </div>
                </div>
              </div>

              {/* Job History */}
              <div className="p-4">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">
                  Job History
                </h4>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {selectedDetail.jobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-slate-50 rounded-lg p-3 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-900 truncate max-w-[160px]">
                          {job.title}
                        </span>
                        <StatusBadge status={job.status} />
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>{job.scheduled_date}</span>
                        <span className="font-medium text-slate-700">
                          $
                          {(
                            job.actual_cost || job.estimated_cost
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {selectedDetail.jobs.length === 0 && (
                    <p className="text-xs text-slate-400">
                      No jobs on record
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
              <p className="text-sm text-slate-400">
                Select a customer to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
