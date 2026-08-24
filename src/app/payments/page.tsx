import { getFailedPaymentsWithCustomers } from "@/lib/queries";

export default async function PaymentsPage() {
  const payments = await getFailedPaymentsWithCustomers();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Payments</h2>
        <p className="text-sm text-slate-500 mt-1">
          Failed payments awaiting recovery
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Failure Reason</th>
              <th className="px-5 py-3 font-medium">Payment History</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment: any) => (
              <tr key={payment.id} className="border-b border-slate-100 last:border-0">
                <td className="px-5 py-3 text-slate-900 font-medium">
                  {payment.customers?.name}
                </td>
                <td className="px-5 py-3 text-slate-700">
                  ₹{Number(payment.amount).toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-3 text-slate-500">{payment.failure_reason}</td>
                <td className="px-5 py-3 text-slate-500">
                  {payment.customers?.total_successful_payments} success /{" "}
                  {payment.customers?.total_failed_payments} failed
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}