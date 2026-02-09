import { useState } from "react";

export default function FeaturedProducts() {
  const list = ["Men", "Women", "Child", "Teen Boys", "Teen Girls"];
  const [value, setValue] = useState("Men");

  const itemList = [
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768383054/bcrg0urlkzew0fvhnph1.jpg",
      productName: "Weist Coat",
    },
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768380240/qrbuoqyzo3lhnxniipty.webp",
      productName: "Stitched",
    },
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1770438914/yins9corvpzgzdysqisl.jpg",
      productName: "Unsticted",
    },
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768380236/xftbs9aqjiskjswfxctv.webp",
      productName: "Shalwar Kameez",
    },
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768379317/wi0zw4upirxrzil7j4ak.webp",
      productName: "Sweaters",
    },
  ];
  return (
    <>
      <div className="mt-3">
        <h1
          className="text-sm text-center font-extralight"
          style={{ wordSpacing: "0.1rem" }}
        >
          DISCOVER OUR MOST POPULAR PICKS
        </h1>
        <div className="mt-2 mb-2 flex justify-center item-center w-full">
          <ul className="flex items-center gap-10 font-medium">
            {list.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  onClick={(e) => setValue(item)}
                  className="font-raleway tracking-wide relative text-xl text-black transition hover:text-black after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-black after:transition-all hover:after:w-full "
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full flex items-center justify-around gap-8">
          {/* Text Section */}
          <div className="flex flex-col max-w-xs">
            <h1 className="text-3xl font-extralight mb-3 text-center sm:text-left">
              Latest {value} Collection.
            </h1>
            <p className="text-gray-600 text-center sm:text-left text-base leading-relaxed">
              Explore our newest arrivals, featuring cutting-edge designs and
              top-quality materials to elevate your style and everyday life.
            </p>
            <a
              href=""
              className=" text-gray-800 font-extralight text-2xl underline hover:text-gray-900 "
            >
              Shop Now
            </a>
          </div>

          {/* Horizontal Scroll Product Cards */}
          <div
            className="flex space-x-6 overflow-x-auto py-2 max-w-[75%] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
            style={{
              scrollbarWidth: "thin", // Firefox
              scrollbarColor: "#9ca3af #e5e7eb", // thumb track for Firefox
            }}
          >
            {itemList.map((item) => (
              <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col cursor-pointer transition-shadow duration-300 hover:shadow-lg min-w-[450px] max-w-[350px] flex-shrink-0">
                <a
                  href={``}
                  className="block w-full aspect-square h-[500px] overflow-hidden rounded-t-lg"
                >
                  <img
                    src={item.images || "/placeholder.png"}
                    alt={item.productName}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                </a>

                <div className="p-1 flex flex-col flex-1 justify-center text-center">
                  <h3 className="text-lg  text-gray-900 ">
                    {item.productName}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
