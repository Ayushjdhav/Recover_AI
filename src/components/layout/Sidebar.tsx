"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  ShieldCheck,
  ScrollText,
  PlayCircle,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Recovery Center", href: "/recovery", icon: ShieldCheck },
  { name: "Audit Logs", href: "/audit", icon: ScrollText },
  { name: "Simulation", href: "/simulation", icon: PlayCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0">
      <div className="px-6 py-5 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">RecoverAI</h1>
        <p className="text-xs text-slate-500 mt-1">Revenue Recovery Engine</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}