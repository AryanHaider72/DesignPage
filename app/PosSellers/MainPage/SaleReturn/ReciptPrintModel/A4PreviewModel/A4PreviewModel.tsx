// A4PreviewModel.tsx
import React from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function A4PreviewModel() {
  const products: Product[] = [
    { id: 1, name: "Fresh Milk 1L", price: 3.99, quantity: 2 },
    { id: 2, name: "Bread Whole Wheat", price: 2.49, quantity: 1 },
    { id: 3, name: "Eggs Grade A (12 pcs)", price: 4.99, quantity: 1 },
    { id: 4, name: "Organic Apples", price: 5.99, quantity: 3 },
    { id: 5, name: "Chicken Breast (lb)", price: 7.99, quantity: 2 },
    { id: 6, name: "Orange Juice (1L)", price: 4.49, quantity: 1 },
    { id: 7, name: "Cereal Breakfast", price: 5.99, quantity: 1 },
    { id: 8, name: "Yogurt Pack", price: 6.99, quantity: 2 },
    { id: 9, name: "Tomatoes (lb)", price: 2.99, quantity: 1.5 },
    { id: 10, name: "Potatoes (5lb bag)", price: 4.99, quantity: 1 },
    { id: 11, name: "Cheddar Cheese", price: 5.49, quantity: 1 },
    { id: 12, name: "Paper Towels", price: 8.99, quantity: 1 },
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
  const discount = 5.0;
  const grandTotal = total - discount;

  return (
    <div
      className="bg-white shadow-lg rounded-lg border border-gray-200"
      style={{
        width: "210mm",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Preview Header - Only visible in preview mode */}
      <div className="bg-blue-50 px-3 py-1.5 border-b border-blue-200 flex justify-between items-center sticky top-0">
        <span className="text-xs font-medium text-blue-700">
          A4 Preview (210mm x 297mm)
        </span>
        <span className="text-[10px] text-blue-500">Scale: 60%</span>
      </div>

      {/* A4 Content */}
      <div className="p-6">
        {/* Header */}
        <div className="border-b-2 border-gray-300 pb-4 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-blue-600 mb-1">Karime</h1>
              <div className="text-xs text-gray-600 space-y-0.5">
                <p>ABC-123</p>
                <p>Phone: +92-123-123456789 | Email: abc@email.com</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-gray-600">INVOICE</p>
                <p className="text-xl font-bold text-gray-800">ABC-1234</p>
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
            <p className="text-sm font-medium">Customer Name</p>
            <p className="text-xs text-gray-600">123 Customer Street</p>
            <p className="text-xs text-gray-600">New York, NY 10001</p>
            <p className="text-xs text-gray-600">customer@email.com</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-1">
                  Invoice Date:
                </h3>
                <p className="text-xs">{new Date().toLocaleDateString()}</p>
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
                  Cashier:
                </h3>
                <p className="text-xs">Aryan Haider</p>
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
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 text-left">#</th>
                <th className="py-2 px-3 text-left">Product Description</th>
                <th className="py-2 px-3 text-right">Qty</th>
                <th className="py-2 px-3 text-right">Price</th>
                <th className="py-2 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.slice(0, 6).map(
                (
                  product,
                  index, // Show fewer items in preview
                ) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="py-1.5 px-3 text-gray-600">{index + 1}</td>
                    <td className="py-1.5 px-3">
                      <span className="font-medium">{product.name}</span>
                    </td>
                    <td className="py-1.5 px-3 text-right">
                      {product.quantity}
                    </td>
                    <td className="py-1.5 px-3 text-right">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="py-1.5 px-3 text-right font-medium">
                      ${(product.price * product.quantity).toFixed(2)}
                    </td>
                  </tr>
                ),
              )}
              <tr>
                <td colSpan={5} className="pt-2 text-center">
                  <span className="text-xs text-gray-400">
                    ... and 6 more items
                  </span>
                </td>
              </tr>
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
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%):</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-green-600">
                    -${discount.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-300 my-2"></div>
                <div className="flex justify-between font-bold">
                  <span>Grand Total:</span>
                  <span className="text-blue-600">
                    ${grandTotal.toFixed(2)}
                  </span>
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
