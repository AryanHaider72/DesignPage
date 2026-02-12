"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

export default function AppSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>("users");

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden p-4">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg bg-neutral-900 text-white"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-72
        bg-white/80 backdrop-blur-xl
        border-r border-neutral-200
        shadow-xl
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
            <h1 className="text-xl font-semibold tracking-tight">YourBrand</h1>

            <button
              onClick={() => setOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-neutral-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {/* Dashboard */}
            <Link
              href="/admin/AdminPortal/MainPage/Dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl
              text-neutral-700 hover:bg-neutral-100
              transition-all"
            >
              <LayoutDashboard size={18} />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>

            {/* Users Dropdown */}
            <div>
              <button
                onClick={() => toggleMenu("users")}
                className="w-full flex items-center justify-between
                px-4 py-3 rounded-xl
                text-neutral-700 hover:bg-neutral-100
                transition-all"
              >
                <div className="flex items-center gap-3">
                  <Users size={18} />
                  <span className="text-sm font-medium">Users</span>
                </div>

                {activeMenu === "users" ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>

              {/* Submenu */}
              <div
                className={`overflow-hidden transition-all duration-300
                ${activeMenu === "users" ? "max-h-40 mt-2" : "max-h-0"}`}
              >
                <div className="ml-9 space-y-1">
                  <Link
                    href="#"
                    className="block text-sm text-neutral-600 hover:text-black py-2"
                  >
                    All Users
                  </Link>
                  <Link
                    href="#"
                    className="block text-sm text-neutral-600 hover:text-black py-2"
                  >
                    Add User
                  </Link>
                </div>
              </div>
            </div>

            {/* Projects */}
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-xl
              text-neutral-700 hover:bg-neutral-100 transition-all"
            >
              <FolderKanban size={18} />
              <span className="text-sm font-medium">Projects</span>
            </Link>

            {/* Settings */}
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-xl
              text-neutral-700 hover:bg-neutral-100 transition-all"
            >
              <Settings size={18} />
              <span className="text-sm font-medium">Settings</span>
            </Link>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-semibold">
                U
              </div>
              <div>
                <p className="text-sm font-medium">Username</p>
                <p className="text-xs text-neutral-500">user@email.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 bg-white shadow-inner relative overflow-hidden w-full min-h-screen">
        {children}
      </main>
    </>
  );
}
