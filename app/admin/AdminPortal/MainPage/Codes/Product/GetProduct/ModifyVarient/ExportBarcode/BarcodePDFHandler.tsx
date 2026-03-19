"use client";

import { useEffect, useRef } from "react";
import jsPDF from "jspdf";

interface BarcodePDFHandlerProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  data: {
    productName: string;
    barcode: string;
    variantName?: string;
    varientValue?: string;
    salePrice: number;
  };
  onExportComplete?: () => void;
}

export default function BarcodePDFHandler({
  canvasRef,
  data,
  onExportComplete,
}: BarcodePDFHandlerProps) {
  const hasExported = useRef(false);

  useEffect(() => {
    if (hasExported.current) return;
    hasExported.current = true;

    const exportPDF = async () => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Create PDF with exact dimensions (2in x 1in)
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "in",
          format: [2, 1],
        });

        // Get canvas image data
        const imgData = canvas.toDataURL("image/png", 1.0);

        // Add image to PDF at exact dimensions
        pdf.addImage(imgData, "PNG", 0, 0, 2, 1, undefined, "FAST");

        // Create filename
        let filename = `${data?.productName || "product"}`;
        if (data?.variantName && data?.varientValue) {
          filename += `-${data.variantName}-${data.varientValue}`;
        }
        filename += `-${data?.barcode || "barcode"}.pdf`;

        // Save PDF
        pdf.save(filename);

        console.log("PDF exported successfully");
      } catch (error) {
        console.error("Error exporting PDF:", error);
      } finally {
        onExportComplete?.();
      }
    };

    exportPDF();
  }, []);

  return null;
}
