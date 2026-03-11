"use client";
import { Eye } from "lucide-react";
import { useState } from "react";

export default function OrderShipment() {
  const [ShowVideo, setShowVideo] = useState(false);
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Order Management
        </h1>
      </div>
      <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
        <div className="w-full flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Order
              </label>
              <div className="flex gap-2">
                <select
                  //   value={TillID}
                  //   onChange={(e) => {
                  //     setTillID(e.target.value);
                  //   }}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
                >
                  <option>Select Order</option>
                  <option>Order1</option>
                  <option>Order2</option>
                  <option>Order3</option>
                </select>
                <button
                  onClick={() => setShowVideo(!ShowVideo)}
                  className="px-2 py-2 text-white rounded-md shadow-md bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  <Eye />
                </button>
              </div>
            </div>
          </div>
          {ShowVideo && (
            <div className="w-full lg:max-w-md space-y-4">
              <video className="h-full w-full rounded-lg" controls>
                <source
                  src="https://docs.material-tailwind.com/demo.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
