"use client";
import ModifyProductVarinetAttribute from "@/api/lib/Admin/Codes/Product/ModifyProduct/ModifyVarient/ModifyVarient";
import Spinner from "@/app/UsefullComponent/Spinner/page";

import { Download, Pencil, X, Save } from "lucide-react";
import { useState } from "react";
import BarcodeExport from "./ExportBarcode/page";

interface PassModifyBasicInfo {
  isOpen: (isOpen: string) => void;
  values: Variant[];
  onShowMessage: (message: any, type: "success" | "error") => void;
  productName?: string;
}

interface Variant {
  varientID: string;
  variantName: string;
  variantValues: VariantValue[];
}

type VariantValue = {
  attributeID: string;
  varientValue: string;
  costPrice: number;
  salePrice: number;
  qty: number;
  barcode: string;
};

export default function ModifyVarientForm({
  values,
  isOpen,
  onShowMessage,
  productName = "Product",
}: PassModifyBasicInfo) {
  const [loading, setLoading] = useState(false);
  const [varientList, setVarinetList] = useState<Variant[]>(values);
  const [selectedBarcode, setSelectedBarcode] = useState<{
    attributeID: string;
    productName: string;
    variantName: string;
    varientValue: string;
    barcode: string;
    salePrice: number;
  } | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleVariantChange = (
    variantIndex: number,
    attrIndex: number,
    field: keyof VariantValue,
    value: string | number,
  ) => {
    setVarinetList((prev) => {
      const updated = [...prev];
      updated[variantIndex].variantValues[attrIndex] = {
        ...updated[variantIndex].variantValues[attrIndex],
        [field]: value,
      };
      return updated;
    });
  };

  const ModifyVarient = async (
    NewID: string,
    barcode: string,
    costPrice: number,
    salePrice: number,
    qty: number,
    varientValue: string,
  ) => {
    const payload = {
      varientValue: varientValue,
      qty: qty,
      costPrice: costPrice,
      salePrice: salePrice,
      barcode: barcode,
    };

    try {
      setSavingId(NewID);
      const token = localStorage.getItem("adminToken");
      const response = await ModifyProductVarinetAttribute(
        payload,
        NewID,
        String(token),
      );

      if (response.status === 200) {
        onShowMessage(
          response.message || "Variant updated successfully",
          "success",
        );
      } else {
        onShowMessage(response.message, "error");
      }
    } catch (error) {
      onShowMessage("Failed to update variant", "error");
    } finally {
      setSavingId(null);
    }
  };

  const handleBarcodeExport = (
    attr: VariantValue,
    variantName: string,
    varientValue: string,
  ) => {
    setSelectedBarcode({
      attributeID: attr.attributeID,
      productName: productName,
      variantName: variantName,
      varientValue: varientValue,
      barcode: attr.barcode,
      salePrice: attr.salePrice,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-[50] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => isOpen("")}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-xl font-semibold text-gray-800">
              Manage Product Variants
            </h2>
            <button
              onClick={() => isOpen("")}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {loading && <Spinner />}

            {varientList.length > 0 ? (
              <div className="space-y-6">
                {varientList.map((item, itemIndex) => (
                  <div
                    key={item.varientID}
                    className="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                  >
                    {/* Variant Header */}
                    <div className="px-6 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-indigo-900 capitalize">
                        {item.variantName}
                      </h3>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Value
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Barcode
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Quantity
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Cost Price
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Sale Price
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {item.variantValues.map((attr, attrIndex) => (
                            <tr
                              key={attr.attributeID}
                              className="hover:bg-gray-50 transition"
                            >
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={attr.varientValue}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      itemIndex,
                                      attrIndex,
                                      "varientValue",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={attr.barcode}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      itemIndex,
                                      attrIndex,
                                      "barcode",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  value={attr.qty}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      itemIndex,
                                      attrIndex,
                                      "qty",
                                      Number(e.target.value),
                                    )
                                  }
                                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  value={attr.costPrice}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      itemIndex,
                                      attrIndex,
                                      "costPrice",
                                      Number(e.target.value),
                                    )
                                  }
                                  className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  value={attr.salePrice}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      itemIndex,
                                      attrIndex,
                                      "salePrice",
                                      Number(e.target.value),
                                    )
                                  }
                                  className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      ModifyVarient(
                                        attr.attributeID,
                                        attr.barcode,
                                        attr.costPrice,
                                        attr.salePrice,
                                        attr.qty,
                                        attr.varientValue,
                                      )
                                    }
                                    disabled={savingId === attr.attributeID}
                                    className={`p-2 rounded-lg transition shadow-sm ${
                                      savingId === attr.attributeID
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700"
                                    } text-white`}
                                    title="Update Variant"
                                  >
                                    {savingId === attr.attributeID ? (
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <Save className="w-4 h-4" />
                                    )}
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleBarcodeExport(
                                        attr,
                                        item.variantName,
                                        attr.varientValue,
                                      )
                                    }
                                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition shadow-sm"
                                    title="Export Barcode"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No variants found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barcode Export Modal */}
      {selectedBarcode && (
        <BarcodeExport
          data={selectedBarcode}
          onClose={() => setSelectedBarcode(null)}
        />
      )}
    </>
  );
}
