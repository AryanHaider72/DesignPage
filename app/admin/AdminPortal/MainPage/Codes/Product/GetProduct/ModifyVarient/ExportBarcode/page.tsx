import { Suspense } from "react";
import BarcodeExport from "./index";

interface PageProps {
  searchParams: {
    data?: string;
  };
}

export default function Page({ searchParams }: PageProps) {
  const data = searchParams.data
    ? JSON.parse(decodeURIComponent(searchParams.data))
    : null;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No barcode data provided</p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" />
        </div>
      }
    >
      <BarcodeExport data={data} onClose={() => window.history.back()} />
    </Suspense>
  );
}
