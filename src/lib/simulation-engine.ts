import { calculateRecoveryScore } from "@/lib/recovery-engine";

const FAILURE_REASONS = ["INSUFFICIENT_FUNDS", "BANK_DECLINE", "TIMEOUT"];

function randomAmount() {
  return Math.floor(Math.random() * 15000) + 199; // ₹199 - ₹15,199
}

function randomHistory() {
  const successful = Math.floor(Math.random() * 15);
  const failed = Math.floor(Math.random() * 5);
  return { successful, failed };
}

export interface SimulationResult {
  paymentsAnalyzed: number;
  failedPayments: number;
  revenueAtRisk: number;
  recoveryAttempts: number;
  successfulRecoveries: number;
  revenueRecovered: number;
  recoveryRate: number;
  actionBreakdown: Record<string, number>;
}

export function runSimulation(totalPayments: number = 200): SimulationResult {
  let failedPayments = 0;
  let revenueAtRisk = 0;
  let recoveryAttempts = 0;
  let successfulRecoveries = 0;
  let revenueRecovered = 0;
  const actionBreakdown: Record<string, number> = {
    RETRY: 0,
    REMIND: 0,
    ESCALATE: 0,
    STOP: 0,
  };

  for (let i = 0; i < totalPayments; i++) {
    const isFailed = Math.random() < 0.25; // ~25% of payments fail
    if (!isFailed) continue;

    failedPayments++;
    const amount = randomAmount();
    revenueAtRisk += amount;

    const failureReason =
      FAILURE_REASONS[Math.floor(Math.random() * FAILURE_REASONS.length)];
    const { successful, failed } = randomHistory();

    const { score } = calculateRecoveryScore({
      amount,
      failureReason,
      successfulPayments: successful,
      failedPayments: failed,
      retryCount: 0,
    });

    // Determine simulated action based on score (mirrors typical AI behavior)
    let action: string;
    if (score >= 70) action = "RETRY";
    else if (score >= 45) action = "REMIND";
    else if (score >= 20) action = "ESCALATE";
    else action = "STOP";

    actionBreakdown[action]++;

    if (action === "RETRY" || action === "REMIND") {
      recoveryAttempts++;
      // Higher score = higher chance of simulated recovery success
      const recoveryChance = score / 100;
      if (Math.random() < recoveryChance) {
        successfulRecoveries++;
        revenueRecovered += amount;
      }
    }
  }

  const recoveryRate =
    failedPayments > 0
      ? Math.round((successfulRecoveries / failedPayments) * 100)
      : 0;

  return {
    paymentsAnalyzed: totalPayments,
    failedPayments,
    revenueAtRisk,
    recoveryAttempts,
    successfulRecoveries,
    revenueRecovered,
    recoveryRate,
    actionBreakdown,
  };
}