"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { updateActionStatus } from "@/lib/actions";

interface ApprovalButtonsProps {
  actionId: string;
  caseId: string;
}

export default function ApprovalButtons({ actionId, caseId }: ApprovalButtonsProps) {
  const [isPending, setIsPending] = useState(false);
  const [resolved, setResolved] = useState<"APPROVED" | "REJECTED" | null>(null);

  const handleDecision = async (decision: "APPROVED" | "REJECTED") => {
    setIsPending(true);
    const result = await updateActionStatus(actionId, caseId, decision);
    setIsPending(false);
    if (result.success) {
      setResolved(decision);
    }
  };

  if (resolved) {
    return (
      <span
        className={`text-xs font-semibold px-3 py-1.5 rounded-md ${
          resolved === "APPROVED"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-red-50 text-red-700"
        }`}
      >
        {resolved === "APPROVED" ? "Approved" : "Rejected"}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleDecision("APPROVED")}
        disabled={isPending}
        className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
      >
        <Check size={14} />
        Approve
      </button>
      <button
        onClick={() => handleDecision("REJECTED")}
        disabled={isPending}
        className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
      >
        <X size={14} />
        Reject
      </button>
    </div>
  );
}