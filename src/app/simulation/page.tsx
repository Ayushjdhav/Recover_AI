"use client";

import { useState } from "react";
import { PlayCircle, TrendingUp, TrendingDown, Percent } from "lucide-react";
import { runSimulation, SimulationResult } from "@/lib/simulation-engine";

export default function SimulationPage() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunSimulation = () => {
    setIsRunning(true);
    // Small artificial delay so the loading state is visible — this is a UX choice,
    // the computation itself is actually near-instant
    setTimeout(() => {
      const simResult = runSimulation(1000);
      setResult(simResult);
      setIsRunning(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Simulation Mode</h2>
        <p className="text-sm text-slate-500 mt-1">
          Generate synthetic payment data and measure recovery performance at scale
        </p>
      </div>

      <button
        onClick={handleRunSimulation}
        disabled={isRunning}
        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        <PlayCircle size={20} />
        {isRunning ? "Running Simulation..." : "Run Recovery Simulation"}
      </button>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-sm text-slate-500">Payments Analyzed</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {result.paymentsAnalyzed.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-sm text-slate-500">Failed Payments</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {result.failedPayments.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-sm text-slate-500">Revenue At Risk</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                ₹{result.revenueAtRisk.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-sm text-slate-500">Revenue Recovered</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                ₹{result.revenueRecovered.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Recovery Rate</h3>
              <span className="text-2xl font-bold text-indigo-600">
                {result.recoveryRate}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 mt-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all"
                style={{ width: `${result.recoveryRate}%` }}
              />
            </div>
            <p className="text-sm text-slate-500 mt-3">
              {result.successfulRecoveries} of {result.recoveryAttempts} recovery
              attempts succeeded ({result.failedPayments} total failed payments)
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="font-semibold text-slate-900 mb-4">
              AI Action Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(result.actionBreakdown).map(([action, count]) => (
                <div key={action} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-600 w-20">
                    {action}
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{
                        width: `${
                          result.failedPayments > 0
                            ? (count / result.failedPayments) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-slate-500 w-8 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}