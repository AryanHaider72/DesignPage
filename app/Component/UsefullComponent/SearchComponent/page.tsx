export default function SearchSidebarCompnent() {
  const item = [
    "Mehndi Collection",
    "Party Designs",
    "Casual Dress",
    "Formal Dress",
  ];
  const items = [
    {
      name: "Product1 ",
      price: 2000,
      instock: true,
      varient: "lg",
      image:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768383056/aihoosp7suvhzxyhgyqy.webp",
    },
    {
      name: "Product2",
      price: 3000,
      instock: false,
      varient: "sm",
      image:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768380152/uhasiygte64batlkoafh.jpg",
    },
    {
      name: "Product3 ",
      price: 2000,
      instock: true,
      varient: "lg",
      image:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768380240/qrbuoqyzo3lhnxniipty.webp",
    },
    {
      name: "Product4",
      price: 3000,
      instock: false,
      varient: "sm",
      image:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768378939/p1iyljvgzhdbtpddntt3.webp",
    },
  ];
  return (
    <>
      <div className="w-full p-5 flex flex-col h-full overflow-y-auto scrollbar-hide">
        {/* Header */}
        <h1 className="text-2xl mb-2 font-bold text-gray-800 ">SEARCH ITEM</h1>
        <hr className="border-gray-300 mb-2" />
        <div className="flex flex-col gap-5">
          <div className="relative w-full max-w-md">
            {/* Glow on hover */}
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-500/40 to-purple-500/40 opacity-0 blur-lg transition duration-300 group-hover:opacity-100"></div>

            <div className="group relative">
              {/* Input */}
              <input
                type="text"
                placeholder="Search Products"
                className="w-full rounded-xl  bg-white/10 backdrop-blur-md px-4 py-3 pr-12
              text-gray-800 placeholder-gray-500 border border-gray-200
              outline-none transition-all duration-300
              focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
              />

              {/* End glass hover */}
              <div
                className="pointer-events-none absolute inset-y-1 right-1 w-10 rounded-lg
              bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-md
              opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
              transition-all duration-300"
              />

              {/* Search icon */}
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                />
              </svg>
            </div>
          </div>
          <div className="">
            <h1 className="text-xl mb-2 font-bold text-gray-800">
              Suggested For You
            </h1>
            <div className="flex flex-col gap-2 ">
              {item.map((item2) => (
                <p className="text-gray-500 hover:text-gray-900 cursor-pointer">
                  {item2}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-6 mb-6">
            <h1 className="text-xl mb-4 font-semibold text-gray-800">
              You Might Also Like
            </h1>

            <div className="grid grid-cols-2 gap-4">
              {items.map((item2, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden 
                  hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  {/* Image */}
                  <div className="w-full h-70  flex items-center justify-center">
                    <img
                      src={item2.image}
                      alt={item2.name}
                      className="object-cover w-full h-full p-2"
                    />
                  </div>

                  {/* Info */}
                  <div className="px-3">
                    <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">
                      {item2.name.toLocaleUpperCase()}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Rs:{item2.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
