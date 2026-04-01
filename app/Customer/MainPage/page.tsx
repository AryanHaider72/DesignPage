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
  User,
  ShipIcon,
  Building,
  Globe,
  Ship,
  Warehouse,
  Truck,
  Globe2,
  List,
  Weight,
  ShoppingCart,
  ShoppingBag,
  ShoppingBagIcon,
  Shirt,
  BriefcaseIcon,
  Building2,
  Motorbike,
  PlaneIcon,
  BoxIcon,
  Map,
  PackageCheckIcon,
  LogOut,
} from "lucide-react";
import { FaCashRegister, FaMoneyBill } from "react-icons/fa";
import { BsShop } from "react-icons/bs";
import { RiAlignItemTopFill } from "react-icons/ri";
import { GiClothes } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { MiddleWareRequestCheck } from "@/api/lib/OtherController/MiddleWare/MiddleWare";
import { useRouter } from "next/navigation";
import LogoutApi from "@/api/lib/Admin/Authentication/logout/logout";

export default function AppSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>("");

  const [activeMenu2, setActiveMenu2] = useState<string | null>("");
  const [activeMenu4, setActiveMenu4] = useState<string | null>("");

  const [activeMenu3, setActiveMenu3] = useState<string | null>("");

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };
  const toggleMenu2 = (menu: string) => {
    setActiveMenu2(activeMenu2 === menu ? null : menu);
  };
  const toggleMenu3 = (menu: string) => {
    setActiveMenu3(activeMenu3 === menu ? null : menu);
  };
  const toggleMenu4 = (menu: string) => {
    setActiveMenu4(activeMenu4 === menu ? null : menu);
  };

  const requesting = async (currentPath: string) => {
    const repsonse = await MiddleWareRequestCheck("Customer", currentPath);
    if (!repsonse.isValid) {
    } else {
      return;
    }
  };
  const Logout = async () => {
    const token = localStorage.getItem("CustomerToken");
    const repsonse = await LogoutApi(String(token));
    localStorage.removeItem("CustomerToken");
    window.location.href = "/";
  };
  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
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
        className={`
        fixed lg:static top-0 left-0 z-50
        h-screen w-72
        bg-white/80 backdrop-blur-xl
        border-r border-neutral-200 shadow-xl
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
            <Link
              href="/Customer/MainPage/Dashboard"
              onClick={() => requesting("/Customer/MainPage/Dashboard")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl
            text-neutral-700 hover:bg-neutral-100 transition-all"
            >
              <LayoutDashboard size={18} />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <Link
              href="/Customer/MainPage/Orders"
              onClick={() => requesting("/Customer/MainPage/Orders")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl
            text-neutral-700 hover:bg-neutral-100 transition-all"
            >
              <PackageCheckIcon size={18} />
              <span className="text-sm font-medium">Order Management</span>
            </Link>
            {/* <Link
              href="/admin/AdminPortal/MainPage/TillRegister"
              className="flex items-center gap-3 px-4 py-3 rounded-xl
            text-neutral-700 hover:bg-neutral-100 transition-all"
            >
              <FaCashRegister size={18} />
              <span className="text-sm font-medium">Till Creation</span>
            </Link> */}
            {/* <Link
              href="/admin/AdminPortal/MainPage/CreateLogin"
              className="flex items-center gap-3 px-4 py-3 rounded-xl
            text-neutral-700 hover:bg-neutral-100 transition-all"
            >
              <User size={18} />
              <span className="text-sm font-medium">Create Login</span>
            </Link> */}
          </nav>

          {/* Footer */}
          <div
            onClick={() => Logout()}
            className=" p-5 text-black block text-xl hover:bg-red-300    py-2 px-2 transition duration-300 rounded-md"
          >
            <div className="flex items-center gap-3 p-2">
              <LogOut size={18} />
              <span className=" font-medium">Logout</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 ml-0 bg-white h-screen p-6 overflow-y-auto scrollbar-hide ">
        {children}
      </main>
    </div>
  );
}
