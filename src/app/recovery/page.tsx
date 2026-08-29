import { getRecoveryCasesWithDetails } from "@/lib/queries";
import { getOrCreateAIDecision } from "@/lib/recovery-actions";
import { evaluatePolicy } from "@/lib/policy-engine";
import ApprovalButtons from "@/components/recovery/ApprovalButtons";

const actionStyles: Record<string, string> = {
  RETRY: "bg-indigo-50 text-indigo-700 border-indigo-200",
  REMIND: "bg-blue-50 text-blue-700 border-blue-200",
  ESCALATE: "bg-amber-50 text-amber-700 border-amber-200",
  STOP: "bg-red-50 text-red-700 border-red-200",
};

const outcomeStyles: Record<string, string> = {
  ALLOWED: "bg-emerald-50 text-emerald-700",
  REQUIRES_APPROVAL: "bg-amber-50 text-amber-700",
  BLOCKED: "bg-red-50 text-red-700",
};

export default async function RecoveryCenterPage() {
  const cases = await getRecoveryCasesWithDetails();

  const casesWithDecisions = await Promise.all(
    cases.map(async (recoveryCase: any) => {
      const decision = await getOrCreateAIDecision(recoveryCase);

      let policyResult = null;
      if (decision) {
        policyResult = evaluatePolicy({
          action: decision.action,
          amount: Number(recoveryCase.payments?.amount),
          retryCount: recoveryCase.retry_count,
          caseStatus: recoveryCase.status,
        });
      }

      return { ...recoveryCase, decision, policyResult };
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Recovery Center</h2>
        <p className="text-sm text-slate-500 mt-1">
          AI-analyzed recovery cases with reasoning and policy validation
        </p>
      </div>

      <div className="space-y-4">
        {casesWithDecisions.map((item: any) => {
          const payment = item.payments;
          const customer = payment?.customers;
          const decision = item.decision;
          const policy = item.policyResult;

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
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-semibold border ${actionStyles[decision.action]}`}
                    >
                      AI recommends: {decision.action}
                    </span>
                    <span className="text-xs text-slate-500">
                      Confidence: {decision.confidence}%
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{decision.ai_reason}</p>

                  {policy && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span
                              className={`px-3 py-1 rounded-md text-xs font-semibold ${outcomeStyles[policy.outcome]}`}
                            >
                              Policy: {policy.outcome}
                            </span>
                            {policy.finalAction !== decision.action && (
                              <span className="text-xs text-slate-500">
                                Final action: {policy.finalAction}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{policy.reason}</p>
                        </div>

                        {policy.outcome === "REQUIRES_APPROVAL" &&
                          decision.status === "PENDING" && (
                            <ApprovalButtons actionId={decision.id} caseId={item.id} />
                          )}
                      </div>
                    </div>
                  )}
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