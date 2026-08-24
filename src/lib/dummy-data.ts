export const dashboardStats = {
  revenueAtRisk: 284500,
  revenueRecovered: 156200,
  recoveryRate: 68,
  failedPayments: 47,
};

export const recentActivity = [
  {
    id: "1",
    customer: "Priya Sharma",
    amount: 500000,
    failureReason: "INSUFFICIENT_FUNDS",
    recoveryScore: 82,
    aiRecommendation: "RETRY",
    status: "Recovered",
  },
  {
    id: "2",
    customer: "Arjun Mehta",
    amount: 12500,
    failureReason: "BANK_DECLINE",
    recoveryScore: 45,
    aiRecommendation: "ESCALATE",
    status: "Pending Approval",
  },
  {
    id: "3",
    customer: "Sneha Iyer",
    amount: 2999,
    failureReason: "TIMEOUT",
    recoveryScore: 91,
    aiRecommendation: "RETRY",
    status: "Recovered",
  },
  {
    id: "4",
    customer: "Rohan Kapoor",
    amount: 899,
    failureReason: "INSUFFICIENT_FUNDS",
    recoveryScore: 28,
    aiRecommendation: "STOP",
    status: "Closed",
  },
  {
    id: "5",
    customer: "Ananya Das",
    amount: 7499,
    failureReason: "BANK_DECLINE",
    recoveryScore: 63,
    aiRecommendation: "REMIND",
    status: "In Progress",
  },
];