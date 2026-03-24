"use client";
import { categoryList } from "@/api/types/Customer/LandingPage/Category/GetCategroy";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface NavbarProps {
  categoryList: categoryList[];
}

export default function ShopByStyle({ categoryList }: NavbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only trigger once
        }
      },
      {
        threshold: 0.2, // Trigger when 20% of the section is visible
        rootMargin: "0px 0px -50px 0px", // Slight offset for better timing
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="w-full py-10 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section with Animation */}
        <div
          className={`text-center mb-5 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-gray-300 transition-all duration-500 delay-200" />
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Collections
              </span>
              <div className="h-px w-8 bg-gray-300 transition-all duration-500 delay-200" />
            </div>
          </div>
          <h2
            className="text-3xl md:text-4xl font-light text-gray-900 mb-3 transition-all duration-700 delay-100"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Shop Your Style
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto transition-all duration-700 delay-200">
            Find the perfect look for every occasion
          </p>
        </div>

        {/* Categories Grid */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {categoryList?.map((item, index) => (
            <Link
              href={`/Customer/Shop/${index}`}
              key={index}
              className={`group flex flex-col items-center transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative mb-3">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gray-100 overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300">
                  <img
                    src={
                      item.subCategory[0]?.imagelist[0]?.url ||
                      "/placeholder.jpg"
                    }
                    alt={item.subCategoryName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Decorative Ring on Hover */}
                <div className="absolute inset-0 rounded-full border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110" />
              </div>

              {/* Category Name */}
              <h3 className="text-sm md:text-base font-medium text-gray-800 group-hover:text-gray-600 transition-colors duration-200">
                {item.subCategoryName}
              </h3>

              {/* Shop Link */}
              <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-y-0 translate-y-1">
                Shop Now →
              </span>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        {categoryList && categoryList.length > 0 && (
          <div
            className={`text-center mt-5 transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <Link
              href="/Customer/Shop"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
            >
              <span>View All Collections</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
