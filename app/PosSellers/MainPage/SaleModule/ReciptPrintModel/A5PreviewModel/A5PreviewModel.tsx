// A5PreviewModel.tsx
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
export default function A5PreviewModel({ getData, printRef }: getExportData) {
  const [list, setList] = useState<SaleItem[]>([]);
  useEffect(() => {
    const data = getData[0];
    setList(data.itemList);
  }, [getData]);

  const calculateSubtotal = () => {
    return list?.reduce((sum, product) => sum + product.price * product.qty, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.0;
  const total = subtotal + 0.0;
  const grandTotal = total;

  return (
    <div
      ref={printRef}
      className="bg-white shadow-lg rounded-lg border border-gray-200"
      style={{
        width: "148mm", // A5 width
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* A5 Content - More Compact */}
      <div className="p-4">
        {/* Header */}
        <div className="border-b border-gray-300 pb-3 mb-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-purple-600">
                {list[0]?.storeName}
              </h1>
              <p className="text-[10px] text-gray-600">
                Address: {list[0]?.address}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-purple-50 p-2 rounded">
                <p className="text-[10px] text-gray-600">INVOICE</p>
                <p className="text-sm font-bold text-gray-800">
                  {getData[0].invoiceNo}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-[10px]">
          <div>
            <p className="font-semibold text-gray-700">Bill To:</p>
            <p>Customer Name: {getData[0].customerName}</p>
            <p className="text-gray-600">Address:{getData[0].address}</p>
          </div>
          <div className="text-right">
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {getData[0].saleDate.split("T")[0]}
            </p>
          </div>
        </div>

        {/* Products Table - Compact */}
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
                    {product.price.toLocaleString()}
                  </td>
                  <td className="py-1.5 px-3  border-r border-gray-300 text-right font-medium">
                    {(product.price * product.qty).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary - Compact */}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Discount:</span>
            <span className="text-gray-600">
              {getData[0].adjustment.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Amount Paid:</span>
            <span className="text-gray-600">
              {getData[0].amountPaid.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">GST (0%):</span>
            <span className="text-gray-600">{0.0}</span>
          </div>
          <div className="border-t border-gray-200 my-2"></div>
          <div className="flex justify-between font-bold text-purple-700">
            <span>TOTAL Bill:</span>
            <span>{grandTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-purple-700">
            <span>Balance: </span>
            {getData[0].totalBill -
              getData[0].amountPaid -
              getData[0].adjustment >
            0 ? (
              <span>
                Due:{" "}
                {(
                  getData[0].totalBill -
                  getData[0].amountPaid -
                  getData[0].adjustment
                ).toLocaleString()}
              </span>
            ) : (
              <span>
                Change:{" "}
                {
                  -(
                    getData[0].totalBill -
                    getData[0].amountPaid -
                    getData[0].adjustment
                  ).toLocaleString()
                }
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 text-center text-[8px] text-gray-400">
          <p>Thank you for shopping!</p>
          <p className="mt-1">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}
