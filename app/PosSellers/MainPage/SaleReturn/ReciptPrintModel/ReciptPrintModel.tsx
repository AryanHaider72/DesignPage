"use client";

import { ReturnSale } from "@/api/types/Posintegration/ReturnItem/ReturnItem";
import { Check, Download } from "lucide-react";
import { useEffect, useState } from "react";
import A4PreviewModel from "./A4PreviewModel/A4PreviewModel";
import A5PreviewModel from "./A5PreviewModel/A5PreviewModel";
import ThermalPreviewModel from "./ThermalDesginPreview/ThermalDesginPreview";

interface getExportData {
  getData: ReturnSale[];
}

export default function ReceiptPrintModal({ getData }: getExportData) {
  const [returnType, setReturnType] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    console.log(getData);
  }, [getData]);

  const handleReturnTypeChange = (type: string) => {
    setReturnType(type);
    setShowPreview(true);
  };

  const getPreviewComponent = () => {
    switch (returnType) {
      case "Thermal Print":
        return <ThermalPreviewModel />;
      case "A4 Print":
        return <A4PreviewModel />;
      case "A5 Print":
        return <A5PreviewModel />;
      default:
        return null;
    }
  };

  const getScaleFactor = () => {
    switch (returnType) {
      case "Thermal Print":
        return "transform scale-[1]"; // Thermal is already small
      case "A4 Print":
        return "transform scale-[0.45]"; // Reduced scale to fit better
      case "A5 Print":
        return "transform scale-[0.7]";
      default:
        return "";
    }
  };

  const getBgColor = () => {
    switch (returnType) {
      case "Thermal Print":
        return "bg-yellow-50";
      case "A4 Print":
        return "bg-green-50";
      case "A5 Print":
        return "bg-purple-50";
      default:
        return "bg-gray-50";
    }
  };

  const getThemeColor = () => {
    switch (returnType) {
      case "Thermal Print":
        return "yellow";
      case "A4 Print":
        return "green";
      case "A5 Print":
        return "purple";
      default:
        return "gray";
    }
  };

  return (
    <>
      <div className="mt-2 flex flex-col justify-center items-center w-full">
        {/* Image/Preview Section */}
        <div
          className={`w-full flex justify-center ${getBgColor()} shadow-md rounded-md mx-auto overflow-hidden transition-all duration-300 min-h-[300px]`}
        >
          {showPreview &&
          (returnType === "Thermal Print" ||
            returnType === "A4 Print" ||
            returnType === "A5 Print") ? (
            <div className="w-full overflow-x-auto overflow-y-auto max-h-[500px] p-4 flex justify-center">
              <div className="inline-block">
                <div className={`${getScaleFactor()} origin-top-center`}>
                  {getPreviewComponent()}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-3">
                <span className="text-3xl text-gray-400">🖨️</span>
              </div>
              <p className="text-sm text-gray-500">
                Select print type to preview
              </p>
              <p className="text-xs text-gray-400 mt-1">Thermal • A4 • A5</p>
            </div>
          )}
        </div>

        {/* Print Type Buttons */}
        <div className="flex justify-center gap-2 mt-3">
          {["Thermal Print", "A4 Print", "A5 Print"].map((type) => {
            const isActive = returnType === type;

            return (
              <button
                key={type}
                onClick={() => handleReturnTypeChange(type)}
                className={`px-4 py-2 rounded-md text-xs font-semibold transition-all duration-200
                  ${
                    isActive
                      ? type === "Thermal Print"
                        ? "bg-yellow-500 text-white shadow-md scale-105 ring-2 ring-yellow-300"
                        : type === "A4 Print"
                          ? "bg-green-500 text-white shadow-md scale-105 ring-2 ring-green-300"
                          : "bg-purple-500 text-white shadow-md scale-105 ring-2 ring-purple-300"
                      : type === "Thermal Print"
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300"
                        : type === "A4 Print"
                          ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                          : "bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300"
                  }
                `}
              >
                {type}
                {isActive && <Check size={12} className="inline ml-1" />}
              </button>
            );
          })}
        </div>

        {/* Preview Info Bar */}
        {showPreview && (
          <div
            className={`w-full mt-2 px-3 py-1.5 bg-${getThemeColor()}-50 rounded-md text-[10px] text-${getThemeColor()}-700 flex justify-between items-center border border-${getThemeColor()}-200`}
          >
            <span className="flex items-center gap-1">
              <span>📄</span> {returnType} preview
            </span>
            <span>
              {returnType === "Thermal Print"
                ? "80mm × 297mm (thermal paper)"
                : returnType === "A4 Print"
                  ? "210mm × 297mm (scaled to fit)"
                  : "148mm × 210mm"}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex justify-between items-center mt-3">
          {/* Page Setup Info */}
          {returnType && (
            <div className="text-[10px] text-gray-400">
              {returnType === "Thermal Print" && "📏 Roll paper: 80mm"}
              {returnType === "A4 Print" && "📏 Sheet: A4 (scaled 45%)"}
              {returnType === "A5 Print" && "📏 Sheet: A5 (scaled 70%)"}
            </div>
          )}

          {/* Export Button */}
          <button
            className={`flex justify-center items-center gap-2 px-4 py-2 text-sm rounded-md shadow-md text-white transition-all duration-200 ml-auto
              ${
                returnType === "Thermal Print"
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : returnType === "A4 Print"
                    ? "bg-green-600 hover:bg-green-700"
                    : returnType === "A5 Print"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-gray-400 cursor-not-allowed"
              }`}
            title="Export"
            disabled={!returnType}
          >
            <Download size={15} />
            <span>Export {returnType || "PDF"}</span>
          </button>
        </div>

        {/* Quick Tips */}
        {returnType === "Thermal Print" && (
          <div className="w-full mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-[9px] text-yellow-700">
            💡 Thermal receipt uses 80mm paper roll. Compatible with standard
            POS printers.
          </div>
        )}
        {returnType === "A4 Print" && (
          <div className="w-full mt-2 p-2 bg-green-50 border border-green-200 rounded-md text-[9px] text-green-700">
            💡 A4 preview scaled to 45% for better viewing. Use horizontal
            scroll if needed.
          </div>
        )}
      </div>
    </>
  );
}
