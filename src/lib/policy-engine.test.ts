import { describe, it, expect } from "vitest";
import { evaluatePolicy } from "./policy-engine";

describe("evaluatePolicy", () => {
  it("allows a normal low-value retry with no prior attempts", () => {
    const result = evaluatePolicy({
      action: "RETRY",
      amount: 4999,
      retryCount: 0,
      caseStatus: "OPEN",
    });
    expect(result.outcome).toBe("ALLOWED");
    expect(result.finalAction).toBe("RETRY");
  });

  it("blocks a retry once the retry limit is reached", () => {
    const result = evaluatePolicy({
      action: "RETRY",
      amount: 4999,
      retryCount: 3,
      caseStatus: "OPEN",
    });
    expect(result.outcome).toBe("BLOCKED");
    expect(result.finalAction).toBe("STOP");
  });

  it("requires approval for high-value payments regardless of action", () => {
    const result = evaluatePolicy({
      action: "RETRY",
      amount: 15000,
      retryCount: 0,
      caseStatus: "OPEN",
    });
    expect(result.outcome).toBe("REQUIRES_APPROVAL");
  });

  it("blocks any action on an already closed case", () => {
    const result = evaluatePolicy({
      action: "ESCALATE",
      amount: 2999,
      retryCount: 0,
      caseStatus: "CLOSED",
    });
    expect(result.outcome).toBe("BLOCKED");
    expect(result.finalAction).toBe("STOP");
  });

  it("blocks an invalid action even if it somehow reaches the policy engine", () => {
    const result = evaluatePolicy({
      action: "DELETE_CUSTOMER",
      amount: 100,
      retryCount: 0,
      caseStatus: "OPEN",
    });
    expect(result.outcome).toBe("BLOCKED");
  });

  it("prioritizes closed-case check over high-value approval", () => {
    // A high-value payment on an already-closed case should BLOCK, not REQUIRE_APPROVAL
    const result = evaluatePolicy({
      action: "RETRY",
      amount: 20000,
      retryCount: 0,
      caseStatus: "RESOLVED",
    });
    expect(result.outcome).toBe("BLOCKED");
  });
});