"use client";
import { useState } from "react";
import Footer from "../LandingPage/FooterSection/page";
import Navbar from "../LandingPage/Navbar/page";

export default function CheckOut() {
  const [selected, setSelected] = useState("");
  const [selected2, setSelected2] = useState("");
  const paymentList = [
    { paymentID: "12", bankName: "COD" },
    { paymentID: "13", bankName: "Debit / Credit" },
    { paymentID: "14", bankName: "Bank Account" },
  ];
  const DelievryStandards = [
    { StandardID: "12", StandardName: "Standard Service" },
    { StandardID: "13", StandardName: "Express Service" },
    { StandardID: "14", StandardName: "Fast Service" },
  ];
  const items = [
    {
      name: "Product1",
      price: 2000,
      sku: "14",
      instock: true,
      varient: "lg",
      quantity: 1,
      image:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768383056/aihoosp7suvhzxyhgyqy.webp",
    },
    {
      name: "Product2",
      price: 3000,
      sku: "15",
      instock: false,
      varient: "sm",
      quantity: 3,
      image:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768380152/uhasiygte64batlkoafh.jpg",
    },
    {
      name: "Product3",
      price: 3000,
      sku: "16",
      instock: false,
      varient: "sm",
      quantity: 3,
      image:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768380240/qrbuoqyzo3lhnxniipty.webp",
    },
  ];
  return (
    <div className=" flex flex-col min-h-screen ">
      <Navbar scrolled={true} />
      <div className="mt-35 min-h-screen flex  justify-center mb-10">
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 px-4">
          <div className="w-full">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact</h2>
              <div>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3.5 text-base text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="flex items-center mb-10">
                  <input
                    type="checkbox"
                    id="offers"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="offers"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Email me with news and offers
                  </label>
                </div>
              </div>
              <div className="w-full">
                <h2 className="text-2xl font-bold mb-6">Delivery</h2>
                <div>
                  {/* Country */}
                  <div className="mb-6">
                    <label
                      htmlFor="country"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Country / Region
                    </label>
                    <select
                      id="country"
                      className="w-full px-4 py-3.5 text-base text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="Morocco"
                    >
                      <option>Morocco</option>
                      <option>USA</option>
                      <option>Canada</option>
                      <option>UK</option>
                    </select>
                  </div>

                  {/* Name fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        First name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        className="w-full px-4 py-3.5 text-base text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="First name"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Last name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        className="w-full px-4 py-3.5 text-base text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>

                  {/* Address fields */}
                  <div className="mb-6">
                    <label
                      htmlFor="address"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      className="w-full px-4 py-3.5 text-base text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Street address"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="apartment"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Apartment, suite, etc. (optional)
                    </label>
                    <input
                      type="text"
                      id="apartment"
                      className="w-full px-4 py-3.5 text-base text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Apartment, suite, etc."
                    />
                  </div>

                  {/* Postal code and City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label
                        htmlFor="postal"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Postal code (optional)
                      </label>
                      <input
                        type="text"
                        id="postal"
                        className="w-full px-4 py-3.5 text-base text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Postal code"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="city"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        className="w-full px-4 py-3.5 text-base text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="City"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="mb-6">
                    <label
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-3.5 text-base text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Phone number"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="w-full">
                <h2 className="text-2xl font-bold mb-6">Delievry Statndard</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DelievryStandards.map((method) => (
                    <label
                      key={method.StandardID}
                      className={`flex items-center justify-between border rounded-md p-3 cursor-pointer transition-all duration-200 ${
                        selected2 === method.StandardName
                          ? "border-gray-400 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="standard"
                          // value={paymentID}
                          checked={selected2 === method.StandardName}
                          onClick={() => {
                            // setIsShow(true);
                            // fetchData(method.paymentID);
                            // setPaymentID(method.paymentID);
                          }}
                          onChange={() => setSelected2(method.StandardName)}
                          className="text-gray-500 focus:ring-gray-500"
                        />
                        <span
                          className={`font-medium text-sm ${
                            selected2 === method.StandardName
                              ? "text-gray-600"
                              : "text-gray-700"
                          }`}
                        >
                          {method.StandardName.toUpperCase()}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="w-full mt-5">
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paymentList.map((method) => (
                    <label
                      key={method.paymentID}
                      className={`flex items-center justify-between border rounded-md p-3 cursor-pointer transition-all duration-200 ${
                        selected === method.bankName
                          ? "border-gray-400 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="payment"
                          // value={paymentID}
                          checked={selected === method.bankName}
                          onClick={() => {
                            // setIsShow(true);
                            // fetchData(method.paymentID);
                            // setPaymentID(method.paymentID);
                          }}
                          onChange={() => setSelected(method.bankName)}
                          className="text-gray-500 focus:ring-gray-500"
                        />
                        <span
                          className={`font-medium text-sm ${
                            selected === method.bankName
                              ? "text-gray-600"
                              : "text-gray-700"
                          }`}
                        >
                          {method.bankName.toUpperCase()}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="w-full mt-10 pt-8">
                <h2 className="text-xl font-semibold mb-4">Need Help?</h2>

                <div className="space-y-4 text-sm text-gray-600">
                  <p>
                    If you have any questions or complaints about your order,
                    feel free to contact us:
                  </p>

                  <div className="space-y-1">
                    <p>
                      📧 Email:{" "}
                      <span className="font-medium text-gray-800">
                        support@yourstore.com
                      </span>
                    </p>
                    <p>
                      Phone / WhatsApp:{" "}
                      <span className="font-medium text-gray-800">
                        +212 6 00 00 00 00
                      </span>
                    </p>
                  </div>

                  <div className="pt-4">
                    <h3 className="font-medium text-gray-800 mb-2">
                      Delivery Information
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Delivery inside Morocco: 2–4 business days.</li>
                      <li>
                        International delivery: 5–10 business days depending on
                        location.
                      </li>
                      <li>Shipping fees may vary for international orders.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-100 p-6 rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Order Summary</h1>

            {/* Product List */}
            <div className="space-y-6">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  {/* Left: Image + Info */}
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />

                      {/* Quantity badge */}
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-md font-medium text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">{item.sku}</p>
                    </div>
                  </div>

                  {/* Right: Price */}
                  <p className="text-md font-medium text-gray-800">
                    Rs {item.price}
                  </p>
                </div>
              ))}
            </div>

            {/* Discount Code */}
            <div className="flex gap-3 mt-8">
              <input
                type="text"
                placeholder="Discount code"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <button className="px-4 py-2 bg-gray-200 text-sm rounded-md hover:bg-gray-300 transition">
                Apply
              </button>
            </div>

            {/* Divider */}
            <div className="border-t my-6"></div>

            {/* Price Breakdown */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>Rs 5000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span>Rs 0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>Rs 0</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>Rs 180</span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t mt-6 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block">PKR</span>
                  <span className="text-xl font-bold">Rs 5180</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Including Rs 0 in taxes
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}
