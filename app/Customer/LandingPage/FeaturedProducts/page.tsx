"use client";
import { useEffect, useState, useRef } from "react";
import ShopByProductCategory from "../ShopProductByCategory/page";
import {
  categoryList,
  subCategory,
} from "@/api/types/Customer/LandingPage/Category/GetCategroy";
import { useAppContext } from "@/app/useContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FetauredProductProps {
  categoryList: categoryList[];
}

export default function FeaturedProducts({}: FetauredProductProps) {
  const { categoryList } = useAppContext();
  const carouselRef = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState("");
  const [SubCategoryDetailID, setSubCategoryDetailID] = useState("");
  const [itemData, setItemData] = useState<subCategory[]>([]);

  useEffect(() => {
    if (categoryList) {
      setValue(categoryList[0]?.subCategoryName || "");
      fetchData(categoryList[0]?.subCategoryName || "");
      setSubCategoryDetailID(
        categoryList[0]?.subCategory[0].subCategoryDetailID || "",
      );
    }
  }, [categoryList]);

  const fetchData = (name: string) => {
    const data = categoryList.find((item) => item.subCategoryName === name);

    if (data) {
      setItemData(data.subCategory);
      if (carouselRef.current) {
        carouselRef.current.scrollLeft = 0;
      }
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      carouselRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className="py-12 bg-white">
        <div className="w-full flex justify-center mb-5">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-gray-300" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Trending Now
            </span>
            <div className="h-px w-8 bg-gray-300" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Section */}
          <div className=" flex flex-col gap-6 md:flex-row md:items-end md:justify-around mb-12">
            {/* LEFT: Heading */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-wide">
                TRENDING
              </h1>
              <p className="mt-1 text-xs text-gray-500">
                Discover the best-selling styles loved by our customers
              </p>
            </div>

            {/* RIGHT: Category Buttons */}
            <ul className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              {categoryList.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      fetchData(item.subCategoryName);
                      setValue(item.subCategoryName);
                    }}
                    className={`
                      relative text-sm md:text-base font-medium tracking-wide text-gray-600
                      after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:bg-gray-800 after:transition-all
                      ${value === item.subCategoryName ? "after:w-full text-gray-900" : "after:w-0"}
                      hover:after:w-full hover:text-gray-900
                      transition-colors duration-200
                    `}
                  >
                    {item.subCategoryName.toUpperCase()}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Collection Section */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Text Section - Fixed width */}
            <div className="flex flex-col w-full lg:w-[280px] lg:flex-shrink-0 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-3">
                Latest {value?.toLowerCase()} Collection.
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Explore our newest arrivals, featuring cutting-edge designs and
                top-quality materials to elevate your style and everyday life.
              </p>
              <div className="flex justify-center lg:justify-start">
                <a
                  href=""
                  className="mt-4 text-gray-600 hover:text-gray-900 text-base inline-flex items-center gap-1 group transition-colors duration-200"
                >
                  Shop Now
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                </a>
              </div>
            </div>

            {/* Carousel Section - Takes remaining space */}
            <div className="relative w-full lg:flex-1 min-w-0">
              {/* Carousel Buttons */}
              {itemData.length > 0 && (
                <>
                  <button
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-2 sm:-translate-x-4
                   rounded-full bg-white p-2 sm:p-3 shadow-md hover:bg-gray-50 
                   transition-all duration-200 border border-gray-200"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  </button>
                  <button
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-2 sm:translate-x-4
                   rounded-full bg-white p-2 sm:p-3 shadow-md hover:bg-gray-50 
                   transition-all duration-200 border border-gray-200"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  </button>
                </>
              )}

              {/* Carousel Container */}
              <div
                ref={carouselRef}
                className="overflow-x-auto pb-6 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <div
                  className="flex gap-5 md:gap-6 scroll-smooth"
                  style={{ width: "max-content", minWidth: "100%" }}
                >
                  {itemData.length > 0
                    ? itemData.map((item, index) => (
                        <div
                          key={index}
                          className="group w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px] flex-shrink-0
                         transform transition-all duration-300 hover:-translate-y-1"
                        >
                          <div
                            onClick={() =>
                              setSubCategoryDetailID(item.subCategoryDetailID)
                            }
                            className="cursor-pointer"
                          >
                            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                              {/* Image */}
                              <div className="relative h-[260px] sm:h-[280px] md:h-[300px] lg:h-[320px] overflow-hidden bg-gray-50">
                                <img
                                  src={
                                    item?.imagelist[0]?.url ||
                                    "/placeholder.jpg"
                                  }
                                  alt={item.name || "Product Image"}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                              </div>

                              {/* Content */}
                              <div className="p-4">
                                <h3 className="text-sm font-medium text-gray-900 text-center line-clamp-2">
                                  {item.name}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    : // Placeholder items
                      Array(3)
                        .fill(0)
                        .map((_, index) => (
                          <div
                            key={index}
                            className="w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px] flex-shrink-0"
                          >
                            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
                              <div className="h-[260px] sm:h-[280px] md:h-[300px] lg:h-[320px] bg-gray-100 animate-pulse">
                                <div className="w-full h-full bg-gray-200" />
                              </div>
                              <div className="p-4">
                                <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-3/4" />
                              </div>
                            </div>
                          </div>
                        ))}
                </div>
              </div>

              {/* Dots Indicator for Mobile */}
              {itemData.length > 3 && (
                <div className="flex justify-center gap-2 mt-6 lg:hidden">
                  {itemData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (carouselRef.current) {
                          const cardWidth = 280;
                          const gap = 24;
                          const scrollAmount = index * (cardWidth + gap);
                          carouselRef.current.scrollTo({
                            left: scrollAmount,
                            behavior: "smooth",
                          });
                        }
                      }}
                      className="h-1 rounded-full transition-all duration-300
                     bg-gray-300 hover:bg-gray-400 w-2 hover:w-4"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ShopByProductCategory
        value={value}
        SubCategoryID={SubCategoryDetailID}
      />
    </>
  );
}
