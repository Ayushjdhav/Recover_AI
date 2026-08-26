import { supabase } from "@/lib/supabase";
import { calculateRecoveryScore } from "@/lib/recovery-engine";
import { getAIRecoveryDecision } from "@/lib/ai-agent";


export async function createRecoveryCaseForPayment(payment: any) {
  const { data: existing } = await supabase
    .from("recovery_cases")
    .select("id")
    .eq("payment_id", payment.id)
    .maybeSingle();

  if (existing) {
    return existing;
  }

  const { score } = calculateRecoveryScore({
    amount: Number(payment.amount),
    failureReason: payment.failure_reason,
    successfulPayments: payment.customers?.total_successful_payments ?? 0,
    failedPayments: payment.customers?.total_failed_payments ?? 0,
    retryCount: 0,
  });

  const { data, error } = await supabase
    .from("recovery_cases")
    .insert({
      payment_id: payment.id,
      recovery_score: score,
      status: "OPEN",
      retry_count: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating recovery case:", error);
    return null;
  }

  return data;
}



export async function getOrCreateAIDecision(recoveryCase: any) {
  // Check if we already have an action recorded for this case
  const { data: existing } = await supabase
    .from("recovery_actions")
    .select("*")
    .eq("recovery_case_id", recoveryCase.id)
    .maybeSingle();

  if (existing) {
    return existing;
  }

  const payment = recoveryCase.payments;
  const customer = payment?.customers;

  const decision = await getAIRecoveryDecision({
    amount: Number(payment.amount),
    failureReason: payment.failure_reason,
    successfulPayments: customer?.total_successful_payments ?? 0,
    failedPayments: customer?.total_failed_payments ?? 0,
    retryCount: recoveryCase.retry_count,
    recoveryScore: recoveryCase.recovery_score,
  });

  if (!decision) {
    // AI call failed or returned invalid data — don't save anything
    return null;
  }

  const { data, error } = await supabase
    .from("recovery_actions")
    .insert({
      recovery_case_id: recoveryCase.id,
      action: decision.action,
      ai_reason: decision.reason,
      confidence: decision.confidence,
      status: "PENDING",
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving AI decision:", error);
    return null;
  }

  return data;
}