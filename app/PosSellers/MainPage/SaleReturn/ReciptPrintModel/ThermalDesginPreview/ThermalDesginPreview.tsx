// ThermalPreviewModel.tsx
import React from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function ThermalPreviewModel() {
  const products: Product[] = [
    { id: 1, name: "Fresh Milk 1L", price: 3.99, quantity: 2 },
    { id: 2, name: "Bread Whole Wheat", price: 2.49, quantity: 1 },
    { id: 3, name: "Eggs Grade A", price: 4.99, quantity: 1 },
    { id: 4, name: "Organic Apples", price: 5.99, quantity: 3 },
    { id: 5, name: "Chicken Breast", price: 7.99, quantity: 2 },
  ];

  const calculateSubtotal = () => {
    return products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0,
    );
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div
      className="bg-white shadow-lg rounded-lg border border-gray-200"
      style={{
        width: "80mm", // Standard thermal receipt width
        fontFamily: "'Courier New', 'Inter', monospace",
      }}
    >
      {/* Preview Header */}
      <div className="bg-yellow-50 px-2 py-1 border-b border-yellow-200 flex justify-between items-center sticky top-0">
        <span className="text-xs font-medium text-yellow-700">
          Thermal Receipt (80mm)
        </span>
        <span className="text-[10px] text-yellow-500"> thermal paper</span>
      </div>

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
            KARIME
          </h1>
          <p className="text-[9px] text-gray-600">123 Main Street, Downtown</p>
          <p className="text-[8px] text-gray-500">Tel: +92-123-123456789</p>
          <p className="text-[8px] text-gray-500 mt-1">
            thank you for shopping!
          </p>
        </div>

        {/* Receipt Info */}
        <div className="border-b border-gray-300 pb-2 mb-2 text-[9px]">
          <div className="flex justify-between">
            <span>Receipt: ABC-1234</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Cashier: A. Haider</span>
            <span>{new Date().toLocaleTimeString()}</span>
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
          {products.map((product) => (
            <div key={product.id} className="text-[9px]">
              <div className="flex justify-between">
                <span className="w-[45%] truncate">{product.name}</span>
                <span className="w-[15%] text-right">{product.quantity}</span>
                <span className="w-[20%] text-right">
                  ${product.price.toFixed(2)}
                </span>
                <span className="w-[20%] text-right font-bold">
                  ${(product.price * product.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="border-t border-dashed border-gray-400 my-2"></div>

        {/* Totals */}
        <div className="space-y-1 text-[10px] mb-3">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-dashed border-gray-400 my-1"></div>
          <div className="flex justify-between font-bold text-sm">
            <span>TOTAL</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="text-[8px] text-gray-600 mb-3 border-t border-gray-300 pt-2">
          <div className="flex justify-between">
            <span>Payment: CASH</span>
            <span className="text-green-600">PAID</span>
          </div>
          <div className="flex justify-between mt-0.5">
            <span>Amount Paid: ${total.toFixed(2)}</span>
            <span>Change: $0.00</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-gray-300 pt-2">
          <p className="text-[8px] font-bold">THANK YOU - PLEASE COME AGAIN</p>

          {/* Barcode Simulation */}
          <div className="mt-2 text-[6px] font-mono tracking-[2px] text-gray-400">
            ||| |||| || ||| |||| || ||||
          </div>

          {/* Store Info */}
          <div className="mt-2 text-[6px] text-gray-400">
            <div>www.karime.com | support@karime.com</div>
            <div className="mt-1">Tax ID: 12-3456789</div>
            <div className="mt-1">
              {new Date().toLocaleTimeString()} • #ABC-1234
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
