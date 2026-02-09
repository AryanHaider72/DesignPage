import { CreditCard, Minus, Plus, ShoppingCart, Trash } from "lucide-react";
import { useState } from "react";

export default function CartItems() {
  const [NumberofProduct, setNumberofProduct] = useState(1);
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
  const currentAmount = 4000; // Example amount in cart
  const progressPercentage = Math.min(
    (currentAmount / freeShippingGoal) * 100,
    100,
  );
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
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-4 mb-10 bg-gradient-to-r from-blue-400 to-red-600 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Items List */}
      <div className="flex-1 mt-10 overflow-y-auto space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3 items-start">
            {/* Checkbox */}
            <input type="checkbox" className="w-5 h-5 mt-2" />

            {/* Item Info */}
            <div className="flex-1 flex gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <p className="text-sm text-gray-500">{item.varient}</p>
                  <h3 className="text-lg font-medium text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-gray-600">Rs. {item.price} -/</p>
                </div>

                {/* Quantity & Delete */}
                <div className="flex justify-between items-center mt-2">
                  <button className="bg-gray-100 p-1 rounded">
                    <Trash className="w-4 h-4 text-gray-800 hover:text-black" />
                  </button>
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <button
                      className={`px-2 py-1 bg-gray-100 ${
                        item.quantity === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-200"
                      }`}
                      onClick={() =>
                        setNumberofProduct((prev) => Math.max(prev - 1, 1))
                      }
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 py-1">{item.quantity}</span>
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
            <ShoppingCart />
            View Cart
          </button>
          <button className=" w-full flex justify-center items-center gap-2 bg-black text-white py-3 rounded hover:bg-white hover:text-black border transition-all duration-300">
            <CreditCard />
            CheckOut
          </button>
        </div>
      </div>
    </div>
  );
}
