"use client";
import { useState } from "react";

import { Trash2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import Footer from "../LandingPage/FooterSection/page";
import Navbar from "../LandingPage/Navbar/page";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [activePage, setActivePage] = useState("login");
  const router = useRouter();
  const wishlist = [
    {
      id: 1,
      name: "Chic Mini Dress",
      image:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768383056/aihoosp7suvhzxyhgyqy.webp",
      price: 9000,
      originalPrice: 10000,
      availability: "In Stock",
    },
    {
      id: 2,
      name: "Stripped Bodycon Dress",
      image:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768380152/uhasiygte64batlkoafh.jpg",
      price: 8000,
      originalPrice: 12000,
      availability: "In Stock",
    },
  ];
  return (
    <>
      <Navbar scrolled={true} />
      {/* MAIN CONTENT */}
      <div className="flex flex-col items-center w-full min-h-[calc(100vh-200px)] px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 ">
          Wishlist / Liked Products
        </h1>
        <hr className="w-1/2 border-gray-300 mt-6 mb-10" />
        <div className="w-full flex justify-center  py-12 px-4">
          <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md overflow-hidden">
            {/* --- Desktop Table --- */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs uppercase bg-gray-100 text-gray-600 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Availability</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {wishlist.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={100}
                          className="rounded-lg object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {item.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600 font-bold text-lg">
                          Rs:{item.price.toLocaleString()}
                        </span>
                        <span className="text-gray-400 line-through text-sm ml-2">
                          Rs:{item.originalPrice.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-green-600 font-medium">
                        {item.availability}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            className="p-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 shadow-sm transition-all duration-200"
                            title="Remove"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            className="p-2.5 rounded-full bg-gray-900 hover:bg-gray-800 text-white shadow-sm transition-all duration-200"
                            title="Add to Cart"
                          >
                            <ShoppingCart size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* --- Mobile Cards --- */}
            <div className="block md:hidden p-4 space-y-4">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={100}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">
                        {item.name}
                      </h3>
                      <p className="text-orange-600 font-bold text-sm mt-1">
                        Rs:{item.price.toLocaleString()}
                        <span className="text-gray-400 line-through text-xs ml-2">
                          Rs:{item.originalPrice.toLocaleString()}
                        </span>
                      </p>
                      <p className="text-green-600 text-xs mt-1">
                        {item.availability}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end sm:flex-col gap-3 mt-4 sm:mt-0">
                    <button className="flex items-center justify-center p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition">
                      <Trash2 size={16} />
                    </button>
                    <button className="flex items-center justify-center p-2 bg-black hover:bg-gray-800 text-white rounded-md transition">
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
