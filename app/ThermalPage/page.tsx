// components/BillingReceipt.tsx
import React from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface StoreInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  receiptNo: string;
  date: string;
  time: string;
  cashier: string;
}

const BillingReceipt = () => {
  // Sample data - in real app, this would come from props/state
  const storeInfo: StoreInfo = {
    name: "SUPER MART",
    address: "123 Main Street, Downtown",
    phone: "+1 (234) 567-890",
    email: "support@supermart.com",
    website: "www.supermart.com",
    taxId: "TAX ID: 12-3456789",
    receiptNo: "RCPT-2024-001",
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    cashier: "John Doe",
  };

  const products: Product[] = [
    { id: 1, name: "Fresh Milk 1L", price: 3.99, quantity: 2 },
    { id: 2, name: "Bread Whole Wheat", price: 2.49, quantity: 1 },
    { id: 3, name: "Eggs Grade A (12 pcs)", price: 4.99, quantity: 1 },
    { id: 4, name: "Organic Apples", price: 5.99, quantity: 3 },
    { id: 5, name: "Chicken Breast (lb)", price: 7.99, quantity: 2 },
  ];

  const calculateSubtotal = () => {
    return products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0,
    );
  };

  const tax = calculateSubtotal() * 0.08; // 8% tax
  const total = calculateSubtotal() + tax;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Receipt Container - exactly 80mm width */}
      <div
        className="bg-white shadow-xl mx-auto"
        style={{
          width: "302px", // ~80mm at 96dpi
          maxWidth: "302px",
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: "12px",
          lineHeight: "1.5",
        }}
      >
        {/* Paper edge effect */}
        <div className="border border-gray-200 p-3">
          {/* Welcome Message - visible */}
          <div className="text-center border-b border-gray-200 pb-3 mb-3">
            <div className="flex justify-center space-x-1 text-[10px] text-gray-400 mb-1">
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
            </div>
            <p className="font-medium text-xs text-gray-500 uppercase tracking-wider">
              welcome to
            </p>
            <h1 className="text-xl font-semibold tracking-wide text-blue-600">
              {storeInfo.name}
            </h1>
            <p className="text-[10px] text-gray-500 mt-2">
              thank you for shopping with us
            </p>
          </div>

          {/* Receipt Info - visible */}
          <div className=" border-b border-gray-200 py-2 mb-3 text-[10px] text-gray-700">
            <div className="flex justify-between">
              <span className="font-medium">
                Receipt: {storeInfo.receiptNo}
              </span>
              <span>{storeInfo.date}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Cashier: {storeInfo.cashier}</span>
              <span>{storeInfo.time}</span>
            </div>
          </div>

          {/* Product Listing Header */}
          <div className="border-b border-gray-300 pb-2 mb-2 text-[10px] text-gray-700 font-medium">
            <div className="flex justify-between">
              <span className="w-1/2">Item</span>
              <span className="w-1/6 text-right">Qty</span>
              <span className="w-1/6 text-right">Price</span>
              <span className="w-1/6 text-right">Total</span>
            </div>
          </div>

          {/* Products List */}
          <div className="space-y-2 mb-4">
            {products.map((product) => (
              <div key={product.id} className="text-[11px]">
                <div className="flex justify-between">
                  <span className="w-1/2 truncate text-gray-800">
                    {product.name}
                  </span>
                  <span className="w-1/6 text-right text-gray-700">
                    {product.quantity}
                  </span>
                  <span className="w-1/6 text-right text-gray-700">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="w-1/6 text-right font-medium text-gray-800">
                    ${(product.price * product.quantity).toFixed(2)}
                  </span>
                </div>
                {product.id === 3 && (
                  <div className="text-[8px] text-gray-500 ml-2">
                    * large size
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Separator */}
          <div className="border-t border-gray-300 my-3"></div>

          {/* Totals Section */}
          <div className="space-y-1.5 text-[11px] mb-4">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax (8%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 my-1.5"></div>
            <div className="flex justify-between font-bold text-gray-900">
              <span className="text-sm">TOTAL</span>
              <span className="text-base">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="text-[9px] text-gray-600 mb-4">
            <div className="flex justify-between">
              <span>Payment: VISA •••• 4242</span>
              <span className="text-green-600">APPROVED</span>
            </div>
            <div className="flex justify-between mt-0.5">
              <span>Change: $0.00</span>
              <span>Card</span>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="text-center border-t border-gray-200 pt-4 mt-2">
            <p className="text-sm font-medium text-gray-800">
              THANK YOU FOR SHOPPING!
            </p>
            <p className="text-[10px] text-gray-500 mt-1">please come again</p>

            {/* Instructions */}
            <div className="bg-gray-50 p-3 mt-3 text-[9px] text-gray-600 text-left rounded">
              <p className="font-medium text-gray-700 mb-1.5">
                📋 INSTRUCTIONS:
              </p>
              <div className="space-y-1">
                <p>• Keep this receipt for warranty</p>
                <p>• Returns accepted within 30 days</p>
                <p>• Show receipt for exchanges</p>
              </div>
            </div>
          </div>

          {/* FOOTER - Phone, Email, Website, Tax ID */}
          <div className="mt-4 pt-3 border-t border-gray-200 text-center">
            <div className="space-y-1.5">
              <div className="flex justify-center items-center space-x-3 text-[9px] text-gray-500">
                <span>📞 {storeInfo.phone}</span>
                <span>✉️ {storeInfo.email}</span>
              </div>

              <div className="flex justify-center items-center space-x-3 text-[9px] text-gray-500">
                <span>🌐 {storeInfo.website}</span>
                <span>🏢 {storeInfo.taxId}</span>
              </div>
            </div>

            {/* Store Hours (optional) */}
            <div className="mt-2 text-[8px] text-gray-400">
              <p>Mon-Sat: 8am - 10pm | Sun: 10am - 8pm</p>
            </div>

            {/* Barcode */}
            <div className="mt-3 text-[8px] font-mono tracking-[3px] text-gray-400">
              ||| |||| || ||| |||| || ||||
            </div>

            {/* Receipt Footer */}
            <div className="mt-2 text-[6px] text-gray-300">
              {storeInfo.receiptNo} • {storeInfo.date} • {storeInfo.time}
            </div>

            <div className="mt-2 text-[6px] text-gray-200">
              * Electronic receipt • Thank you *
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingReceipt;
