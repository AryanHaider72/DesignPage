"use client";
import { Variant } from "@/api/types/Posintegration/Product/ProductGet";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface newItem {
  attributeID: string;
  qty: number;
  varientValue: string;
  price: number;
  barcode: string;
  stockQty: number;
  discount: number;
  productName?: string;
}

interface VarintList {
  varientID: string;
  variantName: string;
  variantValues: variantValues[];
}
interface variantValues {
  attributeID: string;
  varientValue: string;
  costPrice: number;
  salePrice: number;
  qty: number;
  barcode: string;
}
interface ShowSaleForm {
  onToggleVarientList: (value: boolean) => void;
  VarintListInPopUp: Variant[];
  onAddVarientItem: (item: newItem) => void;
}

export default function ShowVarientItems({
  onToggleVarientList,
  VarintListInPopUp,
  onAddVarientItem,
}: ShowSaleForm) {
  const handleAddtoList = (varientID: string, attributeID: string) => {
    const data = VarintListInPopUp.find((item) => item.varientID === varientID);
    if (!data) return;

    const attribute = data.varientSubList.find(
      (item) => item.attributeID === attributeID,
    );
    if (!attribute) return;

    const newEntry: newItem = {
      productName: data.productName,
      attributeID: attribute.attributeID,
      qty: 1,
      varientValue: attribute.varientValue,
      price: attribute.salePrice,
      barcode: attribute.barcode,
      stockQty: attribute.qty,
      discount: 0,
      // productName is optional, so it's okay to omit it
    };

    onAddVarientItem(newEntry);
  };

  return (
    <>
      <div className="flex w-full justify-end">
        <button
          onClick={() => {
            onToggleVarientList(false);
          }}
          className="text-right text-gray-600 hover:text-red-500"
        >
          <X />
        </button>
      </div>
      <div className="w-full overflow-x-auto mt-2">
        {VarintListInPopUp.map((item, index) => (
          <div key={item.varientID}>
            <h1 className="text-lg font-bold">{item.variantName}</h1>
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">
                    Barcode
                  </th>
                  <th className="px-4 py-2 text-center text-gray-700 font-medium">
                    Variant
                  </th>
                  <th className="px-4 py-2 text-center text-gray-700 font-medium">
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-center text-gray-700 font-medium">
                    Original Price
                  </th>
                  <th className="px-4 py-2 text-center text-gray-700 font-medium">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {item.varientSubList.map((item2) => (
                  <tr key={item2.attributeID} className="border-t">
                    <td className="px-4 py-2 text-left">{item2.barcode}</td>
                    <td className="px-4 py-2 text-center">
                      {item2.varientValue}
                    </td>
                    <td className="px-4 py-2 text-center">{item2.qty}</td>
                    <td className="px-4 py-2 text-center">{item2.salePrice}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() =>
                          handleAddtoList(item.varientID, item2.attributeID)
                        }
                        className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </>
  );
}
