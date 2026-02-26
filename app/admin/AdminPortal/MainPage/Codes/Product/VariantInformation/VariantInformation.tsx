"use client";
import { Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";

interface listVarient {
  varientName: string;
  varientAttributes: varientAttributes[];
}

interface varientAttributes {
  varientValue: string;
  qty: number;
  costPrice: number;
  salePrice: number;
  barcode: string;
}
interface VarinetInfoPassProps {
  values: listVarient[];
  onEdit: (DataList: listVarient[]) => void;
}

export default function VariantInformation({
  values,
  onEdit,
}: VarinetInfoPassProps) {
  const [mainVarientName, setMainVarientName] = useState("");
  const [listVarient, setListVarient] = useState<listVarient[]>(values);
  const [currentAttributes, setCurrentAttributes] = useState<
    varientAttributes[]
  >([]);
  const [newAttribute, setNewAttribute] = useState<varientAttributes>({
    varientValue: "",
    qty: 0,
    costPrice: 0,
    salePrice: 0,
    barcode: "",
  });

  const handleNewAttributeChange = (
    field: keyof varientAttributes,
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
      barcode: "",
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

  useEffect(() => {
    const data = listVarient.map((item) => ({
      varientName: item.varientName,
      varientAttributes: item.varientAttributes.map((item2) => ({
        varientValue: item2.varientValue,
        qty: item2.qty,
        costPrice: item2.costPrice,
        salePrice: item2.salePrice,
        barcode: item2.barcode,
      })),
    }));

    onEdit(data);
  }, [listVarient]);

  return (
    <>
      <div className="w-full flex flex-col xl:flex-row gap-6">
        {/* Left Section - Variants Table */}
        <div className="w-full xl:w-2/5 2xl:w-2/3">
          <div className="flex gap-2 items-center mb-4">
            <input
              type="text"
              placeholder="Enter Variant Name (Main)"
              value={mainVarientName}
              onChange={(e) => setMainVarientName(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm lg:text-base"
            />
            <button
              onClick={handleAddMainVariant}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center min-w-[44px]"
              title="Save Variant"
            >
              <Save className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>

          {/* Table Container with horizontal scroll for mobile */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs lg:text-sm">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-2 lg:px-4 py-2 lg:py-3 text-left font-medium text-gray-700 whitespace-nowrap">
                      Attribute Name
                    </th>
                    <th className="px-2 lg:px-4 py-2 lg:py-3 text-left font-medium text-gray-700 whitespace-nowrap">
                      Qty
                    </th>
                    <th className="px-2 lg:px-4 py-2 lg:py-3 text-left font-medium text-gray-700 whitespace-nowrap">
                      CP
                    </th>
                    <th className="px-2 lg:px-4 py-2 lg:py-3 text-left font-medium text-gray-700 whitespace-nowrap">
                      SP
                    </th>
                    <th className="px-2 lg:px-4 py-2 lg:py-3 text-left font-medium text-gray-700 whitespace-nowrap">
                      Barcode
                    </th>
                    <th className="px-2 lg:px-4 py-2 lg:py-3 text-left font-medium text-gray-700 whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Existing attributes */}
                  {currentAttributes.map((attr, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td
                        className="px-2 lg:px-4 py-2 lg:py-3 whitespace-nowrap max-w-[150px] truncate"
                        title={attr.varientValue}
                      >
                        {attr.varientValue}
                      </td>
                      <td className="px-2 lg:px-4 py-2 lg:py-3 whitespace-nowrap text-center">
                        {attr.qty}
                      </td>
                      <td className="px-2 lg:px-4 py-2 lg:py-3 whitespace-nowrap">
                        {Number(attr.costPrice).toFixed(2)}
                      </td>
                      <td className="px-2 lg:px-4 py-2 lg:py-3 whitespace-nowrap">
                        {Number(attr.salePrice).toFixed(2)}
                      </td>
                      <td
                        className="px-2 lg:px-4 py-2 lg:py-3 whitespace-nowrap font-mono text-xs max-w-[120px] truncate"
                        title={attr.barcode}
                      >
                        {attr.barcode}
                      </td>
                      <td className="px-2 lg:px-4 py-2 lg:py-3 whitespace-nowrap">
                        <button
                          onClick={() => handleRemoveAttribute(i)}
                          className="px-2 lg:px-3 py-1 lg:py-1.5 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors focus:ring-2 focus:ring-red-300"
                          title="Remove Attribute"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Row for adding new attribute */}
                  <tr className="bg-gray-50/50">
                    <td className="px-2 lg:px-4 py-2 lg:py-3">
                      <input
                        type="text"
                        placeholder="Name"
                        value={newAttribute.varientValue}
                        onChange={(e) =>
                          handleNewAttributeChange(
                            "varientValue",
                            e.target.value,
                          )
                        }
                        className="w-full p-1.5 lg:p-2 text-xs lg:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </td>
                    <td className="px-2 lg:px-4 py-2 lg:py-3">
                      <input
                        type="number"
                        min={0}
                        placeholder="Qty"
                        value={newAttribute.qty}
                        onChange={(e) =>
                          handleNewAttributeChange(
                            "qty",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-16 lg:w-full p-1.5 lg:p-2 text-xs lg:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </td>
                    <td className="px-2 lg:px-4 py-2 lg:py-3">
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="0.00"
                        value={newAttribute.costPrice}
                        onChange={(e) =>
                          handleNewAttributeChange(
                            "costPrice",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="w-20 lg:w-full p-1.5 lg:p-2 text-xs lg:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </td>
                    <td className="px-2 lg:px-4 py-2 lg:py-3">
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="0.00"
                        value={newAttribute.salePrice}
                        onChange={(e) =>
                          handleNewAttributeChange(
                            "salePrice",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="w-20 lg:w-full p-1.5 lg:p-2 text-xs lg:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </td>
                    <td className="px-2 lg:px-4 py-2 lg:py-3">
                      <input
                        type="text"
                        placeholder="Barcode"
                        value={newAttribute.barcode}
                        onChange={(e) =>
                          handleNewAttributeChange("barcode", e.target.value)
                        }
                        className="w-24 lg:w-full p-1.5 lg:p-2 text-xs lg:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </td>
                    <td className="px-2 lg:px-4 py-2 lg:py-3">
                      <button
                        onClick={handleAddAttribute}
                        className="w-full px-2 lg:px-3 py-1.5 lg:py-2 bg-yellow-500 text-white text-xs rounded-md hover:bg-yellow-600 transition-colors focus:ring-2 focus:ring-yellow-300 flex items-center justify-center gap-1"
                        title="Add Attribute"
                      >
                        <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="hidden sm:inline text-xs lg:text-sm">
                          Add
                        </span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Section - Stores Table */}
        <div className="w-full xl:w-2/5 2xl:w-2/3">
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="overflow-y-auto max-h-[500px]">
              {listVarient.length > 0 ? (
                <div>
                  {listVarient.map((item, idx) => (
                    <div
                      key={idx}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      {/* Variant Header */}
                      <div className="bg-gray-50 px-4 py-2.5 font-medium text-sm text-gray-700 border-b border-gray-200">
                        {item.varientName}
                      </div>

                      {/* Attributes Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200 bg-white">
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                #
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Barcode
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Value
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Qty
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                CP
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SP
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.varientAttributes &&
                            item.varientAttributes.length > 0 ? (
                              item.varientAttributes.map((item2, index) => (
                                <tr
                                  key={index}
                                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                                >
                                  <td className="px-4 py-2 text-sm text-gray-600">
                                    {index + 1}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-600 font-mono">
                                    {item2.barcode || "-"}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-800">
                                    {item2.varientValue}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-600">
                                    {item2.qty}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-600">
                                    {Number(item2.costPrice).toFixed(2)}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-600">
                                    {Number(item2.salePrice).toFixed(2)}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={6}
                                  className="px-4 py-4 text-sm text-gray-400 text-center"
                                >
                                  No attributes for this variant
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-gray-500">No variants added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
