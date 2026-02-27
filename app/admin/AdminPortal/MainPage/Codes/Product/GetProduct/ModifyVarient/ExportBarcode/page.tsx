// app/UsefullComponent/BarcodeExport/BarcodeExport.tsx
"use client";
import { useRef, useEffect, useState } from "react";
import jsPDF from "jspdf";
import { Download, X } from "lucide-react";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(true);

  // Format price
  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString()}`;
  };

  // Draw barcode label directly on canvas
  const drawBarcodeLabel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);

    // Set canvas dimensions for 2" x 1" at 300 DPI for high quality
    canvas.width = 600; // 2 inches * 300 DPI
    canvas.height = 300; // 1 inch * 300 DPI

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw a light gray border
    ctx.strokeStyle = "#CCCCCC";
    ctx.lineWidth = 1;
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

    // ========== PRODUCT NAME (Top Center) ==========
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";
    ctx.font = "bold 16px Arial, Helvetica, sans-serif";

    // Create full product text
    let productText = data.productName;
    if (data.variantName && data.varientValue) {
      productText = `${data.productName} - ${data.variantName}: ${data.varientValue}`;
    }

    // If text is too long, truncate with ellipsis
    const maxWidth = 500;
    if (ctx.measureText(productText).width > maxWidth) {
      while (
        ctx.measureText(productText + "...").width > maxWidth &&
        productText.length > 0
      ) {
        productText = productText.slice(0, -1);
      }
      productText += "...";
    }

    // Draw product name at top center
    ctx.fillStyle = "#000000";
    ctx.font = "bold 16px Arial, Helvetica, sans-serif";
    ctx.fillText(productText, canvas.width / 2, 35);
    console.log("Drawing product name:", productText); // Debug log

    // ========== BARCODE (Middle) ==========
    const digits = data.barcode.replace(/\D/g, "").split("");

    // Only draw barcode if we have digits
    if (digits.length > 0) {
      const startX = 100;
      const endX = canvas.width - 100;
      const availableWidth = endX - startX;

      // Calculate total width needed
      let totalWidth = 0;
      const widths = digits.map((digit) => 3 + (parseInt(digit) % 4));
      totalWidth = widths.reduce((acc, w) => acc + w + 1, 0);

      // Scale to fit in available space
      const scale = availableWidth / totalWidth;
      let x = startX;

      ctx.fillStyle = "#000000";
      digits.forEach((digit, i) => {
        const width = Math.max(2, widths[i] * scale);
        const height = 130;

        ctx.fillRect(x, 85, width, height);
        x += width + 2 * scale;
      });
    }

    // ========== BARCODE NUMBER (Below barcode) ==========
    ctx.fillStyle = "#333333";
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.fillText(data.barcode, canvas.width / 2, 225);

    // ========== PRICE (Bottom) ==========
    ctx.fillStyle = "#000000";
    ctx.font = "bold 20px Arial, Helvetica, sans-serif";
    ctx.fillText(formatPrice(data.salePrice), canvas.width / 2, 275);

    // Draw a small separator line above price
    ctx.strokeStyle = "#999999";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(200, 250);
    ctx.lineTo(400, 250);
    ctx.stroke();

    setIsDrawing(false);
  };

  // Redraw when data changes
  useEffect(() => {
    drawBarcodeLabel();
  }, [data]);

  const handleExportPDF = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Make sure canvas is fully drawn
      if (isDrawing) {
        setTimeout(handleExportPDF, 100);
        return;
      }

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

      // Save PDF
      pdf.save(`${data.productName}-barcode-${data.barcode}.pdf`);

      console.log("PDF exported with product name:", data.productName); // Debug log
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Product Barcode
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Preview */}
        <div className="p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow-inner p-4">
            {/* Product Info Preview - Text version for verification */}
            <div className="mb-4 text-sm text-center border-b border-gray-200 pb-3">
              <div className="font-bold text-gray-900 text-base">
                {data.productName}
              </div>
              {data.variantName && (
                <div className="text-gray-600 mt-1">
                  {data.variantName}: {data.varientValue}
                </div>
              )}
            </div>

            {/* Canvas Barcode - Exactly 2in x 1in */}
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                style={{
                  width: "192px", // 2in at 96dpi display
                  height: "96px", // 1in at 96dpi display
                  border: "1px solid #CCCCCC",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
            </div>

            {/* Info */}
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                Actual size: 2" (width) x 1" (height)
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={handleExportPDF}
            disabled={isDrawing}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition font-medium ${
              isDrawing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isDrawing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export Barcode PDF
              </>
            )}
          </button>
        </div>

        {/* Barcode Details */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Product:</span>
              <span className="ml-2 font-medium text-gray-900 truncate block">
                {data.productName}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Barcode:</span>
              <span className="ml-2 font-mono text-gray-900">
                {data.barcode}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Price:</span>
              <span className="ml-2 font-medium text-gray-900">
                Rs. {data.salePrice}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
