"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateActionStatus(
  actionId: string,
  caseId: string,
  decision: "APPROVED" | "REJECTED"
) {
  const { error: actionError } = await supabase
    .from("recovery_actions")
    .update({ status: decision, executed_at: new Date().toISOString() })
    .eq("id", actionId);

  if (actionError) {
    console.error("Error updating action status:", actionError);
    return { success: false };
  }

  const newCaseStatus = decision === "APPROVED" ? "OPEN" : "CLOSED";

  const { error: caseError } = await supabase
    .from("recovery_cases")
    .update({ status: newCaseStatus })
    .eq("id", caseId);

  if (caseError) {
    console.error("Error updating case status:", caseError);
    return { success: false };
  }

  revalidatePath("/recovery");

  return { success: true };
}