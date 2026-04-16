"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/counseling", label: "상담 작성" },
  { href: "/counseling/manage", label: "상담 관리" },
  { href: "/reflection", label: "성찰문 등록" },
  { href: "/reflection/view", label: "조회 및 지도" },
  { href: "/reflection/stats", label: "통계 현황" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface-card border-b border-border sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center h-[52px] gap-1 overflow-x-auto">
          <Link
            href="/"
            className="text-[18px] font-bold text-brand mr-6 shrink-0 hover:opacity-80 transition-opacity"
          >
            마주봄
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-md text-[13px] font-medium shrink-0 transition-colors min-h-[44px] flex items-center ${
                pathname === item.href
                  ? "bg-brand-tint text-brand"
                  : "text-text-tertiary hover:bg-surface-subtle hover:text-text-secondary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
