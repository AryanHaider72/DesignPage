"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../LandingPage/Navbar/page";
import Footer from "../../LandingPage/FooterSection/page";
import { ChevronDown, FilterIcon, Heart, X } from "lucide-react";
import FilterComponent from "@/app/UsefullComponent/FilterComponent/page";
import Link from "next/link";

export default function ShopItems() {
  const param = useParams();
  const [categoryID, setCategoryID] = useState("");
  const [Filter, setFilters] = useState(false);
  const [sortType, setSortType] = useState<string | null>(null);
  const [Open, setOpen] = useState(false);

  const itemList = [
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768379198/dfyyrgq7hok6qm3q0mxz.webp",
      productName: "Weist Coat",
      price: 2500,
      subList: ["xl", "md", "lg", "sm"],
      description:
        "Premium quality fabric designed for everyday comfort and effortless style. Perfect for casual wear or layering year-round.",
    },
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768378939/p1iyljvgzhdbtpddntt3.webp",
      productName: "Stitched",
      price: 5000,
      subList: ["xl", "md", "lg", "sm"],
      description:
        "A modern essential crafted with attention to detail. Designed to elevate your everyday look with comfort and confidence.",
    },
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768378839/rzsrh8yburloiygdyrgy.jpg",
      productName: "Unsticted",
      price: 1500,
      subList: [],
      description:
        "Premium quality fabric designed for everyday comfort and effortless style. Perfect for casual wear or layering year-round.",
    },
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768380236/xftbs9aqjiskjswfxctv.webp",
      productName: "Shalwar Kameez",
      subList: ["xl", "md", "lg", "sm"],
      price: 10000,
      description:
        "A modern essential crafted with attention to detail. Designed to elevate your everyday look with comfort and confidence.",
    },
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768379317/wi0zw4upirxrzil7j4ak.webp",
      productName: "Sweaters",
      price: 10000,
      description:
        "A modern essential crafted with attention to detail. Designed to elevate your everyday look with comfort and confidence.",
    },
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768379318/abdhqjgltd36ggrhkbes.webp",
      productName: "NewDress1",
      price: 10000,
      description:
        "A modern essential crafted with attention to detail. Designed to elevate your everyday look with comfort and confidence.",
    },
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768379317/wi0zw4upirxrzil7j4ak.webp",
      productName: "NewDress2",
      price: 10000,
      description:
        "A modern essential crafted with attention to detail. Designed to elevate your everyday look with comfort and confidence.",
    },
  ];

  const handleSort = (type: string) => {
    setSortType(type);
    setOpen(false);
  };
  useEffect(() => {
    console.log(param.Shop);
    if (param && !Array.isArray(param.Shop)) {
      setCategoryID(param?.Shop || "");
    }
  }, [param]);
  return (
    <>
      <div className="flex flex-col justify-between gap-15">
        <div>
          <Navbar scrolled={true} />
        </div>
        <div>
          <div
            onClick={() => setOpen(false)}
            className="mt-10 flex flex-col items-center w-full   px-4 py-10"
          >
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                Shop Our Collection
              </h1>
              <p className="mt-3 text-gray-500 max-w-xl mx-auto">
                Discover high-quality products carefully selected for you
              </p>
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-around gap-4 mt-4 mb-6">
            {/* LEFT: Filters */}
            <div className="flex items-center gap-3">
              <button
                title="filter"
                onClick={() => setFilters(true)}
                className="
                  flex items-center justify-center gap-2
                  px-3 py-2 rounded-md font-bold
                  bg-gray-100 text-gray-700
                  hover:bg-green-50 hover:text-green-600
                  shadow-sm transition-all duration-300
                "
              >
                <FilterIcon className="w-5 h-5" />
                Filters
              </button>
            </div>
            <div className="relative inline-block z-30">
              <button
                type="button"
                onClick={() => setOpen(!Open)}
                className="
                  flex items-center justify-center gap-2
                  px-3 py-2 rounded-md font-bold
                  bg-gray-100 text-gray-700
                  hover:bg-blue-50 hover:text-blue-600
                  shadow-sm transition-all duration-300
                "
              >
                {sortType || "Sort By"}

                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    Open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {Open && (
                <div
                  className="
                      absolute right-0 mt-2 w-44 p-2
                      z-50
                      bg-white
                      border border-gray-200
                      rounded-lg shadow-xl
                    "
                >
                  <ul className="p-1 text-sm text-gray-700 font-medium ">
                    {[
                      "Price: High to Low",
                      "Price: Low to High ",
                      "Alphabetic: A-Z",
                      "Alphabetic:  Z-A",
                      // "Date: old to new",
                      // "Date: new to old",
                    ].map((item) => (
                      <li key={item}>
                        <button
                          // onClick={() => setOpen(false)}
                          onClick={() => {
                            handleSort(item);
                            setOpen(false);
                          }}
                          className="
                              w-full text-left px-3 py-2 rounded-md font-bold
                              hover:bg-gray-100 hover:text-gray-900
                              transition
                            "
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {itemList.map((item, index) => (
                <Link
                  href={`${index}`}
                  key={index}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden
                 flex flex-col cursor-pointer transition-shadow duration-300 hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative h-[400px] overflow-hidden">
                    <img
                      src={item.images}
                      alt={item.productName}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Sublist + Add to Bag Overlay */}
                    {item.subList && item.subList.length > 0 && (
                      <div
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2
                       w-full bg-white bg-opacity-90 opacity-0 group-hover:opacity-90
                       flex flex-col items-center justify-center gap-2 p-3
                       transition-opacity duration-300"
                      >
                        {/* Sizes */}
                        <div className="flex gap-2 flex-wrap justify-center">
                          {item.subList.map((size, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-800 cursor-pointer transition-colors duration-200"
                            >
                              {size.toUpperCase()}
                            </span>
                          ))}
                        </div>

                        {/* Buttons */}
                        <div className=" flex gap-4 mt-2 justify-center w-full">
                          <button className="px-4 py-1 text-sm font-semibold text-gray-700 rounded hover:text-black transition-colors duration-200">
                            ADD TO BAG
                          </button>
                          <button className="px-4 py-1 text-sm font-semibold text-red-500 rounded hover:text-red-600 transition-colors duration-200">
                            <Heart />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {item.description}
                    </p>
                    <span className="mt-2 text-lg font-semibold text-gray-900">
                      {item.price.toLocaleString()}-/
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
      {Filter && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-500"
            onClick={() => setFilters(false)}
          ></div>

          {/* Drawer */}
          <div
            className={`
                        fixed top-0 left-0 z-100 h-full 
                        bg-white shadow-xl transform transition-transform duration-500 ease-in-out
                        w-[80vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] xl:w-[25vw]
                        flex flex-col
                      `}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              <button
                title="Close"
                className="text-gray-500 hover:text-red-500 transition"
                onClick={() => setFilters(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <FilterComponent />
          </div>
        </>
      )}
    </>
  );
}
