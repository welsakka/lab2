"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  Target,
  Calculator,
  Home,
  BookOpen,
  Bot,
  Settings,
  LogOut,
} from "lucide-react";
import { logout } from "@/lib/api";
import { useUserStore } from "@/lib/user-store";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Investments", href: "/investments", icon: TrendingUp },
  { label: "Credit Optimizer", href: "/banking", icon: CreditCard },
  { label: "Planning", href: "/planning", icon: Target },
  { label: "Zakat", href: "/zakat", icon: Calculator },
  { label: "Real Estate", href: "/real-estate", icon: Home },
  { label: "Education", href: "/education", icon: BookOpen },
  { label: "AI Coach", href: "/ai-coach", icon: Bot },
];

const planBadge: Record<string, { label: string; color: string }> = {
  free: { label: "Free", color: "bg-gray-100 text-gray-500" },
  essential: { label: "Essential", color: "bg-blue-100 text-blue-700" },
  premium: { label: "Premium", color: "bg-brand-100 text-brand-700" },
  family: { label: "Family", color: "bg-purple-100 text-purple-700" },
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clear } = useUserStore();

  const handleLogout = async () => {
    await logout().catch(() => {});
    clear();
    router.push("/login");
  };

  const badge = planBadge[user?.plan ?? "free"];

  return (
    <aside className="hidden md:flex w-56 flex-col bg-white border-r border-gray-100">
      {/* Logo + plan badge */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href="/dashboard" className="text-base font-bold text-brand-700 leading-tight">
          Halal Finance OS
        </Link>
        {badge && (
          <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${badge.color}`}>
            {badge.label}
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon
                className={`h-4 w-4 flex-shrink-0 ${active ? "text-brand-600" : "text-gray-400"}`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-0.5">
        {user && (
          <div className="px-3 py-2 mb-1">
            <p className="text-xs font-medium text-gray-700 truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        )}
        <Link
          href="/settings"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Settings className="h-4 w-4 text-gray-400" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="h-4 w-4 text-gray-400" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
