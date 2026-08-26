import { IndianRupee, TrendingUp, Percent, AlertCircle } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { runSimulation } from "@/lib/simulation-engine";

export default function DashboardPage() {
  const stats = runSimulation(1000);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">
          Overview of revenue recovery performance
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Based on a live simulation of 1,000 payments using the recovery scoring engine
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Revenue At Risk"
          value={`₹${stats.revenueAtRisk.toLocaleString("en-IN")}`}
          icon={AlertCircle}
          iconColor="text-red-600"
          iconBg="bg-red-50"
          trend="From simulated failed payments"
        />
        <StatCard
          label="Revenue Recovered"
          value={`₹${stats.revenueRecovered.toLocaleString("en-IN")}`}
          icon={IndianRupee}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          trend="Via RETRY/REMIND recovery"
          trendUp
        />
        <StatCard
          label="Recovery Rate"
          value={`${stats.recoveryRate}%`}
          icon={Percent}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
          trend="Of failed payments recovered"
          trendUp
        />
        <StatCard
          label="Failed Payments"
          value={stats.failedPayments.toString()}
          icon={TrendingUp}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          trend="Out of 1,000 analyzed"
        />
      </div>
    </div>
  );
}