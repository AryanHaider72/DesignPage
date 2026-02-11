"use client";

import { useState } from "react";

const slides = [
  {
    imgSrc: "/img1.webp",
    imgAlt:
      "Vibrant abstract painting with swirling blue and light pink hues on a canvas.",
    title: "Summer Collection 2026",
    description:
      "Stay cool and trendy with our latest summer fashion arrivals. Fresh styles for every occasion!",
    ctaUrl: "https://example.com",
    ctaText: "Shop Summer Collection",
  },
  // {
  //   imgSrc: "/img2.webp",
  //   imgAlt:
  //     "Vibrant abstract painting with swirling blue and light pink hues on a canvas.",
  //   title: "Winter Collection 2026",
  //   description:
  //     "Stay cool and trendy with our latest summer fashion arrivals. Fresh styles for every occasion!",
  //   ctaUrl: "https://example.com",
  //   ctaText: "Shop Winter Collection",
  // },
  {
    imgSrc: "/img3.jpg",
    imgAlt:
      "Vibrant abstract painting with swirling red, yellow, and pink hues on a canvas.",
    title: "Electronics Mega Sale",
    description:
      "Upgrade your tech with up to 50% off on selected electronics and gadgets. Limited time offer!",
    ctaUrl: "https://example.com",
    ctaText: "Shop Electronics",
  },
];

export default function MainBannerPage() {
  const [current, setCurrent] = useState(0);

  const previous = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  const next = () =>
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  return (
    <>
      <div className="relative w-full overflow-hidden">
        {/* Previous */}

        <button
          onClick={previous}
          className="absolute left-5 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
          aria-label="Previous slide"
        >
          ❮
        </button>

        {/* Next */}
        <button
          onClick={next}
          className="absolute right-5 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
          aria-label="Next slide"
        >
          ❯
        </button>

        {/* Slides */}
        <div className="relative min-h-[100vh] w-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                current === index ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Overlay */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-end gap-2 bg-gradient-to-t from-black/55 to-transparent px-6 py-10 text-center lg:px-32">
                <h3 className="text-2xl font-bold text-white lg:text-3xl">
                  {slide.title}
                </h3>
                <p className="max-w-xl text-sm text-neutral-200">
                  {slide.description}
                </p>

                {slide.ctaUrl && (
                  <a
                    href={slide.ctaUrl}
                    className="mt-2 rounded border border-white px-4 py-2 text-xs font-medium text-white hover:opacity-75 md:text-sm"
                  >
                    {slide.ctaText}
                  </a>
                )}
              </div>

              {/* Image */}
              <img
                src={slide.imgSrc}
                alt={slide.imgAlt}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 w-2 rounded-full ${
                current === index ? "bg-neutral-300" : "bg-neutral-300/50"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
