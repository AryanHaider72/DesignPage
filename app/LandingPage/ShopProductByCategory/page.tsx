import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useRef } from "react";
export default function ShopByProductCategory({ value }: { value: string }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({
      left: -400,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({
      left: 400,
      behavior: "smooth",
    });
  };
  const itemList = [
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768383054/bcrg0urlkzew0fvhnph1.jpg",
      productName: "Weist Coat",
      price: 2500,
      subList: ["xl", "md", "lg", "sm"],
      description:
        "Premium quality fabric designed for everyday comfort and effortless style. Perfect for casual wear or layering year-round.",
    },
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768380240/qrbuoqyzo3lhnxniipty.webp",
      productName: "Stitched",
      price: 5000,
      subList: ["xl", "md", "lg", "sm"],
      description:
        "A modern essential crafted with attention to detail. Designed to elevate your everyday look with comfort and confidence.",
    },
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1770438914/yins9corvpzgzdysqisl.jpg",
      productName: "Unsticted",
      price: 1500,
      subList: [],
      description:
        "Premium quality fabric designed for everyday comfort and effortless style. Perfect for casual wear or layering year-round.",
    },
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768379198/dfyyrgq7hok6qm3q0mxz.webp",
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
    <div className="mt-10 mb-10">
      <h1 className="px-10 mb-5 text-3xl font-extralight text-center sm:text-left">
        Shop By {value}
      </h1>

      {/* Carousel */}
      <div className="relative">
        {/* Left Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2
                   rounded-full bg-white p-3 shadow-md
                   hover:bg-gray-100"
        >
          <ChevronLeft />
        </button>

        {/* Right Button */}
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2
                   rounded-full bg-white p-3 shadow-md
                   hover:bg-gray-100"
        >
          <ChevronRight />
        </button>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide"
        >
          {itemList.map((item, index) => (
            <div
              key={index}
              className="group snap-start min-w-[280px] sm:min-w-[420px] lg:min-w-[450px]
                 bg-white rounded-xl border border-gray-200 overflow-hidden
                 flex flex-col cursor-pointer transition-shadow duration-300 hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative h-[500px] overflow-hidden">
                <img
                  src={item.images}
                  alt={item.productName}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Sublist + Add to Bag Overlay */}
                {item.subList && item.subList.length > 0 && (
                  <div
                    className="absolute w-full bottom-0 left-1/2 transform -translate-x-1/2
                       w-4/5 bg-white bg-opacity-90 opacity-0 group-hover:opacity-80
                       flex flex-col items-center justify-center gap-2
                       p-3  transition-opacity duration-300"
                  >
                    {/* Sizes */}
                    <div className="flex gap-2">
                      {item.subList.map((size, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-800 cursor-pointer transition-colors duration-200"
                        >
                          {size.toUpperCase()}
                        </span>
                      ))}
                    </div>

                    {/* Add to Bag */}
                    <div className="flex gap-20">
                      <button className="mt-2 ml-10 px-4 py-1  text-[18px] text-gray-700 text-sm font-semibold rounded hover:text-black transition-colors duration-200">
                        ADD TO BAG
                      </button>
                      <button className="mt-2 px-4 py-1  text-[30px] text-black text-sm font-semibold rounded hover:text-red-500 transition-colors duration-200">
                        <Heart />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {item.productName}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-2">
                  {item.description}
                </p>

                <span className="mt-2 text-lg font-semibold text-gray-900">
                  {item.price.toLocaleString()}-/
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
