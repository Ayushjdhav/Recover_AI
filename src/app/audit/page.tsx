import { getAuditTrail } from "@/lib/queries";

const actionStyles: Record<string, string> = {
  RETRY: "bg-indigo-50 text-indigo-700",
  REMIND: "bg-blue-50 text-blue-700",
  ESCALATE: "bg-amber-50 text-amber-700",
  STOP: "bg-red-50 text-red-700",
};

export default async function AuditLogsPage() {
  const trail = await getAuditTrail();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Audit Logs</h2>
        <p className="text-sm text-slate-500 mt-1">
          Full record of every AI decision made across recovery cases
        </p>
      </div>

      <div className="space-y-3">
        {trail.map((entry: any) => {
          const recoveryCase = entry.recovery_cases;
          const payment = recoveryCase?.payments;
          const customer = payment?.customers;

          return (
            <div
              key={entry.id}
              className="bg-white border border-slate-200 rounded-xl p-5"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${actionStyles[entry.action]}`}
                  >
                    {entry.action}
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {customer?.name ?? "Unknown customer"}
                  </span>
                  <span className="text-sm text-slate-500">
                    ₹{Number(payment?.amount).toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  Score: {recoveryCase?.recovery_score}/100 · Confidence:{" "}
                  {entry.confidence}%
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-2">{entry.ai_reason}</p>
              <p className="text-xs text-slate-400 mt-2">
                Failure reason: {payment?.failure_reason} · Case status:{" "}
                {recoveryCase?.status} · Action status: {entry.status}
              </p>
            </div>
          );
        })}

        {trail.length === 0 && (
          <p className="text-sm text-slate-500">No audit records yet.</p>
        )}
      </div>
    </div>
  );
}