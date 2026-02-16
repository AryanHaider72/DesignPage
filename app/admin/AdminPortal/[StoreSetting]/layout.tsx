// app/admin/AdminPortal/[storeID]/layout.tsx
"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Building2, LayoutDashboard, Menu, Settings, X } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function StoreLayout({ children }: LayoutProps) {
  const params = useParams();
  const storeID = params?.StoreSetting;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-neutral-200 transition-all duration-300 ${
          isSidebarOpen ? "w-72" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
          <Link
            href={`/admin/AdminPortal/${storeID}/Dashboard`}
            className={`text-xl font-semibold tracking-tight transition-all duration-300 ${
              isSidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            YourBrand
          </Link>
          <button
            className="md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href={`/admin/AdminPortal/${storeID}/Dashboard`}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-100"
          >
            <Building2 size={18} />
            {isSidebarOpen && "Code"}
          </Link>
          {/* Add more sidebar links here */}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
