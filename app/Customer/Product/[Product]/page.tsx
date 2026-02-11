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

export default function ProductViewManagePage() {
  const productList = [
    {
      productName: "",
      images: [
        {
          url: "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768379318/abdhqjgltd36ggrhkbes.webp",
        },
        {
          url: "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768379317/wi0zw4upirxrzil7j4ak.webp",
        },
      ],
      variants: [
        {
          variantName: "Size",
          variantValues: [
            { attributeID: "11", varientValue: "xl", salePrice: 1500, qty: 10 },
            { attributeID: "12", varientValue: "lg", salePrice: 1500, qty: 0 },
            { attributeID: "13", varientValue: "md", salePrice: 1500, qty: 10 },
            { attributeID: "14", varientValue: "sm", salePrice: 1500, qty: 0 },
          ],
        },
      ],
      discount: 10,
      description:
        "Premium quality fabric designed for everyday comfort and effortless style. Perfect for casual wear or layering year-round.",
    },
  ];
  const params = useParams();
  const [productID, setProductID] = useState("");
  const [NumberofProduct, setNumberofProduct] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomVisible, setZoomVisible] = useState(false);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const [amount, setAmount] = useState(
    productList[0].variants[0].variantValues[0].salePrice,
  );
  const [backgroundPosition, setBackgroundPosition] = useState("center");

  const [selectedAttributeID, setSelectedAttributeID] = useState(
    productList[0].variants[0].variantValues[0].attributeID,
  );

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
  useEffect(() => {
    console.log(params.Product);
    if (params && !Array.isArray(params.Product)) {
      setProductID(params?.Product || "");
    } else {
      setProductID("");
    }
  }, [params]);
  return (
    <>
      <div className="flex flex-col gap-15">
        <div>
          <Navbar scrolled={true} />
        </div>
        <div className="mt-10 flex flex-col items-center w-full min-h-[calc(100vh-200px)]  px-4 py-10">
          <h1
            style={{ fontFamily: "var(--font-playfair)" }}
            className="text-4xl font-bold text-gray-800 mb-6"
          >
            Product Information
          </h1>
          <hr className="w-1/2 border-gray-300 mb-10" />
          {/*Product Selected Information*/}
          {productList.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row justify-between gap-10 w-full max-w-6xl"
            >
              {/* === IMAGE SECTION === */}
              <div className="relative w-full md:w-1/2 flex flex-col items-center">
                {/* === MAIN IMAGE === */}
                <div
                  ref={imageRef}
                  className="relative w-full h-[400px] sm:h-[500px] md:h-[700px] overflow-hidden rounded-2xl shadow-md"
                  onMouseEnter={() =>
                    window.innerWidth >= 1024 && setZoomVisible(true)
                  }
                  onMouseLeave={() => setZoomVisible(false)}
                  onMouseMove={(e) =>
                    window.innerWidth >= 1024 && handleMouseMove(e)
                  }
                >
                  {item.images.map((src, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        index === currentIndex ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <img
                        src={src.url}
                        alt={`Product image ${index + 1}`}
                        className="object-contain rounded-2xl"
                        // priority={index === 0}
                      />
                    </div>
                  ))}

                  {/* === DOTS === */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {item.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          currentIndex === index
                            ? "bg-white scale-110 shadow-md"
                            : "bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* === THUMBNAIL PREVIEWS === */}
                <div className="flex justify-center mt-4 gap-3 flex-wrap">
                  {item.images.map((src, index) => (
                    <div
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`relative w-15 h-20 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                        currentIndex === index
                          ? "border-blue-500 shadow-md scale-105"
                          : "border-gray-200 hover:scale-105"
                      }`}
                    >
                      <img
                        src={src.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                {zoomVisible && (
                  <div
                    className="absolute top-0 left-full ml-6 w-[300px] h-[400px] rounded-xl border shadow-lg"
                    style={{
                      backgroundImage: `url(${item.images[currentIndex]})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: backgroundPosition,
                      backgroundSize: "200%", // zoom scale
                    }}
                  />
                )}
              </div>

              {/* === INFO SECTION === */}
              <div className="flex flex-col justify-center md:w-1/2 space-y-6 text-gray-800">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {item.productName}
                </h1>

                {/* Ratings */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < 4 ? "text-yellow-400" : "text-gray-300"
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
                    4.8
                  </span>
                </div>

                {/* Price Section */}
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    MRP:{" "}
                    <span className="text-gray-900">
                      Rs.{" "}
                      {Number(amount) -
                        (Number(amount) * Number(item.discount)) / 100}{" "}
                      <del className="text-gray-500 ml-2 text-base font-normal">
                        Rs. {amount}
                      </del>
                    </span>
                    <span className="ml-3 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-md font-semibold">
                      {item.discount}% OFF
                    </span>
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Inclusive of all taxes
                  </p>
                </div>

                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {item.description}
                </p>
                <div className="flex flex-col gap-3">
                  {item.variants.map((variant, index) => (
                    <div key={index}>
                      <h1 className="text-md font-bold mb-2">
                        {variant.variantName}
                      </h1>

                      <div className="flex flex-wrap gap-2">
                        {variant.variantValues.map((attr, index) => (
                          <button
                            key={attr.attributeID}
                            disabled={attr.qty === 0}
                            onClick={() => {
                              setSelectedAttributeID(attr.attributeID); // UNIQUE selection
                              setAmount(attr.salePrice);
                            }}
                            className={`
                              min-w-[40px] h-10 px-3 rounded-full text-sm font-semibold
                              border shadow-sm flex items-center justify-center
                              transition-all duration-200
                              ${
                                attr.qty === 0
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : selectedAttributeID === attr.attributeID
                                    ? "bg-gray-800 text-white border-gray-800"
                                    : "bg-white text-gray-800 hover:border-gray-500"
                              }
                            `}
                          >
                            {attr.varientValue}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between w-32 border border-gray-300 rounded-md shadow-sm bg-gray-200 px-3 py-2">
                  {NumberofProduct === 0 ? (
                    <button
                      onClick={() => setNumberofProduct(NumberofProduct)}
                      className="p-1  bg-white  shadow-sm rounded"
                    >
                      <Minus size={16} color="gray" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setNumberofProduct(NumberofProduct - 1)}
                      className="p-1  bg-white hover:bg-gray-200 shadow-sm rounded"
                    >
                      <Minus size={16} color="black" />
                    </button>
                  )}
                  <p className="text-lg font-medium">{NumberofProduct}</p>
                  <button
                    onClick={() => setNumberofProduct(NumberofProduct + 1)}
                    className="p-1 bg-white hover:bg-gray-100 shadow-sm rounded"
                  >
                    <Plus size={16} color="black" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button className="w-full md:w-3/5 bg-black border border-black-400 text-white py-3 rounded hover:bg-white hover:text-black transition-all duration-300">
                    <div
                      // onClick={() => addToCart(item.productID)}
                      className="flex justify-center items-center gap-2"
                    >
                      <ShoppingCart />
                      Add to Cart
                    </div>
                  </button>
                  <button className="w-full md:w-3/5 bg-black border border-black-400 text-white py-3 rounded hover:bg-white hover:text-black transition-all duration-300">
                    <div className="flex justify-center items-center gap-2">
                      <CreditCard />
                      <span>Buy Now</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/*Suggested For You ProductList*/}
          <SuggestedForYouProduct />
          {/*You Might Also Like This ProductList*/}
          <YouMightAlsoLike />
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
