import { getFailedPaymentsWithCustomers } from "@/lib/queries";
import { calculateRecoveryScore } from "@/lib/recovery-engine";
import { createRecoveryCaseForPayment } from "@/lib/recovery-actions";

export default async function PaymentsPage() {
  const payments = await getFailedPaymentsWithCustomers();

  // Ensure every failed payment has a recovery case
  for (const payment of payments) {
    await createRecoveryCaseForPayment(payment);
  }

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
              <th className="px-5 py-3 font-medium">Recovery Score</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment: any) => {
              const { score } = calculateRecoveryScore({
                amount: Number(payment.amount),
                failureReason: payment.failure_reason,
                successfulPayments: payment.customers?.total_successful_payments ?? 0,
                failedPayments: payment.customers?.total_failed_payments ?? 0,
                retryCount: 0,
              });

              const scoreColor =
                score >= 70
                  ? "text-emerald-600"
                  : score >= 40
                  ? "text-amber-600"
                  : "text-red-600";

              return (
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
                  <td className={`px-5 py-3 font-semibold ${scoreColor}`}>
                    {score}/100
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}