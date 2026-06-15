"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wind } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Overview" },
    { href: "/model/hbstm", label: "HBSTM" },
    { href: "/model/lstm", label: "LSTM" },
    { href: "/model/xgboost", label: "XGBoost" },
    { href: "/comparison", label: "Comparison" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Logo and Title */}
        <Link href="/" className="flex items-center space-x-3 shrink-0">
          <div className="bg-slate-900 text-white p-2 rounded-xl shadow-sm">
            <Wind className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-slate-900">PODAJA</span>
            <span className="text-[10px] text-slate-500 font-medium leading-tight">
              Prediksi dan Observasi Polusi Udara Jakarta
            </span>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-1">
          {navLinks.map((link) => {
            const isActive = link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "bg-slate-100 text-slate-900 shadow-sm border border-slate-200/50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Academic Label */}
        <div className="hidden md:flex shrink-0">
          <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-3 py-1.5 rounded-xl border border-slate-200">
            Thesis Visualization
          </span>
        </div>
      </div>
    </header>
  );
}
