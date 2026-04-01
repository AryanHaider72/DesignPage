"use client";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Navbar from "../../LandingPage/Navbar/page";
import Footer from "../../LandingPage/FooterSection/page";
import Link from "next/link";
import { CreditCard, Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import YouMightAlsoLike from "../YouMightAlsoLike/page";
import SuggestedForYouProduct from "../SuggestedForYouProduct/page";
import ReviewAndMessage from "../ReviewAndMesssage/page";
import { useAppContext } from "@/app/useContext";
import {
  FeaturedProductForCustomer,
  ProductApiResponseCustomer,
} from "@/api/types/Customer/LandingPage/Product/Product";
import { CartData } from "@/api/types/CookiesApi/CartItem";
import { getServerCart } from "@/api/lib/CookiesApi/GetCart/GetCart";
import { addToServerCart } from "@/api/lib/CookiesApi/AddCart/AddCart";
import ProductSearchParamByID from "@/api/lib/Customer/ProductByID/ProductByID";
import { getServerWishlist } from "@/api/lib/CookiesApi/WishList/GetWishList/GetWishList";
import { addToServerWishList } from "@/api/lib/CookiesApi/WishList/AddWishlist/AddWishlist";
import { modifyCartServer } from "@/api/lib/CookiesApi/ModifyCart/ModifCart";

interface feturedProductProps {
  onCommitChnage: () => void;
}
export default function ProductViewManagePage({
  onCommitChnage,
}: feturedProductProps) {
  const { ProductList, categoryList, storeInfo, setProductList } =
    useAppContext();
  const params = useParams();
  const [SearchProductItem, setSearchProductItem] = useState<
    FeaturedProductForCustomer[]
  >([]);
  const [SuggestedProductList, setSuggestedProductList] = useState<
    FeaturedProductForCustomer[]
  >([]);
  const [MightLikeProductList, setMightLikeProductList] = useState<
    FeaturedProductForCustomer[]
  >([]);

  const [SubCategoryID, setSubCategoryID] = useState("");

  const [NumberofProduct, setNumberofProduct] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomVisible, setZoomVisible] = useState(false);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const [amount, setAmount] = useState(
    ProductList[0]?.variants[0]?.variantValues[0]?.salePrice,
  );
  const [backgroundPosition, setBackgroundPosition] = useState("center");

  const [selectedAttributeID, setSelectedAttributeID] = useState(
    ProductList[0]?.variants[0]?.variantValues[0]?.attributeID,
  );
  const [navbarHeight, setNavbarHeight] = useState(0);

  // Get navbar height dynamically
  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, []);

  const handleMouseMove = (e: any) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect(); // get image position and size

    // Calculate mouse position percentage inside the image
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp the values between 0 and 100
    const posX = Math.min(Math.max(x, 0), 100);
    const posY = Math.min(Math.max(y, 0), 100);

    // Update background position for zoomed image
    setBackgroundPosition(`${posX}% ${posY}%`);
  };

  const searchProduct = async (ID: string) => {
    try {
      const response = await ProductSearchParamByID(ID);
      if (response.status === 200 || response.status === 201) {
        const data = response.data as ProductApiResponseCustomer;
        setSearchProductItem(data.productList);
        setSubCategoryID(data.productList[0].subCategoryDetailID);
        setAmount(
          data.productList[0]?.variants[0]?.variantValues[0]?.salePrice,
        );
        setSelectedAttributeID(
          data.productList[0]?.variants[0]?.variantValues[0]?.attributeID,
        );
      }
    } finally {
    }
  };
  useEffect(() => {
    if (params && !Array.isArray(params.Product)) {
      searchProduct(params?.Product || "");
    }
  }, [params]);

  useEffect(() => {
    const data = ProductList.filter(
      (item) => item.subCategoryDetailID === SubCategoryID,
    );
    if (data) {
      console.log("Date: ", data);
      setSuggestedProductList(data);
    }
    const newData = ProductList.filter(
      (item) => item.subCategoryDetailID !== SubCategoryID,
    );
    if (newData) {
      console.log("NewDate: ", newData);
      setMightLikeProductList(newData);
    }
  }, [SubCategoryID, ProductList, params]);

  const addToCart = async (ID: string) => {
    const newItem: CartData = {
      attributeID: ID,
      qty: NumberofProduct > 0 ? NumberofProduct : 1,
    };
    const currentCart = (await getServerCart()) as CartData[];
    const data = currentCart.find((item) => item.attributeID === ID);
    if (data) {
      await modifyCartServer(
        String(data.attributeID),
        Number(NumberofProduct || data.qty + 1),
      );
    } else {
      const existingProductIDs = new Set(ProductList.map((p) => p.productID));
      const newProducts = SearchProductItem.filter(
        (product) => !existingProductIDs.has(product.productID),
      );
      if (newProducts.length > 0) {
        setProductList((prev) => [...prev, ...newProducts]);
      }
      const updatedCart = [...currentCart, newItem];

      await addToServerCart(updatedCart);
      onCommitChnage();
    }
  };

  const addToWishList = async (ID: string) => {
    console.log(ProductList);
    const newItem: CartData = {
      attributeID: ID,
      qty: NumberofProduct > 0 ? NumberofProduct : 1,
    };
    const currentCart = await getServerWishlist();
    const existingProductIDs = new Set(ProductList.map((p) => p.productID));
    const newProducts = SearchProductItem.filter(
      (product) => !existingProductIDs.has(product.productID),
    );
    if (newProducts.length > 0) {
      setProductList((prev) => [...prev, ...newProducts]);
    }
    const updatedCart = [...currentCart, newItem];
    await addToServerWishList(updatedCart);
    onCommitChnage();
  };

  const checkout = (ID: string) => {
    const data = [
      {
        attributeID: ID,
        qty: NumberofProduct > 0 ? NumberofProduct : 1,
      },
    ];
    localStorage.setItem("checkoutItems", JSON.stringify(data));
    window.location.href = "/Customer/Checkout";
  };
  return (
    <>
      <div className="flex flex-col gap-15">
        <div>
          <Navbar
            scrolled={true}
            categoryList={categoryList}
            logoUrl={storeInfo[0]?.logoUrl}
            productList={[]}
            onCommit={() => onCommitChnage}
          />
        </div>
        <div
          className="flex flex-col items-center w-full min-h-[calc(100vh-200px)] px-4 py-10"
          style={{ paddingTop: `${navbarHeight + 50}px` }}
        >
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2">
                <div className="h-px w-8 bg-gray-300" />
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Product Information
                </span>
                <div className="h-px w-8 bg-gray-300" />
              </div>
            </div>
            <h2
              className="text-3xl md:text-4xl font-light text-gray-900 mb-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Product Overview
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm flex items-center justify-center gap-2">
              Click any product to view complete details, specifications, and
              available options
            </p>
          </div>
          <hr className="w-1/2 border-gray-300 mb-10" />
          {/*Product Selected Information*/}
          {SearchProductItem.map((item, productIndex) => (
            <div
              key={productIndex}
              className="flex flex-col lg:flex-row justify-between gap-8 w-full max-w-7xl mx-auto px-4"
            >
              {/* === IMAGE SECTION - FULL WIDTH ON MOBILE === */}
              <div className="w-full lg:w-1/2 flex flex-col items-center">
                {/* === MAIN IMAGE === */}
                <div
                  ref={imageRef}
                  className="relative w-full aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-2xl shadow-md bg-gray-100"
                  onMouseEnter={() =>
                    window.innerWidth >= 1024 && setZoomVisible(true)
                  }
                  onMouseLeave={() => setZoomVisible(false)}
                  onMouseMove={(e) =>
                    window.innerWidth >= 1024 && handleMouseMove(e)
                  }
                >
                  {/* Images Container */}
                  <div className="relative w-full h-full">
                    {item.images?.map((src, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          index === currentIndex
                            ? "opacity-100 z-10"
                            : "opacity-0 z-0"
                        }`}
                      >
                        <img
                          src={src?.url || "/placeholder.jpg"}
                          alt={`${item?.productName || "Product"} - Image ${index + 1}`}
                          className="w-full h-full object-contain bg-gray-50"
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Navigation Dots */}
                  {item.images?.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                      {item.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            currentIndex === index
                              ? "bg-white w-4 shadow-md"
                              : "bg-gray-400 hover:bg-gray-300"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* === THUMBNAIL PREVIEWS === */}
                {item.images?.length > 1 && (
                  <div className="flex justify-center mt-4 gap-2 sm:gap-3 flex-wrap">
                    {item.images.map((src, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          currentIndex === index
                            ? "border-blue-500 shadow-md scale-105"
                            : "border-gray-200 hover:border-gray-400 hover:scale-105"
                        }`}
                        aria-label={`View thumbnail ${index + 1}`}
                      >
                        <img
                          src={src?.url}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Zoom Preview */}
                {zoomVisible && item.images?.[0]?.url && (
                  <div
                    className="hidden lg:block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-xl shadow-2xl z-50 bg-white border"
                    style={{
                      backgroundImage: `url(${item.images[currentIndex]?.url})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: backgroundPosition,
                      backgroundSize: "200%",
                    }}
                  />
                )}
              </div>

              {/* === INFO SECTION === */}
              <div className="flex flex-col w-full lg:w-1/2 space-y-6 text-gray-800">
                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  {item?.productName}
                </h1>

                {/* Ratings */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(4)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    ))}
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                    {4.8}
                  </span>
                </div>

                {/* Price Section */}
                <div className="space-y-1">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    <span className="text-gray-900">
                      Rs.{" "}
                      {(
                        Number(amount) -
                        (Number(amount) * Number(item?.discount || 0)) / 100
                      ).toLocaleString()}
                    </span>
                    {item?.discount > 0 && (
                      <>
                        <del className="text-gray-500 ml-2 text-base font-normal">
                          Rs. {Number(amount)?.toLocaleString()}
                        </del>
                        <span className="ml-3 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-md font-semibold">
                          {item?.discount}% OFF
                        </span>
                      </>
                    )}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Inclusive of all taxes
                  </p>
                </div>

                {/* Description */}
                {item?.description && (
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {item?.description}
                  </p>
                )}

                {/* Variants Section */}
                {item?.variants?.length > 0 && (
                  <div className="space-y-4">
                    {item.variants.map((variant, index) => (
                      <div key={variant.varientID}>
                        <h3 className="text-md font-bold mb-2">
                          {variant?.variantName}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {variant?.variantValues?.map((attr) => (
                            <button
                              key={attr.attributeID}
                              disabled={attr.qty === 0}
                              onClick={() => {
                                setSelectedAttributeID(attr?.attributeID);
                                setAmount(attr?.salePrice);
                              }}
                              className={`
                      min-w-[40px] h-10 px-3 rounded-full text-sm font-semibold
                      border shadow-sm flex items-center justify-center
                      transition-all duration-200
                      ${
                        attr?.qty === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                          : selectedAttributeID === attr?.attributeID
                            ? "bg-gray-800 text-white border-gray-800"
                            : "bg-white text-gray-800 border-gray-300 hover:border-gray-500 hover:shadow"
                      }
                    `}
                            >
                              {attr?.varientValue}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="flex items-center justify-between w-32 border border-gray-300 rounded-md shadow-sm bg-gray-50 px-3 py-2">
                  <button
                    onClick={() =>
                      setNumberofProduct(Math.max(0, NumberofProduct - 1))
                    }
                    className="p-1 bg-white hover:bg-gray-100 rounded shadow-sm transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus
                      size={16}
                      color={NumberofProduct === 0 ? "gray" : "black"}
                    />
                  </button>
                  <span className="text-lg font-medium min-w-[24px] text-center">
                    {NumberofProduct}
                  </span>
                  <button
                    onClick={() => setNumberofProduct(NumberofProduct + 1)}
                    className="p-1 bg-white hover:bg-gray-100 rounded shadow-sm transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} color="black" />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {item.isStock === "InStock" && (
                    <button
                      onClick={() => addToCart(selectedAttributeID)}
                      className="flex-1 bg-black border border-black text-white py-3 rounded-lg hover:bg-white hover:text-black transition-all duration-300 font-medium"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <ShoppingCart size={18} />
                        Add to Cart
                      </div>
                    </button>
                  )}

                  <button
                    onClick={() => addToWishList(selectedAttributeID)}
                    className="flex-1 bg-black border border-black text-white py-3 rounded-lg hover:bg-white hover:text-black transition-all duration-300 font-medium"
                  >
                    <div className="flex justify-center items-center gap-2">
                      <Heart size={18} />
                      Wishlist
                    </div>
                  </button>

                  {item.isStock === "InStock" && (
                    <button
                      onClick={() => checkout(selectedAttributeID)}
                      className="flex-1 bg-black border border-black text-white py-3 rounded-lg hover:bg-white hover:text-black transition-all duration-300 font-medium"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <CreditCard size={18} />
                        Buy Now
                      </div>
                    </button>
                  )}
                </div>

                {/* Stock Status */}
                {item.isStock !== "InStock" && (
                  <div className="text-red-500 text-sm font-medium text-center">
                    Out of Stock
                  </div>
                )}
              </div>
            </div>
          ))}

          {/*Suggested For You ProductList*/}
          <SuggestedForYouProduct SuggestedProduct={SuggestedProductList} />
          {/*You Might Also Like This ProductList*/}
          <YouMightAlsoLike MightLikeProduct={MightLikeProductList} />
          {/*Review AND Message Secrtion*/}
          <ReviewAndMessage />
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
}
