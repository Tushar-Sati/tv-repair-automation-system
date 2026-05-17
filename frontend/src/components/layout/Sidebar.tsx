"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Wrench, BarChart3, Users, Settings, LogOut, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Repairs Queue", href: "/dashboard/repairs", icon: Wrench },
  { name: "Revenue Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-background/50 backdrop-blur-xl flex-col"
      >
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <Wrench className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">RepairFlow OS</span>
          </Link>
        </div>

        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-xs font-medium text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20 w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live Google Sheets Sync
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto pt-4 px-3">
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`) && item.href !== "/dashboard";
              if (item.href === "/dashboard" && pathname !== "/dashboard") return (
                 <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 relative overflow-hidden text-zinc-400 hover:text-white hover:bg-white/5"
                >
                  <item.icon className="h-5 w-5 shrink-0 z-10 text-zinc-500 group-hover:text-zinc-300" />
                  <span className="z-10">{item.name}</span>
                </Link>
              );

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 relative overflow-hidden",
                    isActive
                      ? "text-white bg-white/10"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />
                  )}
                  <item.icon className={cn("h-5 w-5 shrink-0 z-10", isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                  <span className="z-10">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 rounded-lg px-3 py-3 bg-white/5 border border-white/5">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0">
              TS
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-bold text-white flex items-center gap-1 truncate">
                Tushar Sati
                <CheckCircle className="h-3 w-3 text-blue-400 shrink-0" />
              </span>
              <span className="text-xs text-zinc-500 truncate">Owner / Admin</span>
            </div>
            <button onClick={handleLogout} className="p-1.5 rounded-md hover:bg-white/10 text-zinc-400 hover:text-red-400 transition-colors shrink-0" title="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-white/10">
        <nav className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(`${item.href}/`) && item.href !== "/dashboard");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 relative px-1",
                  isActive ? "text-blue-400" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-b-full" />
                )}
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                  {item.name === "Revenue Analytics" ? "Analytics" : item.name.split(' ')[0]}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
