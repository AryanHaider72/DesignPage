"use client";

import { useEffect, useRef, useState } from "react";
import {
  Package,
  Truck,
  MapPin,
  User,
  Hash,
  Calendar,
  CreditCard,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import JsBarcode from "jsbarcode";

export interface StickerData {
  trackingNumber: string;
  orderID: string;
  storeName: string;
  storeAddress?: string;
  storePhone?: string;
  storeEmail?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  orderDate: string;
  deliveryMethod: string;
  paymentMethod: string;
  products: {
    name: string;
    quantity: number;
    price: number;
    sku?: string;
  }[];
  totalAmount: number;
  shippingCharges: number;
  grandTotal: number;
  notes?: string;
  priority?: "standard" | "express" | "overnight";
  estimatedDelivery?: string;
}

interface ShippingStickerProps {
  data: StickerData;
  size?: "small" | "medium" | "large";
  showPreview?: boolean;
  onDownload?: () => void;
  onPrint?: () => void;
}

export default function ShippingSticker({
  data,
  size = "medium",
  showPreview = true,
  onDownload,
  onPrint,
}: ShippingStickerProps) {
  const barcodeRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Size configurations
  const sizeConfig = {
    small: {
      width: "w-80",
      padding: "p-3",
      titleSize: "text-lg",
      barcodeHeight: 30,
      fontSize: "text-xs",
    },
    medium: {
      width: "w-96",
      padding: "p-4",
      titleSize: "text-xl",
      barcodeHeight: 40,
      fontSize: "text-sm",
    },
    large: {
      width: "w-[500px]",
      padding: "p-6",
      titleSize: "text-2xl",
      barcodeHeight: 50,
      fontSize: "text-base",
    },
  };

  const config = sizeConfig[size];

  // Generate barcode when component mounts or tracking number changes
  useEffect(() => {
    if (barcodeRef.current && data.trackingNumber) {
      setIsGenerating(true);
      try {
        JsBarcode(barcodeRef.current, data.trackingNumber, {
          format: "CODE128",
          lineColor: "#000000",
          width: size === "small" ? 1.5 : 2,
          height: config.barcodeHeight,
          displayValue: true,
          fontSize: size === "small" ? 10 : 12,
          margin: size === "small" ? 5 : 10,
          textMargin: 5,
        });
      } catch (error) {
        console.error("Error generating barcode:", error);
      } finally {
        setIsGenerating(false);
      }
    }
  }, [data.trackingNumber, size, config.barcodeHeight]);

  const getPriorityColor = () => {
    switch (data.priority) {
      case "express":
        return "bg-red-100 text-red-700 border-red-200";
      case "overnight":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getPriorityIcon = () => {
    switch (data.priority) {
      case "express":
        return <Truck className="w-4 h-4" />;
      case "overnight":
        return <Clock className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Sticker Design */}
      <div
        className={`${config.width} bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl border-2 border-dashed border-gray-300 overflow-hidden`}
        style={{
          boxShadow: "0 20px 35px -10px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Header Section */}
        <div
          className={`${config.padding} bg-gradient-to-r from-gray-900 to-gray-800 text-white`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6" />
              <h3 className={`${config.titleSize} font-bold tracking-wide`}>
                SHIPPING LABEL
              </h3>
            </div>
            {data.priority && (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor()}`}
              >
                {getPriorityIcon()}
                <span className="uppercase">{data.priority}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-300">Handle with care • Fragile</p>
        </div>

        {/* Store Information */}
        <div
          className={`${config.padding} border-b border-gray-200 bg-gray-50`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-gray-800 rounded-full"></div>
            <h4 className="font-semibold text-gray-800">Store Information</h4>
          </div>
          <p className={`font-bold text-gray-900 ${config.fontSize}`}>
            {data.storeName}
          </p>
          {data.storeAddress && (
            <p className={`text-gray-600 mt-1 ${config.fontSize}`}>
              {data.storeAddress}
            </p>
          )}
          <div className="flex gap-3 mt-2">
            {data.storePhone && (
              <p
                className={`text-gray-500 flex items-center gap-1 ${config.fontSize}`}
              >
                <Phone className="w-3 h-3" /> {data.storePhone}
              </p>
            )}
            {data.storeEmail && (
              <p
                className={`text-gray-500 flex items-center gap-1 ${config.fontSize}`}
              >
                <Mail className="w-3 h-3" /> {data.storeEmail}
              </p>
            )}
          </div>
        </div>

        {/* Tracking Barcode Section */}
        <div
          className={`${config.padding} border-b border-gray-200 text-center bg-white`}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">
              Tracking Number: {data.trackingNumber}
            </span>
          </div>
          <div className="flex justify-center">
            {isGenerating ? (
              <div className="flex items-center justify-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <canvas ref={barcodeRef} className="mx-auto"></canvas>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Scan to track your package
          </p>
        </div>

        {/* Customer Information */}
        <div className={`${config.padding} border-b border-gray-200`}>
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-gray-700" />
            <h4 className="font-semibold text-gray-800">Customer Details</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p className={`font-medium text-gray-900 ${config.fontSize}`}>
                {data.customerName}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Phone Number</p>
              <p className={`font-medium text-gray-900 ${config.fontSize}`}>
                {data.customerPhone}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Email Address</p>
              <p className={`font-medium text-gray-900 ${config.fontSize}`}>
                {data.customerEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className={`${config.padding} border-b border-gray-200`}>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-gray-700" />
            <h4 className="font-semibold text-gray-800">Delivery Address</h4>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className={`text-gray-800 ${config.fontSize}`}>
              {data.shippingAddress}
            </p>
          </div>
        </div>

        {/* Order Information */}
        <div className={`${config.padding} border-b border-gray-200`}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-xs text-gray-500">Order ID</p>
              <p
                className={`font-mono font-medium text-gray-900 ${config.fontSize}`}
              >
                {data.orderID}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Order Date</p>
              <p className={`font-medium text-gray-900 ${config.fontSize}`}>
                {new Date(data.orderDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Delivery Method</p>
              <p className={`font-medium text-gray-900 ${config.fontSize}`}>
                {data.deliveryMethod}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className={`font-medium text-gray-900 ${config.fontSize}`}>
                {data.paymentMethod}
              </p>
            </div>
          </div>
        </div>

        {/* Products Information */}
        <div className={`${config.padding} border-b border-gray-200`}>
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-gray-700" />
            <h4 className="font-semibold text-gray-800">Products Ordered</h4>
          </div>
          <div className="space-y-2">
            {data.products.map((product, idx) => (
              <div key={idx} className="flex justify-between items-start py-1">
                <div className="flex-1">
                  <p className={`font-medium text-gray-900 ${config.fontSize}`}>
                    {product.name}
                  </p>
                  {product.sku && (
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Qty: {product.quantity}
                  </p>
                </div>
                <p className={`font-semibold text-gray-900 ${config.fontSize}`}>
                  Rs. {product.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div
          className={`${config.padding} border-b border-gray-200 bg-gray-50`}
        >
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">
                Rs. {data.totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping Charges</span>
              <span className="font-medium text-gray-900">
                Rs. {data.shippingCharges.toLocaleString()}
              </span>
            </div>
            {data.estimatedDelivery && (
              <div className="flex justify-between">
                <span className="text-gray-600">Est. Delivery</span>
                <span className="font-medium text-green-600">
                  {data.estimatedDelivery}
                </span>
              </div>
            )}
            <div className="border-t-2 border-gray-300 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">GRAND TOTAL</span>
                <span className="font-bold text-xl text-gray-900">
                  Rs. {data.grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {(data.notes || data.priority) && (
          <div className={`${config.padding} bg-yellow-50`}>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div>
                <h5 className="font-semibold text-yellow-800 text-sm">
                  Special Notes
                </h5>
                <p className="text-sm text-yellow-700">
                  {data.notes || "Priority handling required"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={`${config.padding} text-center bg-gray-900 text-white`}>
          <p className="text-xs">
            Thank you for shopping with {data.storeName}!
          </p>
          <p className="text-xs mt-1 opacity-75">
            For support: {data.storePhone || "contact@store.com"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      {showPreview && (
        <div className="flex gap-3 justify-center mt-4">
          <button
            onClick={onPrint}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition flex items-center gap-2 shadow-md"
          >
            <Package className="w-4 h-4" />
            Print Sticker
          </button>
          <button
            onClick={onDownload}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition flex items-center gap-2 shadow-md"
          >
            <Package className="w-4 h-4" />
            Download as PNG
          </button>
        </div>
      )}
    </div>
  );
}
