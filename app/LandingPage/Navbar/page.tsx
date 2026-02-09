"use client";
import CartItems from "@/app/UsefullComponent/CartSidebar/page";
import { Heart, Search, ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const list = ["Men", "Women", "Child", "Teen Boys", "Teen Girls"];
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartShow, setCartShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top promo bar */}
      <div
        className="fixed top-0 z-90 flex w-full items-center justify-center"
        style={{ backgroundColor: "rgb(37, 37, 37)" }}
      >
        <p className="text-sm text-white font-thin p-2">
          Light Layers, Bold Statements – Summer Collection Just Dropped.
          <span className="font-bold underline ml-1 cursor-pointer">
            Shop Now
          </span>
        </p>
      </div>

      {/* Navbar */}
      <nav
        className={`fixed top-[30px] z-50 w-full transition-all duration-300 backdrop-blur-md
          ${scrolled ? "bg-white shadow-md" : "bg-transparent"}
        `}
      >
        <div className="mx-auto flex items-center justify-between px-4 py-7">
          {/* LEFT */}
          <div className="hidden md:flex">
            <ul className="flex items-center gap-8 font-medium">
              {list.map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className={`font-raleway tracking-wide relative text-md transition
                      ${scrolled ? "text-black" : "text-white"}
                      after:absolute after:-bottom-1 after:left-0 after:h-[2px]
                      after:w-0 after:bg-current after:transition-all hover:after:w-full
                    `}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CENTER */}
          <div>
            <a href="/" className="flex items-center gap-2">
              <img src="/logo.png" className="h-10" alt="Logo" />
            </a>
          </div>

          {/* RIGHT */}
          <div
            className={`flex items-center gap-2 transition-colors
              ${scrolled ? "text-black" : "text-white"}
            `}
          >
            <button
              className={`relative rounded-full p-2  ${scrolled ? "hover:bg-gray-100" : "hover:bg-gray-900"}`}
            >
              <Search size={20} />
            </button>

            <button
              className={`relative rounded-full p-2  ${scrolled ? "hover:bg-gray-100" : "hover:bg-gray-900"}`}
            >
              <Heart size={20} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                2
              </span>
            </button>

            <button
              onClick={() => setCartShow(true)}
              className={`relative rounded-full p-2  ${scrolled ? "hover:bg-gray-100" : "hover:bg-gray-900"}`}
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                3
              </span>
            </button>

            <button
              className={`relative rounded-full p-2  ${scrolled ? "hover:bg-gray-100" : "hover:bg-gray-900"}`}
            >
              <User size={20} />
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-1 rounded-full p-2 md:hidden hover:bg-gray-100"
            >
              ☰
            </button>
          </div>
        </div>
      </nav>
      {cartShow && (
        <div className="fixed inset-0 z-100 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gradient-to-b from-black/50 to-black/20"
            onClick={() => setCartShow(false)}
          ></div>

          {/* Sidebar */}
          <div className="relative ml-auto w-150 max-w-full bg-white shadow-xl h-full p-4 overflow-y-auto transition-transform duration-300">
            <button
              onClick={() => setCartShow(false)}
              className="absolute text-2xl p-2 top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <CartItems />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed top-[90px] z-80 left-0 w-full bg-white shadow-md p-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {list.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  className="font-raleway tracking-wide text-lg text-black hover:text-gray-600"
                  onClick={() => setIsMenuOpen(false)} // Close menu on item click
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
