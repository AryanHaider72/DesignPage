// A4PreviewModel.tsx
import {
  ReturnSale,
  ReturnSaleItem,
} from "@/api/types/Posintegration/ReturnItem/ReturnItem";
import { Sale, SaleItem } from "@/api/types/Posintegration/Salespanel";
import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}
interface getExportData {
  getData: Sale[];
  printRef?: any;
}
export default function A4PreviewModel({ getData, printRef }: getExportData) {
  const [list, setList] = useState<SaleItem[]>([]);
  useEffect(() => {
    const data = getData[0];
    setList(data.itemList);
  }, [getData]);

  const calculateSubtotal = () => {
    return list?.reduce((sum, product) => sum + product.price * product.qty, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.08;
  const total = subtotal + 0.0;
  const discount = 0.0;
  const grandTotal = total - discount;

  return (
    <div
      ref={printRef}
      style={{
        backgroundColor: "#ffffff",
        color: "#000000",
        fontFamily: "monospace",
      }}
    >
      {/* A4 Content */}
      <div className="p-6">
        {/* Header */}
        <div className="border-b-2 border-gray-300 pb-4 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-blue-600 mb-1">
                {list[0]?.storeName}
              </h1>
              <div className="text-xs mt-2 text-gray-600 space-y-0.5">
                <p>Address: {list[0]?.address}</p>
                <p>
                  Phone: {list[0]?.phone} | Email: {list[0]?.email}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex justify-between items-center gap-3 bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-gray-600">INVOICE - </p>
                <p className="text-xs font-bold text-gray-800">
                  {getData[0].invoiceNo}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="text-xs font-semibold text-gray-600 mb-1">
              Bill To:
            </h3>
            <p className="text-sm font-medium">
              Customer Name: {getData[0].customerName}
            </p>
            <p className="text-xs text-gray-600">Email: {getData[0].email}</p>
            <p className="text-xs text-gray-600">
              Phone No: {getData[0].phoneNo}
            </p>
            <p className="text-xs text-gray-600">
              Address: {getData[0].address}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-1">
                  Invoice Date:
                </h3>
                <p className="text-xs">{getData[0].saleDate.split("T")[0]}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-1">
                  Due Date:
                </h3>
                <p className="text-xs">
                  {new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000,
                  ).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-1">
                  Time:
                </h3>
                <p className="text-xs">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="mb-6">
          <table className="w-full text-xs border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 border border-gray-300 text-left">
                  #
                </th>
                <th className="py-2 px-3 border border-gray-300 text-left">
                  Product Description
                </th>
                <th className="py-2 px-3 border border-gray-300 text-right">
                  Qty
                </th>
                <th className="py-2 px-3 border border-gray-300 text-right">
                  Price
                </th>
                <th className="py-2 px-3 border border-gray-300 text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list?.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50  ">
                  <td className="py-1.5 px-3 text-gray-600 border-r border-gray-300">
                    {index + 1}
                  </td>
                  <td className="py-1.5 px-3  border-r border-gray-300">
                    <span className="font-medium">{product.productName}</span>
                  </td>
                  <td className="py-1.5 px-3  border-r border-gray-300 text-right">
                    {product.qty}
                  </td>
                  <td className="py-1.5 px-3  border-r border-gray-300 text-right">
                    {product.price.toFixed(2)}
                  </td>
                  <td className="py-1.5 px-3  border-r border-gray-300 text-right font-medium">
                    {(product.price * product.qty).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold mb-2">Notes</h3>
            <div className="bg-gray-50 p-3 rounded text-xs space-y-1">
              <p>• Payment due within 30 days</p>
              <p>• Returns accepted within 30 days</p>
            </div>
          </div>

          <div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold mb-3">Summary</h3>
              <div className="space-y-2 text-xs">
                {/* <div className="flex justify-between">
                  <span className="text-gray-600">Paymnet:</span>
                  <span className="text-green-600">
                    {list[0]?.staus}- {getData[0]?.returnType}
                  </span>
                </div> */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%):</span>
                  <span className="font-medium">{0.0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-green-600">
                    {discount.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-300 my-2"></div>
                <div className="flex justify-between font-bold">
                  <span>Grand Total:</span>
                  <span className="text-blue-600">{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center border-t border-gray-200 pt-3">
          <p className="text-[10px] text-gray-400">
            Thank you for your business!
          </p>
        </div>
      </div>
    </div>
  );
}
