import StorePortal from "./page";

export default function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeID: string };
}) {
  return <StorePortal storeID={params.storeID}>{children}</StorePortal>;
}
