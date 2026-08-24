import { recentActivity } from "@/lib/dummy-data";

const statusStyles: Record<string, string> = {
  Recovered: "bg-emerald-50 text-emerald-700",
  "Pending Approval": "bg-amber-50 text-amber-700",
  Closed: "bg-slate-100 text-slate-600",
  "In Progress": "bg-blue-50 text-blue-700",
};

const actionStyles: Record<string, string> = {
  RETRY: "bg-indigo-50 text-indigo-700",
  REMIND: "bg-blue-50 text-blue-700",
  ESCALATE: "bg-amber-50 text-amber-700",
  STOP: "bg-red-50 text-red-700",
};

export default function RecentActivity() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900">Recent Recovery Activity</h3>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b border-slate-200">
            <th className="px-5 py-3 font-medium">Customer</th>
            <th className="px-5 py-3 font-medium">Amount</th>
            <th className="px-5 py-3 font-medium">Failure Reason</th>
            <th className="px-5 py-3 font-medium">Score</th>
            <th className="px-5 py-3 font-medium">AI Action</th>
            <th className="px-5 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {recentActivity.map((row) => (
            <tr key={row.id} className="border-b border-slate-100 last:border-0">
              <td className="px-5 py-3 text-slate-900 font-medium">{row.customer}</td>
              <td className="px-5 py-3 text-slate-700">
                ₹{row.amount.toLocaleString("en-IN")}
              </td>
              <td className="px-5 py-3 text-slate-500">{row.failureReason}</td>
              <td className="px-5 py-3 text-slate-700">{row.recoveryScore}/100</td>
              <td className="px-5 py-3">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${actionStyles[row.aiRecommendation]}`}
                >
                  {row.aiRecommendation}
                </span>
              </td>
              <td className="px-5 py-3">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${statusStyles[row.status]}`}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}