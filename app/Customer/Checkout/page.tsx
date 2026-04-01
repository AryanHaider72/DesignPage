"use client";
import { useEffect, useState, useCallback, useRef } from "react";
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
import MessagePopUp from "@/app/Component/UsefullComponent/MessagePopup/page";
import { getServerCart } from "@/api/lib/CookiesApi/GetCart/GetCart";
import { removeItemFromServerCart } from "@/api/lib/CookiesApi/RemoveCart/RemoveCart";
import GetCustoemrDataApi from "@/api/lib/Customer/CheckOut/GetCustomerData/GetCustomerData";
import { ResponseCustomerData } from "@/api/types/Customer/CheckOut/CustomerData/CustomerData";
import Link from "next/link";

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
  const { categoryList, storeInfo, ProductList } = useAppContext();
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
  const [customerToken, setCustoemrToken] = useState("");
  const [storePayload, setStorePayload] =
    useState<requestAddStoreToGetRate | null>(null);
  const [CityList, setCityList] = useState([]);
  const [selected2, setSelected2] = useState("");

  // Add refs to track if data is ready
  const isDataReadyRef = useRef(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const storedItems = localStorage.getItem("checkoutItems");
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        if (!Array.isArray(parsedItems)) {
          console.error("checkoutItems is not an array:", parsedItems);
          setProductItem2([]);
          return;
        }
        const item = filterItems(parsedItems, ProductList);
        setProductItem2(item);
      } catch (error) {
        console.error("Failed to parse checkout items:", error);
        setProductItem2([]);
      }
    } else {
      setProductItem2([]);
    }
  }, [ProductList]);

  const getCountry = async () => {
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
    }
  };

  const getPayment = async () => {
    const response = await GetPaymentMethodApi();
    if (response.status === 200 || response.status == 201) {
      const data = response.data as paymentgetApiResponse;
      setPaymentList2(data.paymentMethod);
      if (data.paymentMethod.length > 0) {
        setPaymentID(data.paymentMethod[0].paymentID);
        setSelected(data.paymentMethod[0].bankName);
      }
    }
  };

  const getStandard = async () => {
    const response = await GetDelieveryStandardCustomerApi();
    if (response.status === 200 || response.status == 201) {
      const data = response.data as ResponseDelievryGetData;
      setDelievryStandard(data.delievryData);
      if (data.delievryData.length > 0) {
        setDelievryTypeID(data.delievryData[0].deliveryTypeID);
        setSelected2(data.delievryData[0].typeName);
      }
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

  const getCountryShippingrates = async (destinationID: string) => {
    if (!productItem2.length) return;

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
      const totalShipping = calculateTotalShipping(rates);
      setShippingCost(totalShipping);
    }
  };

  const calculateTotalShipping = (rates: informationList[]): number => {
    if (!productItem2?.length || !rates?.length) return 0;
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

  useEffect(() => {
    if (shippingListInformation?.length > 0 && productItem2?.length > 0) {
      const total = calculateTotalShipping(shippingListInformation);
      setShippingCost(total);
    }
  }, [shippingListInformation, productItem2]);

  const getCityShippingrates = async (cityName: string) => {
    if (!productItem2.length) return;

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
      const data = response.data as shiipingInformation;
      const rates = data.informationList;
      setShippingListInformation(rates);
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

  const getCustoemrData = async (token: string) => {
    const response = await GetCustoemrDataApi(token);
    if (response.status === 200 || response.status == 201) {
      const data = response.data as ResponseCustomerData;
      if (data.customerData && data.customerData.length > 0) {
        setEmail(data.customerData[0]?.email || "");
        setFirstName(data.customerData[0]?.customerName || "");
        setPhoneNo(data.customerData[0]?.phoneNo || "");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("CustomerToken");
    if (token) {
      setCustoemrToken(token);
      getCustoemrData(token);
    }
  }, []);

  useEffect(() => {
    getCountry();
    getPayment();
    getStandard();
  }, []);

  const filterItems = (
    cartItem: CartData[] | null | undefined,
    productList: FeaturedProductForCustomer[],
  ) => {
    const result: any[] = [];
    if (!cartItem || !Array.isArray(cartItem) || cartItem.length === 0) {
      return result;
    }

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

  const calculateItemShipping = (
    item: GetProductFromCookies,
    countryRates: informationList[],
    cityRates: informationList[],
  ): number => {
    const rates = cityRates.length > 0 ? cityRates : countryRates;
    if (!rates.length) return 0;
    const rate = rates[0];
    const itemWeight = item.weight * item.qty;
    if (itemWeight <= 1) return rate.lessThen1KG;
    if (itemWeight <= 5) return rate.lessThen5KG;
    if (itemWeight <= 10) return rate.lessThen10KG;
    return rate.greaterThen10KG;
  };

  // Validate form before submission
  const validateForm = useCallback(() => {
    const requiredFields = {
      FirstName,
      LastName,
      PhoneNo,
      Email,
      PostalCode,
      PaymentID,
      Address,
      cityName,
      CountryName,
    };

    const isValid = Object.values(requiredFields).every(
      (field) => field && field.trim() !== "",
    );

    setIsFormValid(isValid);
    return isValid;
  }, [
    FirstName,
    LastName,
    PhoneNo,
    Email,
    PostalCode,
    PaymentID,
    Address,
    cityName,
    CountryName,
  ]);

  // Validate on every change
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const addOrder = async () => {
    // Prevent multiple submissions
    if (loading) {
      console.log("Already submitting...");
      return;
    }

    // Validate form
    if (!validateForm()) {
      setMessageType("error");
      setShowMessage("Please fill in all required fields (*)");
      return;
    }

    // Validate product items
    if (!productItem2.length) {
      setMessageType("error");
      setShowMessage("No items in your cart");
      return;
    }

    // Validate shipping information
    if (!shippingListInformation.length) {
      setMessageType("error");
      setShowMessage("Shipping rates not available. Please try again.");
      return;
    }

    try {
      setLoading(true);

      const shippingAddress = `Country-Name : ${CountryName}
        City-Name: ${cityName}
        Street-Address: ${Address}`;

      const orderListSub = productItem2.map((item) => {
        const itemShipping = calculateItemShipping(
          item,
          shippingListInformation,
          shippingListInformation,
        );
        const salePrice = item.price - (item.price * item.discount) / 100;

        return {
          attributeID: item.attributeID,
          qty: item.qty,
          orignalPrice: item.price * item.qty,
          salePrice: salePrice * item.qty,
          discount: item.discount,
          shippingCharges: itemShipping,
          delievryTypeID: DelievryTypeID,
        };
      });

      const payload = {
        customerName: `${FirstName} ${LastName}`.trim(),
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
            orderListSub: orderListSub,
          },
        ],
      };

      console.log("Submitting payload:", JSON.stringify(payload, null, 2));

      const response = await AddCustomerOrderApi(payload);

      if (response.status === 200 || response.status === 201) {
        // Clear cart items
        for (const item of productItem2) {
          await removeItemFromServerCart(item.attributeID);
        }

        setMessageType("success");
        setShowMessage(response.message || "Order placed successfully!");
        localStorage.removeItem("checkoutItems");

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        console.error("Order failed:", response);
        setMessageType("error");
        setShowMessage(
          response.message || "Failed to place order. Please try again.",
        );
      }
    } catch (error: any) {
      console.error("Error placing order:", error);
      setMessageType("error");
      setShowMessage(error?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const item = () => {};

  return (
    <div className="flex flex-col min-h-screen">
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
      <div className="mt-35 min-h-screen flex justify-center mb-10">
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 px-4">
          <div className="w-full">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact</h2>
              <div>
                {customerToken ? (
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Email <span className="text-red-600 text-lg">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={Email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3.5 text-base text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                      readOnly
                    />
                  </div>
                ) : (
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Email <span className="text-red-600 text-lg">*</span>
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
                )}
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
                    <div className="mb-1">
                      <label
                        htmlFor="country"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Country / Region{" "}
                        <span className="text-red-600 text-lg">*</span>
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
                        <option value="">Select Country</option>
                        {Countries.length > 0 ? (
                          Countries.map((item) => (
                            <option key={item.countryID} value={item.countryID}>
                              {item.countryName}
                            </option>
                          ))
                        ) : (
                          <option>No Country Found</option>
                        )}
                      </select>
                    </div>
                    <div className="mb-1">
                      <label
                        htmlFor="city"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        City <span className="text-red-600 text-lg">*</span>
                      </label>
                      <select
                        id="city"
                        className="w-full px-4 py-3.5 text-base text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => setCityName(e.target.value)}
                        value={cityName}
                      >
                        <option value="">Select City</option>
                        {CityList.length > 0 ? (
                          CityList.slice()
                            .sort((a: string, b: string) =>
                              a.toLowerCase().localeCompare(b.toLowerCase()),
                            )
                            .map((item, index) => (
                              <option key={index} value={item}>
                                {item}
                              </option>
                            ))
                        ) : (
                          <option>No Cities Found</option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {customerToken ? (
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block mb-2 text-sm font-medium text-gray-700"
                        >
                          First name{" "}
                          <span className="text-red-600 text-lg">*</span>
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={FirstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-3.5 text-base text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="First name"
                          readOnly
                        />
                      </div>
                    ) : (
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block mb-2 text-sm font-medium text-gray-700"
                        >
                          First name{" "}
                          <span className="text-red-600 text-lg">*</span>
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
                    )}
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Last name{" "}
                        <span className="text-red-600 text-lg">*</span>
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

                  <div className="mb-6">
                    <label
                      htmlFor="address"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Address <span className="text-red-600 text-lg">*</span>
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

                  <div className="mb-6">
                    <label
                      htmlFor="postal"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Postal code{" "}
                      <span className="text-red-600 text-lg">*</span>
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

                  <div className="mb-6">
                    <label
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Phone <span className="text-red-600 text-lg">*</span>
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

              {/* Rest of your component remains the same... */}
              <div className="w-full">
                <h2 className="text-2xl font-bold mb-6">Delivery Standard</h2>
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
                          checked={selected2 === method.typeName}
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
                          checked={selected === method.bankName}
                          onChange={() => {
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
                        {storeInfo[0]?.email}
                      </span>
                    </p>
                    <p>
                      Phone / WhatsApp:{" "}
                      <span className="font-medium text-gray-800">
                        {storeInfo[0]?.phoneNo}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-100 p-6 rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Order Summary</h1>
            <div className="space-y-6">
              {productItem2.map((item, index) => (
                <Link
                  href={`/Customer/Product/${item.productID}`}
                  key={`${item.attributeID}-${index}`}
                  className="flex justify-between items-start"
                >
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={item.image || "/placeholder.jpg"}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded-md"
                      />
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
                  <div className="flex flex-col justify-between gap-2">
                    <p className="w-full flex gap-1 justify-between text-md font-medium text-gray-800">
                      <span className="font-bold">Original Price: </span>
                      <span> {item.price.toLocaleString()}-/</span>
                    </p>
                    <p className="w-full flex justify-between gap-1 text-md font-medium text-gray-800">
                      <span className="font-bold">Sub-Total: </span>
                      <span> {(item.qty * item.price).toLocaleString()}-/</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="border-t my-6"></div>

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

            <div className="border-t mt-6 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block">PKR</span>
                  <span className="text-xl font-bold">
                    Rs{" "}
                    {(subtotal - subDiscount + shippingCost).toLocaleString()}
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
                disabled={loading || !isFormValid || !productItem2.length}
                className={`px-2 py-3 w-full text-white rounded-md mt-5 cursor-pointer transition-all ${
                  loading || !isFormValid || !productItem2.length
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-900"
                }`}
              >
                {loading ? "Processing..." : "Place Order"}
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
