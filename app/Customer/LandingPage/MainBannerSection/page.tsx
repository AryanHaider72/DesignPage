"use client";

import { storeGet } from "@/api/types/Customer/LandingPage/StoreInfo/StoreInfo";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { useAppContext } from "@/app/useContext";

interface LandingPageProps {
  store: storeGet[];
}

export default function MainBannerPage({ store }: LandingPageProps) {
  const [current, setCurrent] = useState(0);
  const { categoryList } = useAppContext();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [subcatgeroyID, setSubCategoryID] = useState("");

  const bannerData = store?.[0];
  const images = bannerData?.listImg || [];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  useEffect(() => {
    if (categoryList) {
      setSubCategoryID(categoryList[1]?.subCategoryID);
    }
  }, [categoryList]);
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      next();
    }
    if (isRightSwipe) {
      previous();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const previous = () => {
    if (isTransitioning) return;
    setDirection("left");
    setIsTransitioning(true);
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const next = () => {
    if (isTransitioning) return;
    setDirection("right");
    setIsTransitioning(true);
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 700);
  };

  // Auto slide every 6 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      next();
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (!bannerData || images.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden bg-gradient-to-br from-gray-900 to-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={previous}
            disabled={isTransitioning}
            className="absolute left-4 md:left-8 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-md p-2.5 md:p-3.5 text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={next}
            disabled={isTransitioning}
            className="absolute right-4 md:right-8 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-md p-2.5 md:p-3.5 text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      )}

      {/* Slides */}
      <div className="relative min-h-[60vh] md:min-h-[70vh] lg:min-h-[85vh] w-full overflow-hidden">
        {images.map((img, index) => {
          let slideTransform = "";
          let slideOpacity = "opacity-0";
          let contentTransform = "translate-y-12 opacity-0";

          if (current === index) {
            slideTransform = "translate-x-0";
            slideOpacity = "opacity-100";
            contentTransform = "translate-y-0 opacity-100";
          } else if (
            direction === "right" &&
            current === (index + 1) % images.length
          ) {
            slideTransform = "-translate-x-full";
            slideOpacity = "opacity-0";
          } else if (
            direction === "left" &&
            current === (index - 1 + images.length) % images.length
          ) {
            slideTransform = "translate-x-full";
            slideOpacity = "opacity-0";
          } else if (index < current) {
            slideTransform = "-translate-x-full";
            slideOpacity = "opacity-0";
          } else {
            slideTransform = "translate-x-full";
            slideOpacity = "opacity-0";
          }

          return (
            <div
              key={img.imageID}
              className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform ${slideTransform} ${slideOpacity}`}
            >
              {/* Background Image with Parallax Effect */}
              <div className="absolute inset-0">
                <img
                  src={img.url}
                  alt={bannerData.headerText || "Store banner"}
                  className={`h-full w-full object-cover transition-transform duration-[10000ms] ease-out ${
                    current === index ? "scale-110" : "scale-100"
                  }`}
                />
                {/* Multi-layer Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
              </div>

              {/* Content Overlay */}
              <div className="relative z-20 flex flex-col items-center justify-center h-full px-6 py-10 text-center">
                {/* Decorative Badge */}
                <div
                  className={`mb-6 transition-all duration-700 delay-200 ${
                    current === index
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-4"
                  }`}
                >
                  {/* <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs md:text-sm font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    New Collection 2024
                  </span> */}
                </div>

                {/* Main Heading */}
                <h1
                  className={`max-w-4xl text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-tight md:leading-tight lg:leading-tight transition-all duration-700 delay-300 ${
                    current === index
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ fontFamily: "var(--font-playfair, serif)" }}
                >
                  {bannerData.headerText}
                </h1>

                {/* Subheading */}
                <p
                  className={`max-w-2xl mt-6 text-sm md:text-base lg:text-lg text-gray-200 leading-relaxed transition-all duration-700 delay-400 ${
                    current === index
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  {bannerData.subHeadingText}
                </p>

                {/* CTA Buttons */}
                <div
                  className={`mt-10 flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-500 ${
                    current === index
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <a
                    href={`/Customer/Shop/${subcatgeroyID}`}
                    className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 md:px-10 md:py-4 text-sm md:text-base font-medium text-white bg-white/10 backdrop-blur-sm border border-white/30 rounded-full overflow-hidden transition-all duration-300 hover:bg-white hover:text-black hover:border-white hover:shadow-2xl"
                  >
                    <span className="relative z-10">Shop Now</span>
                    <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </a>
                  {/* <a
                    href="/collections"
                    className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 md:px-10 md:py-4 text-sm md:text-base font-medium text-white border border-white/30 rounded-full transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
                  >
                    Explore Collection
                  </a> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicators - Modern Design */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-2 md:gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (isTransitioning) return;
                setDirection(index > current ? "right" : "left");
                setIsTransitioning(true);
                setCurrent(index);
                setTimeout(() => setIsTransitioning(false), 700);
              }}
              disabled={isTransitioning}
              className={`transition-all duration-500 rounded-full ${
                current === index
                  ? "w-8 md:w-10 h-1 bg-white"
                  : "w-2 h-1 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter - Minimal */}
      {images.length > 1 && (
        <div className="absolute bottom-8 right-6 z-30 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-white/80 font-mono">
          <span className="font-bold text-white">
            {String(current + 1).padStart(2, "0")}
          </span>
          <span className="mx-1">/</span>
          <span>{String(images.length).padStart(2, "0")}</span>
        </div>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 hidden md:block">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white/60 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
