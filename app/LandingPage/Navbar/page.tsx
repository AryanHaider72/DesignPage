import { Heart, Search, ShoppingCart, User } from "lucide-react";

export default function Navbar() {
  const list = ["Men", "Women", "Child", "Teen Boys", "Teen Girls"];
  return (
    <>
      <div
        className="fixed top-0 z-60 flex w-full items-center justify-center"
        style={{ backgroundColor: "rgb(37, 37, 37)" }}
      >
        <p className="text-sm text-white font-thin p-2">
          Light Layers, Bold Statements – Summer Collection Just Dropped.
          <span className="font-bold underline ml-1 cursor-pointer">
            Shop Now
          </span>
        </p>
      </div>
      <nav className="group fixed top-[30px] z-50 p-3 w-full bg-neutral-primary  transition-colors duration-300 backdrop-blur-md">
        <div className="mx-auto flex items-center justify-between px-4 py-3">
          {/* LEFT: Menu */}
          <div className="hidden md:flex">
            <ul className="flex items-center gap-8 font-medium">
              {list.map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="font-raleway tracking-wide relative text-md text-white transition hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all hover:after:w-full "
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CENTER: Logo */}
          <div>
            <a
              href="/"
              className="flex items-center gap-2 text-xl font-semibold text-gray-900 "
            >
              <img src="/logo.png" className="h-15" alt="Logo" />
            </a>
          </div>

          {/* RIGHT: Icons */}
          <div className="flex items-center gap-2 text-white ">
            {/* Search */}
            <button className="rounded-full p-2 text-inherit transition hover:bg-gray-100 hover:text-black">
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <button className="relative rounded-full p-2 text-inherit transition hover:bg-gray-100 hover:text-black">
              <Heart size={20} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                2
              </span>
            </button>

            {/* Cart */}
            <button className="relative rounded-full p-2 text-inherit transition hover:bg-gray-100 hover:text-black">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                3
              </span>
            </button>

            {/* User */}
            <button className="rounded-full p-2 text-inherit transition hover:bg-gray-100 hover:text-black">
              <User size={20} />
            </button>

            {/* Mobile Menu Button */}
            <button className="ml-1 rounded-full p-2 text-gray-700 hover:bg-gray-100 md:hidden">
              ☰
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
