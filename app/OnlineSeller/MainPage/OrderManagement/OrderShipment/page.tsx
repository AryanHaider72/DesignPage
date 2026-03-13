"use client";
import GetCouriereApi from "@/api/lib/Admin/Shipment/Courier/GetCourier/GetCourier";
import ModifyOrderStatusOrderConfirmation from "@/api/lib/OnlineSeller/ShipmentOrder/ModifyOrderStatus/ModifyOrderStatus";
import OnlineSellerManagerOrderGet from "@/api/lib/OnlineSeller/ShipmentOrder/orderget/ShipmentOrderGet";
import {
  CourierList,
  ResponseCouriereGetData,
} from "@/api/types/Admin/Shipment/Couriere/Couriere";
import Spinner from "@/app/UsefullComponent/Spinner/page";
import { CheckCheck, Eye, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ResponseOrder {
  message: string;
  orderList: orderList[];
}
interface orderList {
  bags: number;
  barcode: string;
  discount: number;
  orderDetailID: string;
  productName: string;
  qty: number;
  salePrice: number;
  shippingCharges: number;
  varientValue: string;
  videoUrl: string;
  packedBy: string;
}
export default function OrderShipment() {
  const [CourierID, setCourierID] = useState("");
  const [DetailID, setDetailID] = useState("");
  const [ShowVideo, setShowVideo] = useState(false);
  const [ShowMenu, setShowMenu] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<orderList[]>([]);
  const [courierData, setCourierData] = useState<CourierList[]>([]);

  const getDelieveryStandard = async () => {
    const token = localStorage.getItem("OnlineSellerToken");
    const response = await GetCouriereApi(String(token));
    const data = response.data as ResponseCouriereGetData;
    setCourierData(data.courierList);
  };
  const getOrder = async () => {
    try {
      setShowVideo(true);

      const token = localStorage.getItem("OnlineSellerToken");
      const response = await OnlineSellerManagerOrderGet(String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as ResponseOrder;
        setOrder(data.orderList);
      } else {
        setOrder([]);
      }
    } finally {
      setShowVideo(false);
    }
  };

  const ModifyOrder = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("OnlineSellerToken");
      const response = await ModifyOrderStatusOrderConfirmation(
        String(token),
        DetailID,
      );
      if (response.status === 200 || response.status === 201) {
        setDetailID("");
        getOrder();
        setShowMenu(false);
      } else {
        alert("Could Not Modify Record");
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getOrder();
    getDelieveryStandard();
  }, []);
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Order Management
        </h1>
      </div>
      <div className="w-full rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
        <div className="w-full flex flex-col lg:flex-row gap-8">
          {ShowVideo ? (
            <Spinner />
          ) : (
            <div className="space-y-5 mt-10 w-full">
              {order.length !== 0 ? (
                <>
                  {order.map((order) => (
                    <div
                      key={order.orderDetailID}
                      className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6"
                    >
                      {/* Product Info */}
                      <div className="flex flex-col gap-1 w-full md:w-1/3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.productName}
                        </h3>

                        <p className="text-sm text-gray-500">
                          Variant:{" "}
                          <span className="font-medium text-gray-700">
                            {order.varientValue}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Barcode:{" "}
                          <span className="font-medium text-gray-700">
                            {order.barcode}
                          </span>
                        </p>
                      </div>

                      {/* Order Details */}
                      <div className="flex items-center gap-6 w-full md:w-1/3 justify-start md:justify-center">
                        <div className="flex flex-col items-center bg-gray-50 px-4 py-2 rounded-xl">
                          <span className="text-xs text-gray-500">Bags</span>
                          <span className="font-semibold text-gray-800">
                            {order.bags}
                          </span>
                        </div>

                        <div className="flex flex-col items-center bg-gray-50 px-4 py-2 rounded-xl">
                          <span className="text-xs text-gray-500">Qty</span>
                          <span className="font-semibold text-gray-800">
                            {order.qty}
                          </span>
                        </div>

                        <div className="flex flex-col items-center bg-gray-50 px-4 py-2 rounded-xl">
                          <span className="text-xs text-gray-500">
                            Packed By
                          </span>
                          <span className="font-semibold text-gray-800">
                            {order.packedBy}
                          </span>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex justify-end gap-2 w-full md:w-1/3">
                        <button
                          onClick={() =>
                            order.videoUrl &&
                            window.open(order.videoUrl, "_blank")
                          }
                          className="flex items-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-black to-gray-800 hover:opacity-90 rounded-xl px-5 py-2.5 transition-all"
                        >
                          <Eye size={18} />
                          View Video
                        </button>
                        <button
                          onClick={() => {
                            setDetailID(order.orderDetailID);
                            setShowMenu(true);
                          }}
                          className="flex items-center gap-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-xl px-5 py-2.5 transition-all"
                        >
                          <CheckCheck />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p className="w-full  px-4 py-3 mb-2 rounded">
                  No Record Found
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      {ShowMenu && (
        <>
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => {
                  setShowMenu(false);
                }}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Select Courier
                </h2>
              </div>
              <div className="w-full lg:max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Courier Name
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                    <select
                      value={CourierID}
                      name="CategoryMain"
                      className="w-full bg-transparent outline-none text-gray-900 p-1"
                      onChange={(e) => {
                        setCourierID(e.target.value);
                      }}
                    >
                      <option>Select Courier</option>
                      {courierData.map((cat) => (
                        <option key={cat.courierID} value={cat.courierID}>
                          {cat.serviceName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={ModifyOrder}
                  className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
                >
                  {IsLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
