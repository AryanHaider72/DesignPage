"use client";
import { useEffect, useState } from "react";

import { Trash2, ShoppingCart } from "lucide-react";

import Footer from "../LandingPage/FooterSection/page";
import Navbar from "../LandingPage/Navbar/page";
import { useAppContext } from "@/app/useContext";
import { getServerWishlist } from "@/api/lib/CookiesApi/WishList/GetWishList/GetWishList";
import { CartData } from "@/api/types/CookiesApi/CartItem";
import { removeItemFromServerWishList } from "@/api/lib/CookiesApi/WishList/RemoveItem/RemoveItem";
import { getServerCart } from "@/api/lib/CookiesApi/GetCart/GetCart";
import { addToServerCart } from "@/api/lib/CookiesApi/AddCart/AddCart";
interface cartItems {
  attributeID: string;
  qty: number;
}
interface GetProductFromCookies {
  productID: string;
  productName: string;
  isStock: string;
  image: string;
  attributeID: string;
  variantValue: string;
  price: number;
  qty: number;
}
interface wishListprops {
  commitChange: () => void;
}
export default function LoginPage({ commitChange }: wishListprops) {
  const { ProductList, categoryList, storeInfo } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [cartItem, setCarItem] = useState<cartItems[]>([]);
  const [productItem, setProductItem] = useState<GetProductFromCookies[]>([]);
  const [isLogin, setIsLogin] = useState(true);
  const [activePage, setActivePage] = useState("login");
  const [navbarHeight, setNavbarHeight] = useState(0);

  // Get navbar height dynamically
  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, []);

  const cartData = async () => {
    const cart = await getServerWishlist();

    setCarItem(cart);

    const items = filterItems(cart);

    setProductItem(items);
  };
  const filterItems = (cart: CartData[]) => {
    const result: any[] = [];

    cart.forEach((cartItem) => {
      ProductList.forEach((product) => {
        product.variants.forEach((variant: any) => {
          variant.variantValues.forEach((value: any) => {
            if (value.attributeID === cartItem.attributeID) {
              result.push({
                productID: product.productID,
                isStock: product.isStock,
                productName: product.productName,
                image: product.images?.[0]?.url,
                attributeID: value.attributeID,
                variantValue: value.varientValue,
                price: value.salePrice,
                qty: cartItem.qty,
              });
            }
          });
        });
      });
    });

    return result;
  };
  const deleteProduct = async (attribuetID: string) => {
    //const token = localStorage.getItem("token1");
    await removeItemFromServerWishList(attribuetID);
    setProductItem(
      productItem.filter((item) => item.attributeID !== attribuetID),
    );
    cartData();
    commitChange();
  };
  const addToCart = async (ID: string) => {
    const newItem: CartData = {
      attributeID: ID,
      qty: 1,
    };
    const currentCart = await getServerCart();
    const updatedCart = [...currentCart, newItem];
    await addToServerCart(updatedCart);
    commitChange();
  };
  useEffect(() => {
    cartData();
  }, []);
  return (
    <>
      <Navbar
        scrolled={true}
        categoryList={categoryList}
        logoUrl={storeInfo[0]?.logoUrl}
        productList={[]}
        onCommit={() => commitChange}
      />
      {/* MAIN CONTENT */}
      <div
        className="flex flex-col items-center w-full min-h-[calc(100vh-200px)] px-4 py-10"
        style={{ paddingTop: `${navbarHeight + 50}px` }}
      >
        <div className="inline-block mb-4">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-gray-300" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              WishList Items
            </span>
            <div className="h-px w-8 bg-gray-300" />
          </div>
        </div>
        <h2
          className="text-3xl md:text-4xl font-light text-gray-900 mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Wishlist / Liked Products
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm">
          Experience the difference with our premium services and unwavering
          commitment to excellence
        </p>
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
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {productItem.map((item) => (
                    <tr
                      key={item.attributeID}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={item.image || "/placeholder.jpg"}
                          width={80}
                          height={100}
                          className="rounded-lg object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {item.productName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600 font-bold text-lg">
                          Rs:{item.price.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.isStock === "InStock" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                            {/* <span className="w-2 h-2 bg-red-500 rounded-full"></span> */}
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => deleteProduct(item.attributeID)}
                            className="p-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 shadow-sm transition-all duration-200"
                            title="Remove"
                          >
                            <Trash2 size={18} />
                          </button>
                          {item.isStock === "InStock" && (
                            <button
                              onClick={() => addToCart(item.attributeID)}
                              className="p-2.5 rounded-full bg-gray-900 hover:bg-gray-800 text-white shadow-sm transition-all duration-200"
                              title="Add to Cart"
                            >
                              <ShoppingCart size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* --- Mobile Cards --- */}
            <div className="block md:hidden p-4 space-y-4">
              {productItem.map((item) => (
                <div
                  key={item.attributeID}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image || "/placeholder.jpg"}
                      alt={item.productName}
                      width={80}
                      height={100}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">
                        {item.productName}
                      </h3>
                      <p className="text-orange-600 font-bold text-sm mt-1">
                        Rs:{item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end sm:flex-col gap-3 mt-4 sm:mt-0">
                    <button
                      onClick={() => deleteProduct(item.attributeID)}
                      className="flex items-center justify-center p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition"
                    >
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
