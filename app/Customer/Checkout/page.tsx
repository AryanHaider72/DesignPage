"use client";
import { useEffect, useState } from "react";
import Footer from "../LandingPage/FooterSection/page";
import Navbar from "../LandingPage/Navbar/page";
import { categoryList } from "@/api/types/Customer/LandingPage/Category/GetCategroy";
import { FeaturedProductForCustomer } from "@/api/types/Customer/LandingPage/Product/Product";
import { useAppContext } from "@/app/useContext";
import { CartData } from "@/api/types/CookiesApi/CartItem";
import GetCountry from "@/api/lib/Admin/Country/countryGet";
import {
  Countryget,
  CountrygetApiResponse,
} from "@/api/types/Admin/Shipment/Country/Country";
import axios from "axios";
import GetPaymentMethodApi from "@/api/lib/Customer/CheckOut/Payment/PaymentGet/PaymentGet";
import {
  paymentget,
  paymentgetApiResponse,
} from "@/api/types/Customer/CheckOut/Payment/Payment";
import GetRatesCustomerApi from "@/api/lib/Customer/CheckOut/ShipmentCharges/ShipmentCharges";
import {
  informationList,
  requestAddStoreToGetRate,
  shiipingInformation,
} from "@/api/types/Customer/CheckOut/ShipmentCharges/ShipmentCharges";
import CountryShipmentChargesApi from "@/api/lib/Customer/CheckOut/CountryShipmentCharges/CountryShipmentCharges";
import GetDelieveryStandardCustomerApi from "@/api/lib/Customer/CheckOut/DelieveryStandardget/DelieveryStandardget";
import {
  DelievryGetData,
  ResponseDelievryGetData,
} from "@/api/types/Admin/Shipment/Delievry/Delievry";
import CityShipmentChargesApi from "@/api/lib/Customer/CheckOut/CityShipmentCharges/CityShipmentCharges";
import AddCustomerOrderApi from "@/api/lib/Customer/OrderManagement/AddOrder/AddOrder";
import MessagePopUp from "@/app/UsefullComponent/MessagePopup/page";
import { getServerCart } from "@/api/lib/CookiesApi/GetCart/GetCart";
import { removeItemFromServerCart } from "@/api/lib/CookiesApi/RemoveCart/RemoveCart";

interface cartItem {
  attributeID: string;
  qty: number;
}
interface GetProductFromCookies {
  productID: string;
  productName: string;
  discount: number;
  image: string;
  attributeID: string;
  variantValue: string;
  storeID: string;
  storeName: string;
  weight: number;
  price: number;
  qty: number;
}

export default function CheckOut() {
  const { categoryList, storeInfo, ProductList, FeaturedProduct } =
    useAppContext();
  const [loading, setLoading] = useState(false);
  const [Address, setAddress] = useState("");
  const [Appartment, setAppartment] = useState("");
  const [PostalCode, setPostalCode] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [Email, setEmail] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [PaymentID, setPaymentID] = useState("");
  const [cartItem, setCartItem] = useState<cartItem[]>([]);
  const [selected, setSelected] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [countryID, setCountryID] = useState("");
  const [CountryName, setCountryName] = useState("");
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [shippingListInformation, setShippingListInformation] = useState<
    informationList[]
  >([]);
  const [DelievryTypeID, setDelievryTypeID] = useState("");
  const [cityName, setCityName] = useState("");
  const [Countries, setCountries] = useState<Countryget[]>([]);
  const [DelieveryStandard, setDelievryStandard] = useState<DelievryGetData[]>(
    [],
  );
  const [productItem2, setProductItem2] = useState<GetProductFromCookies[]>([]);
  const [paymentList2, setPaymentList2] = useState<paymentget[]>([]);
  const [storePayload, setStorePayload] =
    useState<requestAddStoreToGetRate | null>(null);
  const [CityList, setCityList] = useState([]);
  const [selected2, setSelected2] = useState("");
  useEffect(() => {
    const storedItems = localStorage.getItem("checkoutItems");
    if (storedItems) {
      try {
        const parsedItems: cartItem[] = JSON.parse(storedItems);
        console.log("items List: ", parsedItems);

        const item = filterItems(parsedItems, ProductList);
        setProductItem2(item);
      } catch (error) {
        console.error("Failed to parse checkout items:", error);
      }
    }
  }, [ProductList]);

  const getCountry = async () => {
    //const token = localStorage.getItem("token");
    const response = await GetCountry();
    if (response.status === 200 || response.status == 201) {
      const data = response.data as CountrygetApiResponse;
      setCountries(data.countryList);
      const filterData = data.countryList.find(
        (item) => item.countryName === "Pakistan",
      );
      setCountryID(filterData?.countryID || "");
      setCountryName(filterData?.countryName || "");
      getCities(filterData?.countryName || "");
    } else {
      console.log();
    }
  };
  const getPayment = async () => {
    const response = await GetPaymentMethodApi();
    if (response.status === 200 || response.status == 201) {
      const data = response.data as paymentgetApiResponse;
      setPaymentList2(data.paymentMethod);
      setPaymentID(data.paymentMethod[0].paymentID);
      setSelected(data.paymentMethod[0].bankName);
    } else {
      console.log();
    }
  };
  const getStandard = async () => {
    const response = await GetDelieveryStandardCustomerApi();
    if (response.status === 200 || response.status == 201) {
      const data = response.data as ResponseDelievryGetData;
      setDelievryStandard(data.delievryData);
      setDelievryTypeID(data.delievryData[0].deliveryTypeID);
      setSelected2(data.delievryData[0].typeName);
    } else {
      console.log();
    }
  };

  const getCities = async (name: string) => {
    const response = await axios.post(
      `https://countriesnow.space/api/v0.1/countries/cities`,
      {
        country: name,
      },
    );
    if (response.status === 200) {
      setCityList(response.data.data);
    } else {
      setCityList([]);
    }
  };

  // Update the getCountryShippingrates function
  const getCountryShippingrates = async (destinationID: string) => {
    const formData = {
      storeList: productItem2.map((item) => ({
        storeID: item.storeID,
      })),
    };

    const response = await CountryShipmentChargesApi(
      destinationID,
      DelievryTypeID,
      formData,
    );

    if (response.status === 200 || response.status === 201) {
      const data = response.data as shiipingInformation;
      const rates = data.informationList;

      setShippingListInformation(rates);

      // Calculate and set shipping cost
      const totalShipping = calculateTotalShipping(rates);
      setShippingCost(totalShipping);
    }
  };

  const calculateTotalShipping = (rates: informationList[]): number => {
    if (!productItem2.length || !rates.length) return 0;

    return productItem2.reduce((total, item) => {
      const rate = rates[0];
      if (!rate) return total;

      const totalWeight = item.weight * item.qty;

      if (totalWeight <= 1) return total + rate.lessThen1KG;
      if (totalWeight <= 5) return total + rate.lessThen5KG;
      if (totalWeight <= 10) return total + rate.lessThen10KG;
      return total + rate.greaterThen10KG;
    }, 0);
  };

  // Add useEffect to recalculate when rates or products change
  useEffect(() => {
    if (shippingListInformation.length > 0 && productItem2.length > 0) {
      const total = calculateTotalShipping(shippingListInformation);
      setShippingCost(total);
    }
  }, [shippingListInformation, productItem2]);

  const getCityShippingrates = async (cityName: string) => {
    const formData = {
      storeList: productItem2.map((item) => ({
        storeID: item.storeID,
      })),
    };

    const response = await CityShipmentChargesApi(
      cityName,
      formData,
      DelievryTypeID,
    );

    if (response.status === 200 || response.status === 201) {
      console.log("Full API Response:", response.data);
      const data = response.data as shiipingInformation;
      const rates = data.informationList;

      setShippingListInformation(rates);

      // Calculate and set shipping cost
      const totalShipping = calculateTotalShipping(rates);
      setShippingCost(totalShipping);
    }
  };
  useEffect(() => {
    if (!countryID) return;

    const selectedCountry = Countries.find((c) => c.countryID === countryID);

    if (!selectedCountry) return;

    if (selectedCountry.countryName === "Pakistan") {
      if (cityName) {
        getCityShippingrates(cityName);
      }
    } else {
      getCountryShippingrates(selectedCountry.countryID);
    }
  }, [countryID, cityName, productItem2, DelievryTypeID]);

  useEffect(() => {
    getCountry();
    getPayment();
    getStandard();
  }, []);
  const filterItems = (
    cartItem: CartData[],
    productList: FeaturedProductForCustomer[],
  ) => {
    const result: any[] = [];

    cartItem.forEach((cartItem) => {
      productList.forEach((product) => {
        product.variants.forEach((variant: any) => {
          variant.variantValues.forEach((value: any) => {
            if (value.attributeID === cartItem.attributeID) {
              result.push({
                productID: product.productID,
                storeID: product.storeID,
                discount: product.discount,
                storeName: product.storeName,
                productName: product.productName,
                image: product.images?.[0]?.url,
                attributeID: value.attributeID,
                weight: product.weight,
                variantValue: value.varientValue,
                price: value.salePrice,
                qty: cartItem.qty,
              });
            }
          });
        });
      });
    });

    console.log(result);
    return result;
  };
  const subtotal = productItem2.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );
  const subDiscount = productItem2.reduce(
    (total, item) => total + (item.discount * item.price) / 100,
    0,
  );

  const addOrder = async () => {
    try {
      setLoading(true);
      const shippingAddress = `Country-Name : ${CountryName}
    City-Name: ${cityName}
    Street-Address: ${Address}`;

      const payload = {
        customerName: FirstName + " " + LastName,
        phoneNo: PhoneNo,
        shippingAddress: shippingAddress,
        email: Email,
        city: cityName,
        country: CountryName,
        postalCode: PostalCode,

        orderMainList: [
          {
            orderDate: new Date().toISOString().split("T")[0],
            paymentID: PaymentID,
            paymentStatus: "unpaid",
            delievryCharges: shippingCost,
            shippingAddress: shippingAddress,
            orderMethod: "Order Now",
            couponDiscount: subDiscount,
            totalBill: subtotal - subDiscount + shippingCost,
            couponNumber: "",

            orderListSub: productItem2.map((item) => {
              const itemShipping = calculateItemShipping(
                item,
                shippingListInformation,
                shippingListInformation,
              );

              return {
                attributeID: item.attributeID,
                qty: item.qty,
                orignalPrice: item.price * item.qty,
                salePrice: item.price - (item.price * item.discount) / 100,
                discount: item.discount,
                shippingCharges: itemShipping,
              };
            }),
          },
        ],
      };

      const response = await AddCustomerOrderApi(payload);
      if (response.status === 200 || response.status === 201) {
        productItem2.map((item) => {
          return removeItemFromServerCart(item.attributeID);
        });
        setMessageType("success");
        setShowMessage(response.message);
        window.location.href = "/";
        localStorage.removeItem("checkoutItems");
      } else {
        setMessageType("error");
        setShowMessage(response.message || "An Error Occurred while Deleting.");
      }
    } finally {
      setLoading(false);
    }
  };
  const calculateItemShipping = (
    item: GetProductFromCookies,
    countryRates: informationList[],
    cityRates: informationList[],
  ): number => {
    // Determine which rate list to use
    const rates = cityRates.length > 0 ? cityRates : countryRates;

    if (!rates.length) return 0;

    // Use the first rate (assuming rates[0] contains the shipping rates)
    const rate = rates[0];

    // Calculate based on item weight
    const itemWeight = item.weight * item.qty; // Total weight for this item's quantity

    if (itemWeight <= 1) {
      return rate.lessThen1KG;
    } else if (itemWeight <= 5) {
      return rate.lessThen5KG;
    } else if (itemWeight <= 10) {
      return rate.lessThen10KG;
    } else {
      return rate.greaterThen10KG;
    }
  };
  const item = () => {};
  return (
    <div className=" flex flex-col min-h-screen ">
      {showMessage && (
        <MessagePopUp
          message={showMessage}
          type={messageType}
          duration={3000}
          onClose={() => setShowMessage(null)}
        />
      )}
      <Navbar
        scrolled={true}
        categoryList={categoryList}
        logoUrl={storeInfo[0]?.logoUrl}
        productList={ProductList}
        onCommit={item}
      />
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
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {/* Country */}

                    <div className="mb-1">
                      <label
                        htmlFor="country"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Country / Region
                      </label>
                      <select
                        value={countryID}
                        id="country"
                        className="w-full px-4 py-3.5 text-base text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => {
                          const selectedID = e.target.value;
                          setCountryID(selectedID);

                          const filterData = Countries.find(
                            (item) => item.countryID === selectedID,
                          );

                          if (filterData) {
                            setCountryName(filterData.countryName);
                            getCities(filterData.countryName);
                          }
                        }}
                      >
                        <option>Select Country</option>
                        {Countries.length > 0 ? (
                          <>
                            {Countries.map((item) => (
                              <option
                                key={item.countryID}
                                value={item.countryID}
                              >
                                {item.countryName}
                              </option>
                            ))}
                          </>
                        ) : (
                          <option>No Country Found</option>
                        )}
                      </select>
                    </div>
                    <div className="mb-1">
                      <label
                        htmlFor="country"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        City
                      </label>
                      <select
                        id="country"
                        className="w-full px-4 py-3.5 text-base text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => setCityName(e.target.value)}
                      >
                        {CityList.length > 0 ? (
                          <>
                            {CityList.slice()
                              .sort((a: string, b: string) =>
                                a.toLowerCase().localeCompare(b.toLowerCase()),
                              )
                              .map((item, index) => (
                                <option key={index} value={item}>
                                  {item}
                                </option>
                              ))}
                          </>
                        ) : (
                          <option>No Cities Found</option>
                        )}
                      </select>
                    </div>
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
                        value={FirstName}
                        onChange={(e) => setFirstName(e.target.value)}
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
                        value={LastName}
                        onChange={(e) => setLastName(e.target.value)}
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
                      value={Address}
                      onChange={(e) => setAddress(e.target.value)}
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
                      value={Appartment}
                      onChange={(e) => setAppartment(e.target.value)}
                      className="w-full px-4 py-3.5 text-base text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Apartment, suite, etc."
                    />
                  </div>

                  {/* Postal code and City */}
                  <div className="">
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
                        value={PostalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-4 py-3.5 text-base text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Postal code"
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
                      value={PhoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
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
                  {DelieveryStandard.map((method) => (
                    <label
                      key={method.deliveryTypeID}
                      className={`flex items-center justify-between border rounded-md p-3 cursor-pointer transition-all duration-200 ${
                        selected2 === method.typeName
                          ? "border-gray-400 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="standard"
                          value={DelievryTypeID}
                          checked={selected2 === method.typeName}
                          onClick={() => {
                            setDelievryTypeID(method.deliveryTypeID);
                          }}
                          onChange={() => {
                            setDelievryTypeID(method.deliveryTypeID);
                            setSelected2(method.typeName);
                          }}
                          className="text-gray-500 focus:ring-gray-500"
                        />
                        <span
                          className={`font-medium text-sm ${
                            selected2 === method.typeName
                              ? "text-gray-600"
                              : "text-gray-700"
                          }`}
                        >
                          {method.typeName.toUpperCase()}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="w-full mt-5">
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paymentList2.map((method) => (
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
                          value={PaymentID}
                          checked={selected === method.bankName}
                          onClick={() => {
                            setPaymentID(method.paymentID);
                          }}
                          onChange={(e) => {
                            setPaymentID(method.paymentID);
                            setSelected(method.bankName);
                          }}
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
              {productItem2.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  {/* Left: Image + Info */}
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={item.image || "/placeholder.jpg"}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded-md"
                      />

                      {/* Quantity badge */}
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
                        {item.qty}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-md font-medium text-gray-800">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.variantValue}
                      </p>
                    </div>
                  </div>

                  {/* Right: Price */}
                  <div className="flex  flex-col justify-between gap-2">
                    <p className="w-full flex gap-1 justify-between text-md font-medium text-gray-800">
                      <span className="font-bold">Original Price: </span>
                      <span> {item.price.toLocaleString()}-/</span>
                    </p>
                    <p className="w-full flex justify-between gap-1 text-md font-medium text-gray-800">
                      <span className="font-bold">Sub-Total: </span>
                      <span> {(item.qty * item.price).toLocaleString()}-/</span>
                    </p>
                  </div>
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
                <span>Rs {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span>Rs {subDiscount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>Rs 0</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>Rs {shippingCost.toLocaleString()} -/</span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t mt-6 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block">PKR</span>
                  <span className="text-xl font-bold">
                    Rs{" "}
                    {(subtotal + subDiscount + shippingCost).toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Including Rs 0 in taxes
              </p>
            </div>
            <div className="w-full">
              <button
                onClick={addOrder}
                className="px-2 py-3 w-full bg-black hover:bg-gray-900 text-white rounded-md mt-5 cursor-pointer"
              >
                {loading ? "Saving..." : "Save"}
              </button>
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
