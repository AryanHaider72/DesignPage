// ThermalPreviewModel.tsx
import {
  ReturnSale,
  ReturnSaleItem,
} from "@/api/types/Posintegration/ReturnItem/ReturnItem";
import { Sale, SaleItem } from "@/api/types/Posintegration/Salespanel";
import React, { useEffect, useRef, useState } from "react";

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
export default function ThermalPreviewModel({
  getData,
  printRef,
}: getExportData) {
  const [list, setList] = useState<SaleItem[]>([]);

  const calculateSubtotal = () => {
    return getData[0].itemList.reduce(
      (sum, product) => sum + product.price * product.qty,
      0,
    );
  };
  useEffect(() => {
    const data = getData[0];
    setList(data.itemList);
  }, [getData]);
  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.08;
  const total = subtotal + 0.0;

  return (
    <div
      ref={printRef}
      style={{
        width: "80mm",
        backgroundColor: "#ffffff",
        color: "#000000",
        fontFamily: "monospace",
        padding: "5px",
      }}
    >
      {/* Thermal Receipt Content - Classic Receipt Style */}
      <div className="p-3 text-[11px]">
        {/* Store Header */}
        <div className="text-center border-b border-gray-300 pb-2 mb-2">
          <div className="flex justify-center space-x-1 text-[8px] text-gray-400 mb-1">
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
          </div>
          <h1 className="text-lg font-bold tracking-wide text-yellow-700">
            {list[0]?.storeName}
          </h1>
          <p className="text-[9px] text-gray-600">
            Address: {list[0]?.address}
          </p>
          <p className="text-[8px] text-gray-500">Tel: {list[0]?.phone}</p>
          <p className="text-[8px] text-gray-500 mt-1">
            THANK YOU FOR SHOPPING!
          </p>
        </div>

        {/* Receipt Info */}
        <div className="border-b border-gray-300 pb-2 mb-2 text-[9px]">
          <div className="flex justify-between">
            <span>Receipt: {getData[0].invoiceNo}</span>
            <span>{getData[0].saleDate.split("T")[0]}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Customer: {getData[0].customerName}</span>
            {/* <span>{new Date().toLocaleTimeString()}</span> */}
          </div>
        </div>

        {/* Product Listing Header */}
        <div className="border-b border-gray-300 pb-1 mb-1 text-[8px] font-bold">
          <div className="flex justify-between">
            <span className="w-[45%]">ITEM</span>
            <span className="w-[15%] text-right">QTY</span>
            <span className="w-[20%] text-right">PRICE</span>
            <span className="w-[20%] text-right">TOTAL</span>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-1 mb-3">
          <div className="text-[9px]">
            {getData[0].itemList.map((item, index) => (
              <div key={index} className="flex flex-col justify-between">
                <div className="flex justify-between">
                  <span className="w-[45%]">{item.productName}</span>
                  <span className="w-[15%] text-right">{item.qty}</span>
                  <span className="w-[20%] text-right">
                    {item.price.toFixed(2)}
                  </span>
                  <span className="w-[20%] text-right font-bold">
                    {(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
                {item.varinet && (
                  <div className="flex justify-between text-[8px] text-gray-500 mt-0.5">
                    <span className="w-[45%] pl-2">└─ {item.varinet}</span>
                    <span className="w-[15%]"></span>
                    <span className="w-[20%]"></span>
                    <span className="w-[20%]"></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-dashed border-gray-400 my-2"></div>

        {/* Totals */}
        <div className="space-y-1 text-[10px] mb-3">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8%):</span>
            <span>{0.0}</span>
          </div>
          <div className="border-t border-dashed border-gray-400 my-1"></div>
          <div className="flex justify-between font-bold text-sm">
            <span>TOTAL</span>
            <span>{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="text-[8px] text-gray-600 mb-3 border-t border-gray-300 pt-2">
          {/* <div className="flex justify-between">
            <span>Payment: CASH</span>
            <span className="text-green-600">
              {list[0]?.}- {getData[0]?.returnType}
            </span>
          </div> */}
          <div className="flex justify-between mt-0.5">
            <span>Amount Paid: {total.toFixed(2)}</span>
            <span>Change: 0.00</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-gray-300 pt-2">
          <p className="text-[8px] font-bold">THANK YOU - PLEASE COME AGAIN</p>

          {/* Store Info */}
          <div className="mt-2 text-[6px] text-gray-400">
            <div>
              {list[0]?.email}| {list[0]?.phone}
            </div>
            <div className="mt-1">
              {new Date().toLocaleDateString()}-
              {new Date().toLocaleTimeString()} • {getData[0].invoiceNo}
            </div>
          </div>

          {/* Cut Line */}
          <div className="mt-2 text-[6px] text-gray-300">
            - - - - - - - - - - - - - - - - - - - -
          </div>
          <div className="text-[5px] text-gray-300 mt-1">
            * Electronic receipt - valid without signature *
          </div>
        </div>
      </div>
    </div>
  );
}
