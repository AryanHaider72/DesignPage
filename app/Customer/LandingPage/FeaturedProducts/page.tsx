"use client";
import { useEffect, useState } from "react";
import ShopByProductCategory from "../ShopProductByCategory/page";
import {
  categoryList,
  subCategory,
} from "@/api/types/Customer/LandingPage/Category/GetCategroy";
interface FetauredProductProps {
  categoryList: categoryList[];
}

export default function FeaturedProducts({
  categoryList,
}: FetauredProductProps) {
  const [value, setValue] = useState(categoryList[0]?.subCategoryName);
  const [itemData, setItemData] = useState<subCategory[]>([]);

  useEffect(() => {
    fetchData(value);
  }, [value]);

  const fetchData = (name: string) => {
    const data = categoryList.find((item) => item.subCategoryName === name);

    if (data) {
      setItemData(data.subCategory);
    }
  };
  return (
    <>
      <div className="mt-10 ">
        <div className="flex w-full flex-col gap-8 md:flex-row md:items-start md:justify-around md:gap-16">
          {/* LEFT: Heading */}
          <div className="flex flex-col items-start max-w-md">
            <h1 className="text-4xl font-bold tracking-wide">TRENDING</h1>
            <p className="mt-1 text-sm font-extralight tracking-wider text-gray-500">
              DISCOVER THE BEST-SELLING STYLES
            </p>
          </div>

          {/* RIGHT: List */}
          <ul className="flex flex-wrap items-center gap-6 md:gap-12">
            {categoryList.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    fetchData(item.subCategoryName);
                    setValue(item.subCategoryName);
                  }}
                  className={`
                  relative text-lg md:text-xl font-raleway tracking-wide text-black
                  after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-black after:transition-all
                  ${value === item.subCategoryName ? "after:w-full" : "after:w-0"}
                  hover:after:w-full
                `}
                >
                  {item.subCategoryName.toUpperCase()}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 w-full flex items-center justify-around gap-8">
          {/* Text Section */}
          <div className="flex flex-col max-w-xs">
            <h1 className="text-3xl font-extralight mb-3 text-center sm:text-left">
              Latest {value?.toLowerCase()} Collection.
            </h1>
            <p className="text-gray-600 text-center sm:text-left text-base leading-relaxed">
              Explore our newest arrivals, featuring cutting-edge designs and
              top-quality materials to elevate your style and everyday life.
            </p>
            <a
              href={`/Customer/Shop/${value}`}
              className="mt-2 text-gray-800 font-extralight text-2xl hover:underline hover:text-gray-900 "
            >
              Shop Now
            </a>
          </div>
          {/* Horizontal Scroll Product Cards */}
          <div
            className="flex space-x-6 overflow-x-auto py-2 max-w-[65%] scroll-smooth no-scrollbar"
            style={{
              scrollbarWidth: "thin", // Firefox
              scrollbarColor: "#9ca3af #e5e7eb", // thumb track for Firefox
            }}
          >
            {itemData.length > 0 ? (
              <>
                {itemData.map((item, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col cursor-pointer transition-shadow duration-300 hover:shadow-lg min-w-[450px] max-w-[350px] flex-shrink-0"
                  >
                    <a
                      href={``}
                      className="block w-full aspect-square h-[500px] overflow-hidden rounded-t-lg"
                    >
                      <img
                        src={item?.imagelist[0]?.url || "/placeholder.jpg"}
                        alt={"Placeholder Image"}
                        className="w-full h-full object-cover transition-transform duration-500"
                      />
                    </a>

                    <div className="p-1 flex flex-col flex-1 justify-center text-center">
                      <h3 className="text-lg  text-gray-900 ">{item.name}</h3>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col cursor-pointer transition-shadow duration-300 hover:shadow-lg min-w-[450px] max-w-[350px] flex-shrink-0">
                <a
                  href={``}
                  className="block w-full aspect-square h-[500px] overflow-hidden rounded-t-lg"
                >
                  <img
                    src={"/placeholder.jpg"}
                    alt={"Placeholder Image"}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                </a>

                <div className="p-1 flex flex-col flex-1 justify-center text-center">
                  <h3 className="text-lg  text-gray-900 ">N/A</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ShopByProductCategory value={value} />
    </>
  );
}
