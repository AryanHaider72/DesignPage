// A5PreviewModel.tsx
import React from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function A5PreviewModel() {
  const products: Product[] = [
    { id: 1, name: "Fresh Milk 1L", price: 3.99, quantity: 2 },
    { id: 2, name: "Bread Whole Wheat", price: 2.49, quantity: 1 },
    { id: 3, name: "Eggs Grade A", price: 4.99, quantity: 1 },
    { id: 4, name: "Organic Apples", price: 5.99, quantity: 3 },
    { id: 5, name: "Chicken Breast", price: 7.99, quantity: 2 },
    { id: 6, name: "Orange Juice", price: 4.49, quantity: 1 },
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
  const grandTotal = total;

  return (
    <div
      className="bg-white shadow-lg rounded-lg border border-gray-200"
      style={{
        width: "148mm", // A5 width
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Preview Header */}
      <div className="bg-purple-50 px-2 py-1 border-b border-purple-200 flex justify-between items-center sticky top-0">
        <span className="text-xs font-medium text-purple-700">
          A5 Preview (148mm x 210mm)
        </span>
        <span className="text-[10px] text-purple-500">Half letter size</span>
      </div>

      {/* A5 Content - More Compact */}
      <div className="p-4">
        {/* Header */}
        <div className="border-b border-gray-300 pb-3 mb-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-purple-600">Karime</h1>
              <p className="text-[10px] text-gray-600">ABC-123</p>
            </div>
            <div className="text-right">
              <div className="bg-purple-50 p-2 rounded">
                <p className="text-[10px] text-gray-600">INVOICE</p>
                <p className="text-sm font-bold text-gray-800">ABC-1234</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-[10px]">
          <div>
            <p className="font-semibold text-gray-700">Bill To:</p>
            <p>Customer Name</p>
            <p className="text-gray-600">New York, NY</p>
          </div>
          <div className="text-right">
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date().toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Cashier:</span> A. Haider
            </p>
          </div>
        </div>

        {/* Products Table - Compact */}
        <div className="mb-4">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="bg-purple-50">
                <th className="py-1 px-2 text-left">Item</th>
                <th className="py-1 px-2 text-right">Qty</th>
                <th className="py-1 px-2 text-right">Price</th>
                <th className="py-1 px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="py-1 px-2 truncate max-w-[60px]">
                    {product.name}
                  </td>
                  <td className="py-1 px-2 text-right">{product.quantity}</td>
                  <td className="py-1 px-2 text-right">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="py-1 px-2 text-right font-medium">
                    ${(product.price * product.quantity).toFixed(2)}
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
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Tax (8%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 my-2"></div>
          <div className="flex justify-between font-bold text-purple-700">
            <span>TOTAL:</span>
            <span>${grandTotal.toFixed(2)}</span>
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
