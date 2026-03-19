"use client";

import dynamic from "next/dynamic";
// Dynamically import the barcode client with SSR disabled
const BarcodeExportClient = dynamic(() => import("./ExportBarcodeClinet"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-2xl">
        <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-gray-600">Loading barcode generator...</p>
      </div>
    </div>
  ),
});

interface BarcodeData {
  attributeID: string;
  productName: string;
  variantName: string;
  varientValue: string;
  barcode: string;
  salePrice: number;
}

interface BarcodeExportProps {
  data: BarcodeData;
  onClose: () => void;
}

export default function BarcodeExport({ data, onClose }: BarcodeExportProps) {
  return <BarcodeExportClient data={data} onClose={onClose} />;
}
