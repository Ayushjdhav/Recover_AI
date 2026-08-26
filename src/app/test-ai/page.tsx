import { getAIRecoveryDecision } from "@/lib/ai-agent";

export default async function TestAIPage() {
  const decision = await getAIRecoveryDecision({
    amount: 4999,
    failureReason: "INSUFFICIENT_FUNDS",
    successfulPayments: 8,
    failedPayments: 1,
    retryCount: 0,
    recoveryScore: 90,
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">AI Decision</h1>
      <pre className="mt-4 bg-slate-100 p-4 rounded">
        {JSON.stringify(decision, null, 2)}
      </pre>
    </div>
  );
}