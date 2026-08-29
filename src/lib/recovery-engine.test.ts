import { describe, it, expect } from "vitest";
import { calculateRecoveryScore } from "./recovery-engine";

describe("calculateRecoveryScore", () => {
  it("gives a high score to a reliable customer with a temporary failure", () => {
    const result = calculateRecoveryScore({
      amount: 2999,
      failureReason: "TIMEOUT",
      successfulPayments: 12,
      failedPayments: 0,
      retryCount: 0,
    });
    expect(result.score).toBeGreaterThanOrEqual(80);
  });

  it("gives a low score to an unreliable customer with a bank decline", () => {
    const result = calculateRecoveryScore({
      amount: 899,
      failureReason: "BANK_DECLINE",
      successfulPayments: 0,
      failedPayments: 4,
      retryCount: 0,
    });
    expect(result.score).toBeLessThan(40);
  });

  it("never returns a score below 0", () => {
    const result = calculateRecoveryScore({
      amount: 50000,
      failureReason: "BANK_DECLINE",
      successfulPayments: 0,
      failedPayments: 20,
      retryCount: 5,
    });
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it("never returns a score above 100", () => {
    const result = calculateRecoveryScore({
      amount: 100,
      failureReason: "TIMEOUT",
      successfulPayments: 100,
      failedPayments: 0,
      retryCount: 0,
    });
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("always returns a breakdown explaining the score", () => {
    const result = calculateRecoveryScore({
      amount: 4999,
      failureReason: "INSUFFICIENT_FUNDS",
      successfulPayments: 8,
      failedPayments: 1,
      retryCount: 0,
    });
    expect(result.breakdown.length).toBeGreaterThan(0);
  });
});