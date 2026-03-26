"use client";
import { addToServerCart } from "@/api/lib/CookiesApi/AddCart/AddCart";
import { getServerCart } from "@/api/lib/CookiesApi/GetCart/GetCart";
import { addToServerWishList } from "@/api/lib/CookiesApi/WishList/AddWishlist/AddWishlist";
import { getServerWishlist } from "@/api/lib/CookiesApi/WishList/GetWishList/GetWishList";
import { CartData } from "@/api/types/CookiesApi/CartItem";
import { FeaturedProductForCustomer } from "@/api/types/Customer/LandingPage/Product/Product";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";

interface feturedProductProps {
  onCommitChnage: () => void;
  FeaturedProduct?: FeaturedProductForCustomer[];
}

export default function MostFeaturedorPopular({
  onCommitChnage,
  FeaturedProduct = [],
}: feturedProductProps) {
  const router = useRouter();
  const list = ["Featured", "Most Popular"];
  const [value, setValue] = useState(list[0]);
  const [newProductList, setNewProductList] = useState<
    FeaturedProductForCustomer[]
  >([]);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [productPrices, setProductPrices] = useState<Record<string, number>>(
    {},
  );
  const [isVisible, setIsVisible] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!FeaturedProduct || FeaturedProduct.length === 0) return;
    const data = FeaturedProduct.filter((item) => item.feturedProduct === true);
    if (data) {
      setNewProductList(data);
    }
  }, [FeaturedProduct]);

  useEffect(() => {
    if (!newProductList || newProductList.length === 0) return;

    const initialPrices: Record<string, number> = {};
    newProductList.forEach((product) => {
      const firstVariant = product.variants?.[0];
      const firstAttribute = firstVariant?.variantValues?.[0];
      if (firstAttribute) {
        initialPrices[product.productID] = firstAttribute.salePrice;
      }
    });
    setProductPrices(initialPrices);
  }, [newProductList]);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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

  const updatePrice = (
    productID: string,
    variantID: string,
    attributeID: string,
  ) => {
    if (!newProductList) return;

    const product = newProductList.find((item) => item.productID === productID);
    if (!product) return;

    const variant = product.variants.find(
      (item2) => item2.varientID === variantID,
    );
    if (!variant) return;

    const attribute = variant.variantValues.find(
      (item3) => item3.attributeID === attributeID,
    );
    if (!attribute) return;

    setProductPrices((prev) => ({
      ...prev,
      [productID]: attribute.salePrice,
    }));

    setSelectedAttributes((prev) => ({
      ...prev,
      [productID]: attributeID,
    }));
  };

  const addToCart = async (ID: string) => {
    const newItem: CartData = {
      attributeID: ID,
      qty: 1,
    };
    const currentCart = await getServerCart();
    const updatedCart = [...currentCart, newItem];
    await addToServerCart(updatedCart);
    onCommitChnage();
  };
  const addToWishList = async (ID: string) => {
    const newItem: CartData = {
      attributeID: ID,
      qty: 1,
    };
    const currentCart = await getServerWishlist();
    const updatedCart = [...currentCart, newItem];
    await addToServerWishList(updatedCart);
    onCommitChnage();
  };

  if (!newProductList || newProductList.length === 0) {
    return null;
  }

  return (
    <div ref={sectionRef} className="py-12 bg-white overflow-hidden">
      <div className="w-full mx-auto px-4">
        {/* Decorative Top Line */}
        <div
          className={`w-full flex justify-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-gray-300 transition-all duration-500 delay-200" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Latest Trends
            </span>
            <div className="h-px w-8 bg-gray-300 transition-all duration-500 delay-200" />
          </div>
        </div>

        {/* Header Section */}
        <div
          className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-around mb-12 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-wide">
              DISCOVER LATEST
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Explore our newest arrivals and trending styles
            </p>
          </div>

          {/* Category Tabs */}
          <ul className="flex items-center justify-center gap-6 md:gap-8">
            {list.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => setValue(item)}
                  className={`
                    relative text-sm md:text-base font-medium tracking-wide text-gray-600
                    after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:bg-gray-800 after:transition-all
                    ${value === item ? "after:w-full text-gray-900" : "after:w-0"}
                    hover:after:w-full hover:text-gray-900
                    transition-colors duration-200
                  `}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Carousel Section */}
        <div
          className={`relative transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* Navigation Buttons */}
          {newProductList.length > 0 && (
            <>
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-2 sm:-translate-x-4
                         rounded-full bg-white p-2 sm:p-3 shadow-md hover:bg-gray-50 
                         transition-all duration-200 border border-gray-200 hover:scale-110"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </button>
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-2 sm:translate-x-4
                         rounded-full bg-white p-2 sm:p-3 shadow-md hover:bg-gray-50 
                         transition-all duration-200 border border-gray-200 hover:scale-110"
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
              {newProductList.map((item, index) => (
                <div
                  key={index}
                  className={`group w-[280px] sm:w-[320px] md:w-[360px] lg:w-[380px] flex-shrink-0
                           transform transition-all duration-500 hover:-translate-y-1
                           ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-[320px] sm:h-[360px] md:h-[400px] lg:h-[420px] overflow-hidden bg-gray-50">
                      <Link href={`/Customer/Product/${item.productID}`}>
                        <img
                          src={item?.images?.[0]?.url || "/placeholder.jpg"}
                          alt={item.productName || "Product image"}
                          onClick={() =>
                            router.push(`/Customer/Product/${item.productID}`)
                          }
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </Link>

                      {/* Overlay with Actions */}
                      {item.variants && item.variants.length > 0 && (
                        <div
                          className="absolute inset-x-0 bottom-0 bg-white bg-opacity-95 
                                   transform translate-y-full group-hover:translate-y-0
                                   transition-transform duration-300 ease-out
                                   p-4 border-t border-gray-100"
                        >
                          {/* Sizes */}
                          <div className="flex flex-wrap gap-2 justify-center mb-3">
                            {item.variants.map((size) => (
                              <div key={size.varientID} className="flex gap-1">
                                {size.variantValues.map((item2, index) => (
                                  <button
                                    onClick={() =>
                                      updatePrice(
                                        item.productID,
                                        size.varientID,
                                        item2.attributeID,
                                      )
                                    }
                                    key={index}
                                    className={`${
                                      item2.qty > 0 ||
                                      item.isStock === "InStock"
                                        ? `px-2.5 py-1 text-xs font-medium rounded transition-all duration-200 ${
                                            selectedAttributes[
                                              item.productID
                                            ] === item2.attributeID
                                              ? "bg-gray-900 text-white"
                                              : "text-gray-600 hover:bg-gray-100"
                                          }`
                                        : "text-gray-300"
                                    }`}
                                  >
                                    {item2.varientValue?.toUpperCase() || ""}
                                  </button>
                                ))}
                              </div>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-center gap-4">
                            {item.isStock === "InStock" && (
                              <button
                                onClick={() => {
                                  const attrId =
                                    selectedAttributes[item.productID];
                                  if (attrId) addToCart(attrId);
                                }}
                                className="px-4 py-1.5 text-xs font-medium text-gray-700 
                                       hover:text-gray-900 transition-colors duration-200
                                       border border-gray-300 rounded hover:border-gray-400 hover:bg-gray-50"
                              >
                                ADD TO BAG
                              </button>
                            )}
                            <button
                              onClick={() => {
                                const attrId =
                                  selectedAttributes[item.productID];
                                if (attrId) addToWishList(attrId);
                              }}
                              className="p-1.5 text-gray-500 hover:text-red-500 transition-colors duration-200 hover:scale-110"
                            >
                              <Heart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-base font-medium text-gray-900 mb-1 line-clamp-1">
                        {item.productName}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">
                          {productPrices[item.productID]?.toLocaleString() ||
                            item?.variants?.[0]?.variantValues?.[0]?.salePrice?.toLocaleString()}
                        </span>
                        {/* Rating */}
                        <div className="flex items-center gap-0.5">
                          <span className="text-xs text-gray-400">★</span>
                          <span className="text-xs text-gray-500">4.5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator for Mobile */}
          {newProductList.length > 3 && (
            <div className="flex justify-center gap-2 mt-6 lg:hidden">
              {newProductList.map((_, index) => (
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
  );
}
