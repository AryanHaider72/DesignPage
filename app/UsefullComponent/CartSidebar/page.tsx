import { getServerCart } from "@/api/lib/CookiesApi/GetCart/GetCart";
import { removeItemFromServerCart } from "@/api/lib/CookiesApi/RemoveCart/RemoveCart";
import { CartData } from "@/api/types/CookiesApi/CartItem";
import { FeaturedProductForCustomer } from "@/api/types/Customer/LandingPage/Product/Product";
import {
  CreditCard,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
interface cartItems {
  attributeID: string;
  qty: number;
}
interface CartItemprops {
  commitChange: () => void;
  productList: FeaturedProductForCustomer[];
}
interface GetProductFromCookies {
  productID: string;
  productName: string;
  image: string;
  attributeID: string;
  variantValue: string;
  price: number;
  qty: number;
}

export default function CartItems({
  commitChange,
  productList,
}: CartItemprops) {
  const [NumberofProduct, setNumberofProduct] = useState(1);
  const [cartItem, setCarItem] = useState<cartItems[]>([]);
  const [productItem, setProductItem] = useState<GetProductFromCookies[]>([]);
  const items = [
    {
      name: "Product1",
      price: 2000,
      instock: true,
      varient: "lg",
      quantity: NumberofProduct,
      image:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768383056/aihoosp7suvhzxyhgyqy.webp",
    },
    {
      name: "Product2",
      price: 3000,
      instock: false,
      varient: "sm",
      quantity: NumberofProduct,
      image:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768380152/uhasiygte64batlkoafh.jpg",
    },
  ];
  const freeShippingGoal = 8000;
  const currentAmount = 4000;
  const progressPercentage = Math.min(
    (currentAmount / freeShippingGoal) * 100,
    100,
  );

  const cartData = async () => {
    const cart = await getServerCart();

    setCarItem(cart);

    const items = filterItems(cart, productList);

    setProductItem(items);
  };
  const filterItems = (
    cart: CartData[],
    productList: FeaturedProductForCustomer[],
  ) => {
    const result: any[] = [];

    cart.forEach((cartItem) => {
      productList.forEach((product) => {
        product.variants.forEach((variant: any) => {
          variant.variantValues.forEach((value: any) => {
            if (value.attributeID === cartItem.attributeID) {
              result.push({
                productID: product.productID,
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
    await removeItemFromServerCart(attribuetID);
    setProductItem(
      productItem.filter((item) => item.attributeID !== attribuetID),
    );
    cartData();
    commitChange();
    //await RemoveFromCart(productID, String(token));
  };
  useEffect(() => {
    cartData();
  }, []);
  return (
    <div className="w-full p-5 flex flex-col h-full">
      {/* Header */}
      <h1 className="text-2xl mb-2 font-bold text-gray-800">SHOPPING CART</h1>
      <hr className="border-gray-300 mb-2" />
      <h2 className="text-lg text-center font-semibold text-gray-800 mb-1">
        FREE SHIPPING OVER Rs.8,000
      </h2>
      <p className="text-center text-sm text-gray-700 mb-4">
        Amount Left for Free Shipping: Rs.4,000
      </p>
      <div className="w-full">
        {/* Labels */}
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>0%</span>
          <span>100%</span>
        </div>

        {/* Track */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          {/* Progress */}
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-red-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 mt-10 overflow-y-auto space-y-4">
        {productItem.map((item, index) => (
          <div
            key={index}
            className="flex gap-3 p-2 border border-gray-100 shadow-md items-start"
          >
            {/* Checkbox */}
            <input type="checkbox" className="w-5 h-5 mt-10" />

            {/* Item Info */}
            <div className="flex-1 flex gap-3">
              <img
                src={item.image || "/placeholder.jpg"}
                alt={item.productName}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex flex-col justify-between flex-1">
                <div className="flex justify-end items-center">
                  <button
                    onClick={() => deleteProduct(item.attributeID)}
                    className="bg-gray-100 p-1 rounded"
                  >
                    <Trash className="w-4 h-4 text-gray-800 hover:text-black" />
                  </button>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{item.variantValue}</p>
                  <h3 className="text-lg font-medium text-gray-800">
                    {item.productName}
                  </h3>
                  <p className="text-gray-600">Rs. {item.price} -/</p>
                </div>

                {/* Quantity & Delete */}
                <div className="flex justify-end items-center">
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <button
                      className={`px-2 py-1 bg-gray-100 ${
                        item.qty === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-200"
                      }`}
                      onClick={() =>
                        setNumberofProduct((prev) => Math.max(prev - 1, 1))
                      }
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 py-1">{item.qty}</span>
                    <button
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                      onClick={() => setNumberofProduct((prev) => prev + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subtotal & Actions */}
      <div className="mt-4">
        <hr className="border-gray-300 mb-2" />
        <div className="flex justify-between mb-4">
          <span className="text-lg text-gray-800 font-medium">Sub Total:</span>
          <span className="text-lg text-gray-900 font-bold">5,000 -/</span>
        </div>

        <div className="flex  gap-2">
          <button className="w-full flex justify-center items-center gap-2 bg-black text-white py-3 rounded hover:bg-white hover:text-black border transition-all duration-300">
            <Heart />
            View Wishlist
          </button>
          <Link
            href={"/Customer/Checkout"}
            className=" w-full flex justify-center items-center gap-2 bg-black text-white py-3 rounded hover:bg-white hover:text-black border transition-all duration-300"
          >
            <CreditCard />
            CheckOut
          </Link>
        </div>
      </div>
    </div>
  );
}
