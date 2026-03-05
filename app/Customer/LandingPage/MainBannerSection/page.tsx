"use client";

import { storeGet } from "@/api/types/Customer/LandingPage/StoreInfo/StoreInfo";
import { useState, useEffect } from "react";

interface LandingPageProps {
  store: storeGet[];
}

export default function MainBannerPage({ store }: LandingPageProps) {
  const [current, setCurrent] = useState(0);

  // Get first store (based on your response structure)
  const bannerData = store?.[0];

  const images = bannerData?.listImg || [];

  const previous = () =>
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const next = () =>
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  // Optional: Auto slide every 5 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (!bannerData) return null;

  return (
    <div className="relative w-full overflow-hidden">
      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={previous}
          className="absolute left-5 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
        >
          ❮
        </button>
      )}

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={next}
          className="absolute right-5 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
        >
          ❯
        </button>
      )}

      {/* Slides */}
      <div className="relative min-h-[100vh] w-full">
        {images.map((img, index) => (
          <div
            key={img.imageID}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              current === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Overlay Content */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end gap-3 bg-gradient-to-t from-black/60 to-transparent px-6 py-10 text-center lg:px-32">
              <h3 className="text-2xl font-bold text-white lg:text-4xl">
                {bannerData.headerText}
              </h3>

              <p className="max-w-xl text-sm text-neutral-200 md:text-base">
                {bannerData.subHeadingText}
              </p>

              {/* Hardcoded Button */}
              <a
                href="/shop"
                className="mt-4 rounded border border-white px-6 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-black"
              >
                Shop Now
              </a>
            </div>

            {/* Background Image */}
            <img
              src={img.url}
              alt="Store banner"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[4000ms] ease-linear scale-100"
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                current === index ? "bg-white scale-125" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
