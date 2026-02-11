import { Heart } from "lucide-react";
import Link from "next/link";

export default function SuggestedForYouProduct() {
  const SuggestedProductList = [
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
  ];
  return (
    <>
      <div className="w-full max-w-7xl mx-auto mt-16 px-4">
        <h2
          style={{ fontFamily: "var(--font-playfair)" }}
          className="text-4xl  flex justify-start font-semibold text-gray-900 mb-3 text-center"
        >
          Suggested For You
        </h2>
        {/* <hr className="w-1/2 mb-3 text-gray-400" /> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {SuggestedProductList.map((item, index) => (
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
    </>
  );
}
