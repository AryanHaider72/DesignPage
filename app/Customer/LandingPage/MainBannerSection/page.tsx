"use client";

import { storeGet } from "@/api/types/Customer/LandingPage/StoreInfo/StoreInfo";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LandingPageProps {
  store: storeGet[];
}

export default function MainBannerPage({ store }: LandingPageProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const bannerData = store?.[0];
  const images = bannerData?.listImg || [];

  const previous = () => {
    if (isTransitioning) return;
    setDirection("left");
    setIsTransitioning(true);
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const next = () => {
    if (isTransitioning) return;
    setDirection("right");
    setIsTransitioning(true);
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 600);
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length, current]);

  if (!bannerData || images.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden bg-gray-900">
      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={previous}
          disabled={isTransitioning}
          className="absolute left-4 md:left-6 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/30 backdrop-blur-sm p-2 md:p-3 text-white hover:bg-black/50 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={next}
          disabled={isTransitioning}
          className="absolute right-4 md:right-6 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/30 backdrop-blur-sm p-2 md:p-3 text-white hover:bg-black/50 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}

      {/* Slides */}
      <div className="relative min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] w-full overflow-hidden">
        {images.map((img, index) => {
          // Calculate slide position for smooth transitions
          let slidePosition = "";
          let opacity = "opacity-0";

          if (current === index) {
            slidePosition = "translate-x-0";
            opacity = "opacity-100";
          } else if (
            direction === "right" &&
            current === (index + 1) % images.length
          ) {
            slidePosition = "-translate-x-full";
            opacity = "opacity-0";
          } else if (
            direction === "left" &&
            current === (index - 1 + images.length) % images.length
          ) {
            slidePosition = "translate-x-full";
            opacity = "opacity-0";
          } else if (index < current) {
            slidePosition = "-translate-x-full";
            opacity = "opacity-0";
          } else {
            slidePosition = "translate-x-full";
            opacity = "opacity-0";
          }

          return (
            <div
              key={img.imageID}
              className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${slidePosition} ${opacity}`}
            >
              {/* Background Image with Zoom Effect */}
              <div className="absolute inset-0">
                <img
                  src={img.url}
                  alt={bannerData.headerText || "Store banner"}
                  className={`h-full w-full object-cover transition-transform duration-[8000ms] ease-out ${
                    current === index ? "scale-110" : "scale-100"
                  }`}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>

              {/* Content Overlay with Animation */}
              <div
                className={`absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 px-6 py-10 text-center lg:px-32
                  transition-all duration-700 delay-300 ${
                    current === index
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
              >
                {/* Animated Header */}
                <h3 className="text-2xl md:text-4xl lg:text-5xl font-light text-white tracking-wide max-w-3xl">
                  {bannerData.headerText}
                </h3>

                {/* Animated Subheading */}
                <p className="max-w-xl text-sm md:text-base text-gray-200 leading-relaxed">
                  {bannerData.subHeadingText}
                </p>

                {/* Animated Button */}
                <a
                  href="/shop"
                  className="group mt-6 inline-flex items-center gap-2 rounded-full border border-white/50 px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base font-medium text-white transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
                >
                  Shop Now
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2 md:gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (isTransitioning) return;
                setDirection(index > current ? "right" : "left");
                setIsTransitioning(true);
                setCurrent(index);
                setTimeout(() => setIsTransitioning(false), 600);
              }}
              disabled={isTransitioning}
              className={`transition-all duration-300 rounded-full ${
                current === index
                  ? "w-6 md:w-8 h-1.5 md:h-2 bg-white"
                  : "w-1.5 md:w-2 h-1.5 md:h-2 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Optional: Slide Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-6 right-6 z-30 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white">
          {current + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
