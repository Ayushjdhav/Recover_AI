import { IndianRupee, TrendingUp, Percent, AlertCircle } from "lucide-react";
import { dashboardStats } from "@/lib/dummy-data";
import StatCard from "@/components/dashboard/StatCard";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">
          Overview of revenue recovery performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Revenue At Risk"
          value={`₹${dashboardStats.revenueAtRisk.toLocaleString("en-IN")}`}
          icon={AlertCircle}
          iconColor="text-red-600"
          iconBg="bg-red-50"
          trend="From failed payments"
        />
        <StatCard
          label="Revenue Recovered"
          value={`₹${dashboardStats.revenueRecovered.toLocaleString("en-IN")}`}
          icon={IndianRupee}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          trend="↑ Recovered this month"
          trendUp
        />
        <StatCard
          label="Recovery Rate"
          value={`${dashboardStats.recoveryRate}%`}
          icon={Percent}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
          trend="Of failed payments recovered"
          trendUp
        />
        <StatCard
          label="Failed Payments"
          value={dashboardStats.failedPayments.toString()}
          icon={TrendingUp}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          trend="This month"
        />
      </div>

      <RecentActivity />
    </div>
  );
}