"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Menu, X } from "lucide-react";

export default function StorePortal({
  storeID,
  children,
}: {
  children: React.ReactNode;
  storeID: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-neutral-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
          <h1 className="text-xl font-semibold tracking-tight">YourBrand</h1>
        </div>
        <nav className="p-4 space-y-2">
          <Link
            href={`/admin/AdminPortal/${storeID}/Dashboard`}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-100"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white">{children}</main>
    </div>
  );
}
