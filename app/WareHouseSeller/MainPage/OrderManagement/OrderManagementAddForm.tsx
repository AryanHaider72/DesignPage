"use client";
import { SendToCloudinary } from "@/api/lib/OtherController/UploadToCloudinary/UploadToCloudinary";
import { SendToCloudinaryVideo } from "@/api/lib/OtherController/UploadVideoToCloudinary/UploadVideoToCloudinary";
import WareHouseSellerOrderGet from "@/api/lib/WareHouseSeller/OrderGet/OrderGet";
import WareHouseSellerOrderConfirmation from "@/api/lib/WareHouseSeller/OrderModify/OrderModify";
import MessagePopUp from "@/app/UsefullComponent/MessagePopup/page";
import { useState, useRef, useEffect } from "react";
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
}

export default function OrderManagementAddForm() {
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [PackedBy, setPackedBy] = useState("");
  const [DetailID, setDetailID] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderlist, setOrderList] = useState<orderList[]>([]);
  const [packedVideo, setPackedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Max video size in bytes (e.g., 50MB = 50 * 1024 * 1024)
  const MAX_VIDEO_SIZE = 5 * 1024 * 1024; // 50MB

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0]; // Only take the first file

    // Check if it's a video file
    if (!file.type.startsWith("video/")) {
      setUploadError("Only video files are allowed");
      resetFileInput();
      return;
    }

    // Check file size
    if (file.size > MAX_VIDEO_SIZE) {
      const sizeInMB = (MAX_VIDEO_SIZE / (1024 * 1024)).toFixed(0);
      setUploadError(`Video size should not exceed ${sizeInMB}MB`);
      resetFileInput();
      return;
    }

    // Clear any previous error
    setUploadError(null);

    // Revoke previous preview URL to avoid memory leaks
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    // Create preview for new video
    const preview = URL.createObjectURL(file);

    setPackedVideo(file);
    setVideoPreview(preview);
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getOrder = async () => {
    const token = localStorage.getItem("wareHouseSellerToken");
    const response = await WareHouseSellerOrderGet(String(token));
    if (response.status === 200 || response.status === 201) {
      const data = response.data as ResponseOrder;
      setOrderList(data.orderList);
      setDetailID(data.orderList[0].orderDetailID);
    } else {
      setOrderList([]);
    }
  };

  const removeVideo = () => {
    // Revoke the object URL to avoid memory leaks
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    setPackedVideo(null);
    setVideoPreview(null);
    setUploadError(null);

    // Reset file input
    resetFileInput();
  };

  const addOrderConfirmation = async () => {
    if (!packedVideo) {
      setUploadError("Please upload a video");
      return;
    }

    if (!PackedBy.trim()) {
      setUploadError("Please enter who packed the order");
      return;
    }

    try {
      setLoading(true);
      const url = await SendToCloudinaryVideo(packedVideo);
      const secrureUrl = url.data.secure_url;

      // Uncomment and modify this part based on your API requirements
      const token = localStorage.getItem("wareHouseSellerToken");
      const formData = {
        detailID: DetailID,
        packedBy: PackedBy,
        secrureUrl: secrureUrl,
      };
      const response = await WareHouseSellerOrderConfirmation(
        String(token),
        formData,
      );
      if (response.status === 200 || response.status === 201) {
        removeVideo();
        setPackedBy("");
        setPackedVideo(null);
        getOrder();
        setShowMessage("Packed Modified successfully");
        setMessageType("success");
      } else {
        setShowMessage("Something Went Wrong..");
        setMessageType("error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrder();

    // Cleanup function to revoke object URL when component unmounts
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, []);

  return (
    <>
      {showMessage && (
        <MessagePopUp
          message={showMessage}
          type={messageType}
          duration={3000}
          onClose={() => setShowMessage(null)}
        />
      )}
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Order
            </label>
            <select
              value={DetailID}
              onChange={(e) => setDetailID(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            >
              <option>Select Order</option>
              {orderlist.length > 0 ? (
                <>
                  {orderlist.map((item) => (
                    <option key={item.orderDetailID} value={item.orderDetailID}>
                      {item.productName} ({item.varientValue}) | Qty: {item.qty}{" "}
                      | Bags: {item.bags}
                    </option>
                  ))}
                </>
              ) : (
                <option>No Record Found</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Packed By
            </label>
            <input
              type="text"
              value={PackedBy}
              onChange={(e) => setPackedBy(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Packed By"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Packed Video (Max 5MB)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            />
            {uploadError && (
              <p className="mt-1 text-sm text-red-600">{uploadError}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={addOrderConfirmation}
              className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              disabled={!packedVideo || !PackedBy.trim()}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Video Preview Section */}
        {videoPreview && (
          <div className="w-full">
            <h3 className="text-sm font-medium text-neutral-700 mb-3">
              Uploaded Video
            </h3>
            <div className="flex flex-wrap gap-4">
              <div className="relative group">
                <div className="w-90 h-48 rounded-lg overflow-hidden border-2 border-neutral-200 shadow-sm">
                  <video
                    src={videoPreview}
                    className="w-full h-full object-cover"
                    controls
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <button
                  onClick={removeVideo}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                  title="Remove video"
                >
                  ×
                </button>
                <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {packedVideo?.name?.length > 15
                    ? packedVideo?.name.substring(0, 12) + "..."
                    : packedVideo?.name}
                </span>
                <span className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {packedVideo?.size &&
                    (packedVideo.size / (1024 * 1024)).toFixed(2)}{" "}
                  MB
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
