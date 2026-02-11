"use client";
import CartItems from "@/app/UsefullComponent/CartSidebar/page";
import SearchSidebarCompnent from "@/app/UsefullComponent/SearchComponent/page";
import { Heart, Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar({ scrolled }: { scrolled: boolean }) {
  const list = ["Men", "Women", "Children", "Teen Boys"];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartShow, setCartShow] = useState(false);
  const [SearchShow, setSearchShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (cartShow) {
      // Mount immediately
      setMounted(true);

      // Animate in next frame
      requestAnimationFrame(() => {
        setAnimate(true);
      });
    } else {
      // Animate out
      setAnimate(false);

      // Unmount AFTER animation
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartShow]);

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
        <div className="mx-auto flex items-center justify-around px-4 py-7">
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
              onClick={() => setSearchShow(true)}
              className={`relative rounded-full p-2  ${scrolled ? "hover:bg-gray-100" : "hover:bg-gray-900"}`}
            >
              <Search size={20} />
            </button>

            <Link
              href={"/Customer/Wishlist"}
              className={`relative rounded-full p-2  ${scrolled ? "hover:bg-gray-100" : "hover:bg-gray-900"}`}
            >
              <Heart size={20} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                2
              </span>
            </Link>

            <button
              onClick={() => setCartShow(true)}
              className={`relative rounded-full p-2  ${scrolled ? "hover:bg-gray-100" : "hover:bg-gray-900"}`}
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                3
              </span>
            </button>

            <Link
              href={"/Customer/login"}
              className={`relative rounded-full p-2  ${scrolled ? "hover:bg-gray-100" : "hover:bg-gray-900"}`}
            >
              <User size={20} />
            </Link>

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
      {mounted && (
        <div
          className={`fixed inset-0 z-[100] transition-opacity duration-300 ease-out
            ${animate ? "opacity-100" : "opacity-0"}
          `}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setCartShow(false)}
          />

          {/* Sidebar */}
          <div
            className={`absolute right-0 top-0 h-full w-[500px] max-w-full bg-white shadow-xl p-4 overflow-y-auto
            transform transition-transform duration-300 ease-out will-change-transform
            ${animate ? "translate-x-0" : "translate-x-full"}
          `}
          >
            <button
              onClick={() => setCartShow(false)}
              className="absolute top-2 right-2 text-2xl p-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <CartItems />
          </div>
        </div>
      )}
      {SearchShow && (
        <div
          className={`fixed inset-0 z-[100] transition-opacity duration-300 ease-out
            
          `}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSearchShow(false)}
          />

          {/* Sidebar */}
          <div
            className={`absolute right-0 top-0 h-full w-[500px] max-w-full bg-white shadow-xl p-4 overflow-y-auto
            transform transition-transform duration-300 ease-out will-change-transform
            
          `}
          >
            <button
              onClick={() => setSearchShow(false)}
              className="absolute top-2 right-2 text-2xl p-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <SearchSidebarCompnent />
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
