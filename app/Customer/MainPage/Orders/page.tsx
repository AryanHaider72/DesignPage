"use client";
import { Clock, CreditCard, Eye, MapPin, Truck, User, X } from "lucide-react";
import { useState } from "react";

export default function OrderManagement() {
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [SelectedOrder, setSelectedOrder] = useState(false);
  const statusStyle = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "Shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  };
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Order Management
        </h1>
      </div>
      <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
        <div className="flex gap-2 mt-2">
          <div className="w-full">
            <label className="block text-gray-700 font-medium mb-2">
              Date From
            </label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-900"
              />
            </div>
          </div>
          <div className="w-full">
            <label className="block text-gray-700 font-medium mb-2">
              Date To
            </label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-900"
              />
            </div>
          </div>
        </div>
        <div className="space-y-5 mt-10">
          <>
            <div className="flex flex-col md:flex-row items-center justify-between bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all p-5">
              {/* === LEFT: Customer Info === */}
              <div className="flex flex-col w-full md:w-1/3">
                <h3 className="font-semibold text-gray-900">Aryan Haider</h3>
                <p className="text-sm text-gray-500">
                  <span className="font-bold">Phone No: </span>
                  +92-123-4567890
                </p>
                <p className="text-xs text-gray-400">
                  <span className="font-bold">Email: </span>
                  aryanhaider16@email.com
                </p>
              </div>

              {/* === CENTER: Status + Date === */}
              <div className="flex items-center gap-4 mt-3 md:mt-0 w-full md:w-1/3 justify-center">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full border ${statusStyle(
                    "pending",
                  )}`}
                >
                  Pending
                </span>
                <p className="text-sm text-gray-500">
                  {new Date().toISOString()[0].split("T")}
                </p>
              </div>

              {/* === RIGHT: Controls === */}
              <div className="flex items-center gap-3 mt-3 md:mt-0 w-full md:w-1/3 justify-end">
                <p className="text-lg font-semibold text-gray-900">Rs. 5470</p>
                <button
                  onClick={() => setSelectedOrder(true)}
                  className="flex items-center gap-2 text-sm text-white bg-black hover:bg-gray-900 rounded-lg px-4 py-2 transition"
                >
                  <Eye size={16} /> View
                </button>
              </div>
            </div>
          </>
        </div>
      </div>
      {SelectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setSelectedOrder(false);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* === Header === */}
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Order Details
                </h2>
                <p className="text-sm text-gray-500">
                  Order ID: 123654-45678-78987
                </p>
              </div>

              {/* === Customer Info === */}
              <div className="flex items-center gap-3 mb-6">
                <User className="w-5 h-5 text-gray-700" />
                <div>
                  <h4 className="font-semibold text-gray-900">Aryan Haider</h4>
                  <p className="text-sm text-gray-500">
                    aryanhaider16@gmail.com
                  </p>
                </div>
              </div>

              {/* === Items === */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Ordered Items
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr className="text-left text-sm font-semibold text-gray-700">
                        <th className="p-3">Product</th>
                        <th className="p-3 text-center">Quantity</th>
                        <th className="p-3 text-right">Item Price</th>
                        <th className="p-3 text-right">Shipping</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Bags</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50">
                        {/* Product */}
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={"/placeholder.jpg"}
                                width={56}
                                height={56}
                                className="object-cover"
                              />
                            </div>
                            <p className="font-medium text-gray-900 text-sm">
                              FM-BLK 123
                            </p>
                          </div>
                        </td>

                        {/* Quantity */}
                        <td className="p-3 text-center text-gray-600 font-medium">
                          Qty: 2
                        </td>

                        {/* Item Price */}
                        <td className="p-3 text-right font-medium text-gray-900">
                          1200
                        </td>

                        {/* Shipping */}
                        <td className="p-3 text-right text-gray-700 font-medium">
                          50
                        </td>

                        {/* Status */}
                        <td className="p-3 text-center">
                          <span
                            className={`px-3 py-1 text-sm font-medium rounded-full border inline-block ${statusStyle(
                              "pending",
                            )}`}
                          >
                            {"pending"}
                          </span>
                        </td>
                        <td className="p-3 text-right text-gray-700 font-medium">
                          2
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* === Delivery + Payment Info === */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-700 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Shipping Address
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Street-Address-123-ABC
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-gray-700 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Delivery Method
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Currenlty UnAvalibale
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-gray-700 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Payment Method
                    </h4>
                    <p className="text-gray-600 text-sm">COD</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-700 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Estimated Delivery
                    </h4>
                    <p className="text-gray-600 text-sm">4-5 Days</p>
                  </div>
                </div>
              </div>

              {/* === Summary === */}

              <div className="flex font-semibold justify-between">
                <span className="text-sm">Sub-Total</span>
                <span className=" text-gray-900 text-sm">Rs: 2500</span>
              </div>
              <div className="flex font-semibold justify-between">
                <span className="text-sm">Shipment Charges:</span>
                <span className=" text-gray-900 text-sm">Rs: 50</span>
              </div>
              <div className="border-t mt-2 text-sm text-gray-700">
                <div className="flex  p-1 font-semibold justify-between">
                  <span className="">Grand Total:</span>
                  <span className=" text-gray-900 text-sm">Rs: 2550</span>
                </div>
              </div>
            </>
          </div>
        </div>
      )}
    </>
  );
}
