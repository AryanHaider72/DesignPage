"use client";
import { useState, useRef } from "react";

export default function OrderManagementAddForm() {
  const [packedVideos, setPackedVideos] = useState<File[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const videoFiles = files.filter((file) => file.type.startsWith("video/"));

    // Create preview URLs
    const newPreviews = videoFiles.map((file) => URL.createObjectURL(file));

    setPackedVideos((prev) => [...prev, ...videoFiles]);
    setVideoPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeVideo = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(videoPreviews[index]);

    setPackedVideos((prev) => prev.filter((_, i) => i !== index));
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Order
            </label>
            <select className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition">
              <option>Select Order</option>
              <option>Order1</option>
              <option>Order2</option>
              <option>Order3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Packed By
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Packed By"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Packed Videos
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              multiple
              onChange={handleVideoUpload}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200"
            />
          </div>
        </div>

        {/* Video Preview Section */}
        {videoPreviews.length > 0 && (
          <div className="w-full">
            <h3 className="text-sm font-medium text-neutral-700 mb-3">
              Uploaded Videos
            </h3>
            <div className="flex flex-wrap gap-4">
              {videoPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <div className="w-90 h-48 rounded-lg overflow-hidden border-2 border-neutral-200 shadow-sm">
                    <video
                      src={preview}
                      className="w-full h-full object-cover"
                      controls
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <button
                    onClick={() => removeVideo(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                  >
                    ×
                  </button>
                  <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {packedVideos[index]?.name.length > 15
                      ? packedVideos[index]?.name.substring(0, 12) + "..."
                      : packedVideos[index]?.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
