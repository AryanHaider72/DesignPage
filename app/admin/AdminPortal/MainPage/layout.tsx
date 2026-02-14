// app/admin/AdminPortal/MainPage/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import AppSidebar from "./page"; // your sidebar component

export default function MainPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Don't show sidebar on login page
  const isLoginPage = pathname?.includes("/CreateLogin");

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <AppSidebar>{children}</AppSidebar>;
}
