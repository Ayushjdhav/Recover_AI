export interface RecoveryInput {
  amount: number;
  failureReason: string;
  successfulPayments: number;
  failedPayments: number;
  retryCount: number;
}

export interface RecoveryResult {
  score: number;
  breakdown: string[];
}

export function calculateRecoveryScore(input: RecoveryInput): RecoveryResult {
  const { amount, failureReason, successfulPayments, failedPayments, retryCount } = input;

  let score = 50;
  const breakdown: string[] = ["Base score: 50"];

  // Customer history
  if (successfulPayments >= failedPayments * 3 && successfulPayments > 0) {
    score += 25;
    breakdown.push("Strong payment history: +25");
  } else if (successfulPayments > failedPayments) {
    score += 10;
    breakdown.push("Decent payment history: +10");
  } else if (failedPayments >= successfulPayments) {
    score -= 20;
    breakdown.push("Poor payment history: -20");
  }

  // Failure reason
  if (failureReason === "TIMEOUT") {
    score += 15;
    breakdown.push("Temporary failure (timeout): +15");
  } else if (failureReason === "INSUFFICIENT_FUNDS") {
    score += 5;
    breakdown.push("Insufficient funds (often recoverable): +5");
  } else if (failureReason === "BANK_DECLINE") {
    score -= 10;
    breakdown.push("Bank decline (harder to recover): -10");
  }

  // Retry count
  if (retryCount === 0) {
    score += 10;
    breakdown.push("No retries attempted yet: +10");
  } else if (retryCount >= 3) {
    score -= 30;
    breakdown.push("Retry limit nearly exhausted: -30");
  }

  // Amount risk
  if (amount > 10000) {
    score -= 5;
    breakdown.push("High-value payment (extra caution): -5");
  }

  // Clamp between 0-100
  score = Math.max(0, Math.min(100, score));

  return { score, breakdown };
}