export type PolicyOutcome = "ALLOWED" | "REQUIRES_APPROVAL" | "BLOCKED";

export interface PolicyInput {
  action: string;
  amount: number;
  retryCount: number;
  caseStatus: string;
}

export interface PolicyResult {
  outcome: PolicyOutcome;
  reason: string;
  finalAction: string;
}

const VALID_ACTIONS = ["RETRY", "REMIND", "ESCALATE", "STOP"];
const HIGH_VALUE_THRESHOLD = 10000;
const MAX_RETRIES = 3;

export function evaluatePolicy(input: PolicyInput): PolicyResult {
  const { action, amount, retryCount, caseStatus } = input;

  // Safety net: re-check action validity even though AI layer already validated
  if (!VALID_ACTIONS.includes(action)) {
    return {
      outcome: "BLOCKED",
      reason: `Invalid action "${action}" is not permitted`,
      finalAction: "STOP",
    };
  }

  // Case already closed — no further action allowed
  if (caseStatus === "RESOLVED" || caseStatus === "CLOSED") {
    return {
      outcome: "BLOCKED",
      reason: `Case is already ${caseStatus.toLowerCase()}, no further action needed`,
      finalAction: "STOP",
    };
  }

  // Retry limit exceeded — force STOP regardless of what AI recommended
  if (action === "RETRY" && retryCount >= MAX_RETRIES) {
    return {
      outcome: "BLOCKED",
      reason: `Retry limit (${MAX_RETRIES}) already reached, forcing stop`,
      finalAction: "STOP",
    };
  }

  // High-value payment — require human approval regardless of action
  if (amount > HIGH_VALUE_THRESHOLD) {
    return {
      outcome: "REQUIRES_APPROVAL",
      reason: `Amount ₹${amount} exceeds ₹${HIGH_VALUE_THRESHOLD} threshold, merchant approval required`,
      finalAction: action,
    };
  }

  // Passed all checks
  return {
    outcome: "ALLOWED",
    reason: "Action passed all policy checks",
    finalAction: action,
  };
}