"use client";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface newItem {
  attributeID: string;
  productName: string;
  qty: number;
  varientValue: string;
  price: number;
  barcode: string;
  stockQty: number;
  discount: number;
}
interface VarintList {
  productName: string;
  varientID: string;
  variantName: string;
  discount: number;
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
  VarintListInPopUp: VarintList[];
  onAddVarientItem: (item: newItem) => void;
}
export default function ShowVarientItems({
  onToggleVarientList,
  VarintListInPopUp,
  onAddVarientItem,
}: ShowSaleForm) {
  const [newItem, setNewItem] = useState<newItem[]>([]);

  //   const handleAddtoList = (attributeID: string) => {
  //     // find item
  //     const data = VarintListInPopUp.find(
  //       (item) => item.attributeID === attributeID,
  //     );
  //     if (!data) return;

  //     const newEntry: newItem = {
  //       attributeID: data.attributeID,
  //       productName: data.productName,
  //       qty: -1, // negative for return
  //       varientValue: data.varientValue,
  //       price: data.salePrice,
  //       barcode: data.barcode,
  //       stockQty: Math.abs(data.qty),
  //       discount: 0,
  //     };

  //     onAddVarientItem(newEntry);
  //   };

  const handleAddtoList = (varientID: string, attributeID: string) => {
    const data = VarintListInPopUp.find((item) => item.varientID === varientID);
    if (!data) return;
    const attribute = data.variantValues.find(
      (item) => item.attributeID === attributeID,
    );
    if (!attribute) return;

    const newEntry: newItem = {
      attributeID: attribute.attributeID,
      productName: data.productName,
      qty: 1,
      varientValue: attribute.varientValue,
      price: attribute.salePrice,
      barcode: attribute.barcode,
      stockQty: attribute.qty,
      discount: 0,
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
          <>
            <h1 key={item.varientID} className="text-lg font-bold">
              {item.variantName}
            </h1>
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
                {item.variantValues.map((item2) => (
                  <tr className="border-t">
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
                        className="px-2 py-1 bg-yellow-500 text-white rounded-md"
                      >
                        <Plus />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ))}
      </div>
    </>
  );
}
