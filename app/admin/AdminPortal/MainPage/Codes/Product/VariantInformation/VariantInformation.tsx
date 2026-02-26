"use client";
import { Plus, Save } from "lucide-react";
import { useState } from "react";

interface Varient {
  varientName: string;
  varientAttributes: VarientAttribute[];
}
interface VarientAttribute {
  varientValue: string;
  qty: number;
  costPrice: number;
  salePrice: number;
  barCode: string;
}

export default function VariantInformation() {
  const [mainVarientName, setMainVarientName] = useState("");
  const [listVarient, setListVarient] = useState<Varient[]>([]);
  const [currentAttributes, setCurrentAttributes] = useState<
    VarientAttribute[]
  >([]);
  const [newAttribute, setNewAttribute] = useState<VarientAttribute>({
    varientValue: "",
    qty: 0,
    costPrice: 0,
    salePrice: 0,
    barCode: "",
  });

  const handleNewAttributeChange = (
    field: keyof VarientAttribute,
    value: string | number,
  ) => {
    setNewAttribute({ ...newAttribute, [field]: value });
  };
  const handleRemoveAttribute = (index: number) => {
    setCurrentAttributes(currentAttributes.filter((_, i) => i !== index));
  };
  const handleAddAttribute = () => {
    if (!newAttribute.varientValue.trim()) {
      alert("Please enter Attribute Name");
      return;
    }
    setCurrentAttributes([...currentAttributes, newAttribute]);
    setNewAttribute({
      varientValue: "",
      qty: 0,
      costPrice: 0,
      salePrice: 0,
      barCode: "",
    });
  };
  const handleAddMainVariant = () => {
    if (!mainVarientName.trim()) {
      alert("Please enter a Variant Name");
      return;
    }
    if (currentAttributes.length === 0) {
      alert("Please add at least one attribute");
      return;
    }

    const updatedList = [
      ...listVarient,
      {
        varientName: mainVarientName.trim(),
        varientAttributes: currentAttributes,
      },
    ];
    setListVarient(updatedList);
    // Reset inputs for next variant
    setMainVarientName("");
    setCurrentAttributes([]);
  };
  return (
    <>
      <div className="w-full flex gap-3">
        <div>
          <div className="flex gap-2 items-center mb-4">
            <input
              type="text"
              placeholder="Enter Variant Name (Main)"
              value={mainVarientName}
              onChange={(e) => setMainVarientName(e.target.value)}
              className="flex-grow p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddMainVariant}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Save />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-300 rounded">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-2">Attribute Name</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2">CP</th>
                  <th className="px-4 py-2">SP</th>
                  <th className="px-4 py-2">Barcode</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Existing attributes */}
                {currentAttributes.map((attr, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-300 odd:bg-white even:bg-gray-50"
                  >
                    <td className="px-4 py-2">{attr.varientValue}</td>
                    <td className="px-4 py-2">{attr.qty}</td>
                    <td className="px-4 py-2">{attr.costPrice}</td>
                    <td className="px-4 py-2">{attr.salePrice}</td>
                    <td className="px-4 py-2">{attr.barCode}</td>
                    <td className="px-4 py-2">
                      <button
                        className="px-2 py-1 bg-red-600 text-white rounded"
                        onClick={() => handleRemoveAttribute(i)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Row for adding new attribute */}
                <tr>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      placeholder="Attribute Name"
                      value={newAttribute.varientValue}
                      onChange={(e) =>
                        handleNewAttributeChange("varientValue", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={0}
                      value={newAttribute.qty}
                      onChange={(e) =>
                        handleNewAttributeChange(
                          "qty",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={newAttribute.costPrice}
                      onChange={(e) =>
                        handleNewAttributeChange(
                          "costPrice",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </td>

                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={newAttribute.salePrice}
                      onChange={(e) =>
                        handleNewAttributeChange(
                          "salePrice",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      placeholder="Enter BarCode"
                      value={newAttribute.barCode}
                      onChange={(e) =>
                        handleNewAttributeChange("barCode", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={handleAddAttribute}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center"
                      title="Add Attribute"
                    >
                      <Plus className="mr-1" />
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="py-3 px-4 text-sm text-neutral-500">#</th>
                <th className="py-3 px-4 text-sm text-neutral-500">
                  Store Name
                </th>
                <th className="py-3 px-4 text-sm text-neutral-500">Action</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </>
  );
}
