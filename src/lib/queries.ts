import { supabase } from "@/lib/supabase";

export async function getFailedPaymentsWithCustomers() {
  const { data, error } = await supabase
    .from("payments")
    .select(
      `
      id,
      amount,
      failure_reason,
      status,
      created_at,
      customers (
        name,
        email,
        total_successful_payments,
        total_failed_payments
      )
    `
    )
    .eq("status", "failed")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching failed payments:", error);
    return [];
  }

  return data;
}

export async function getRecoveryCasesWithDetails() {
  const { data, error } = await supabase
    .from("recovery_cases")
    .select(
      `
      id,
      recovery_score,
      status,
      retry_count,
      created_at,
      payments (
        id,
        amount,
        failure_reason,
        customers (
          name,
          email,
          total_successful_payments,
          total_failed_payments
        )
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching recovery cases:", error);
    return [];
  }

  return data;
}export async function getAuditTrail() {
  const { data, error } = await supabase
    .from("recovery_actions")
    .select(
      `
      id,
      action,
      ai_reason,
      confidence,
      status,
      executed_at,
      recovery_cases (
        id,
        recovery_score,
        status,
        created_at,
        payments (
          amount,
          failure_reason,
          customers (
            name
          )
        )
      )
    `
    )
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching audit trail:", error);
    return [];
  }

  return data;
}