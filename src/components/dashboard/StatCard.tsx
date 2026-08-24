import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  iconColor: string;
  iconBg: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp,
  iconColor,
  iconBg,
}: StatCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      {trend && (
        <p className={`text-xs mt-3 ${trendUp ? "text-emerald-600" : "text-red-600"}`}>
          {trend}
        </p>
      )}
    </div>
  );
}