import { supabase } from "@/lib/supabase";
import { calculateRecoveryScore } from "@/lib/recovery-engine";

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