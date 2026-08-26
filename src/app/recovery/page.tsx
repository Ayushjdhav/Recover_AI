import { getRecoveryCasesWithDetails } from "@/lib/queries";
import { getOrCreateAIDecision } from "@/lib/recovery-actions";

const actionStyles: Record<string, string> = {
  RETRY: "bg-indigo-50 text-indigo-700 border-indigo-200",
  REMIND: "bg-blue-50 text-blue-700 border-blue-200",
  ESCALATE: "bg-amber-50 text-amber-700 border-amber-200",
  STOP: "bg-red-50 text-red-700 border-red-200",
};

export default async function RecoveryCenterPage() {
  const cases = await getRecoveryCasesWithDetails();

  const casesWithDecisions = await Promise.all(
    cases.map(async (recoveryCase: any) => {
      const decision = await getOrCreateAIDecision(recoveryCase);
      return { ...recoveryCase, decision };
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Recovery Center</h2>
        <p className="text-sm text-slate-500 mt-1">
          AI-analyzed recovery cases with reasoning and confidence
        </p>
      </div>

      <div className="space-y-4">
        {casesWithDecisions.map((item: any) => {
          const payment = item.payments;
          const customer = payment?.customers;
          const decision = item.decision;

          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{customer?.name}</h3>
                  <p className="text-sm text-slate-500">
                    ₹{Number(payment?.amount).toLocaleString("en-IN")} ·{" "}
                    {payment?.failure_reason}
                  </p>
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Score: {item.recovery_score}/100
                </span>
              </div>

              {decision ? (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-semibold border ${actionStyles[decision.action]}`}
                    >
                      {decision.action}
                    </span>
                    <span className="text-xs text-slate-500">
                      Confidence: {decision.confidence}%
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{decision.ai_reason}</p>
                </div>
              ) : (
                <p className="text-sm text-red-500 mt-4">
                  AI decision unavailable for this case.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}