import { getServerCart } from "@/api/lib/CookiesApi/GetCart/GetCart";
import { modifyCartServer } from "@/api/lib/CookiesApi/ModifyCart/ModifCart";
import { removeItemFromServerCart } from "@/api/lib/CookiesApi/RemoveCart/RemoveCart";
import { CartData } from "@/api/types/CookiesApi/CartItem";
import { categoryList } from "@/api/types/Customer/LandingPage/Category/GetCategroy";
import { FeaturedProductForCustomer } from "@/api/types/Customer/LandingPage/Product/Product";
import CheckOut from "@/app/Customer/Checkout/page";
import { useAppContext } from "@/app/useContext";
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
  categoryList: categoryList[];
  logoUrl: string;
  commitChange: () => void;
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
  categoryList,
  logoUrl,
  commitChange,
}: CartItemprops) {
  const { ProductList } = useAppContext();
  const [NumberofProduct, setNumberofProduct] = useState(1);
  const [cartItem, setCarItem] = useState<cartItems[]>([]);
  const [productItem, setProductItem] = useState<GetProductFromCookies[]>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const handleCheckboxChange = (attributeID: string) => {
    setCheckedItems((prev) =>
      prev.includes(attributeID)
        ? prev.filter((id) => id !== attributeID)
        : [...prev, attributeID],
    );
  };
  const freeShippingGoal = 8000;
  const currentAmount = 4000;
  const progressPercentage = Math.min(
    (currentAmount / freeShippingGoal) * 100,
    100,
  );

  const cartData = async () => {
    const cart = await getServerCart();

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
  };
  const updateQuantity = async (attributeID: any, newQuantity: any) => {
    if (newQuantity < 1) return;
    setProductItem((prev) =>
      prev.map((item, i) =>
        item.attributeID === attributeID ? { ...item, qty: newQuantity } : item,
      ),
    );
    const response = await modifyCartServer(
      String(attributeID),
      Number(newQuantity),
    );
    console.log(response);
  };
  const checkOut = () => {
    const selectedProducts = productItem
      .filter((item) => checkedItems.includes(item.attributeID))
      .map((item) => ({
        attributeID: item.attributeID,
        qty: item.qty,
      }));

    localStorage.setItem("checkoutItems", JSON.stringify(selectedProducts));
    window.location.href = "/Customer/Checkout";
  };
  useEffect(() => {
    cartData();
  }, []);
  const subtotal = productItem
    .filter((item) => checkedItems.includes(item.attributeID))
    .reduce((total, item) => total + item.price * item.qty, 0);
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
            <input
              type="checkbox"
              className="w-5 h-5 mt-10"
              checked={checkedItems.includes(item.attributeID)}
              onChange={() => handleCheckboxChange(item.attributeID)}
            />

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
                  <div className="flex items-center justify-between w-25 border border-gray-300 rounded-md shadow-sm bg-gray-200 px-2 py-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.attributeID, item.qty - 1)
                      }
                      className="p-1 bg-white shadow-sm rounded"
                    >
                      <Minus size={16} />
                    </button>

                    <p className="text-lg font-medium">{item.qty}</p>

                    <button
                      onClick={() =>
                        updateQuantity(item.attributeID, item.qty + 1)
                      }
                      className="p-1 bg-white hover:bg-gray-100 shadow-sm rounded"
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
          <span className="text-lg text-gray-900 font-bold">
            {subtotal.toLocaleString()} -/
          </span>
        </div>

        <div className="flex  gap-2">
          <button className="w-full flex justify-center items-center gap-2 bg-black text-white py-3 rounded hover:bg-white hover:text-black border transition-all duration-300">
            <Heart />
            View Wishlist
          </button>
          <div
            onClick={checkOut}
            className=" w-full flex justify-center items-center gap-2 bg-black text-white py-3 rounded hover:bg-white hover:text-black border transition-all duration-300"
          >
            <CreditCard />
            CheckOut
          </div>
        </div>
      </div>
    </div>
  );
}
