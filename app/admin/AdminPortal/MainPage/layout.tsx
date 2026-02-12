"use client";
import AppSidebar from "./page";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppSidebar>{children}</AppSidebar>; // Sidebar wraps content
}
