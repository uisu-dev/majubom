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
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center h-14 gap-1 overflow-x-auto">
          <Link
            href="/"
            className="font-bold text-lg mr-4 shrink-0 hover:opacity-90"
          >
            마주봄
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-md text-sm font-medium shrink-0 transition-colors ${
                pathname === item.href
                  ? "bg-blue-700 text-white"
                  : "text-blue-100 hover:bg-blue-500"
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
