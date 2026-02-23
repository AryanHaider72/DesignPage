"use client";
import { usePathname } from "next/navigation";
import OfflineSellerPosSalePoint from "./page";

export default function MainPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Don't show sidebar on login page
  // const isLoginPage = pathname?.includes("/CreateLogin");

  // if (isLoginPage) {
  //   return <>{children}</>;
  // }

  return <OfflineSellerPosSalePoint>{children}</OfflineSellerPosSalePoint>;
}
