import GetCustomer from "@/api/lib/PosIntegration/Customer/GetCustomer/GetCustomer";
import GetSalesMan from "@/api/lib/PosIntegration/SalesMan/GetSalesMan/GetSalesMan";
import {
  CustomerData,
  ResponseCustomerGetData,
} from "@/api/types/Posintegration/Customer";
import { useEffect, useState } from "react";
import ShowReturnItemsList from "./ShowReturnListItem/page";
import {
  Product,
  ProductApiResponseSalesMan,
  varinetMessage,
} from "@/api/types/Posintegration/Product/ProductGet";
import GetTillForSalesMan from "@/api/lib/OfflineSeller/MainPage/TillsGet/SalesManTill/SelemanGetTill";
import GetProductSalesMan from "@/api/lib/PosIntegration/ProductSalesMan/GetProductSalesMan/GetProductSalesMan";
import { Notebook, Trash } from "lucide-react";
import GetProductVarient from "@/api/lib/PosIntegration/ProductSalesMan/FetchProductVarient/FetchProductVarinet";
import AddSale from "@/api/lib/PosIntegration/SalesPanel/SaleAdd/SaleAdd";
interface newItem {
  attributeID: string;
  productName?: string;
  qty: number;
  varientValue: string;
  price: number;
  barcode: string;
  stockQty: number;
  discount: number;
}

interface ShowSaleForm {
  onToggleReturnList: (value: boolean) => void;
  onToggleProductID: (value: string) => void;
  productData: (value: Product[]) => void;
  returnItemData: newItem[];
  onToggleVarientLIstShow: (value: boolean) => void;
  onToggleAttribuetID: (value: string) => void;
  onQtyChange: (attributeID: string, qty: number) => void;
  onOriginalChange: (attributeID: string, original: number) => void;
  BarcodeValue: (value: string) => void;
  TillIDPass: (value: string) => void;
  resetReturnItemList: (value: boolean) => void;
}

export default function PosSaleAddForm({
  onToggleReturnList,
  returnItemData,
  onToggleProductID,
  productData,
  onToggleVarientLIstShow,
  onToggleAttribuetID,
  onQtyChange,
  onOriginalChange,
  BarcodeValue,
  TillIDPass,
  resetReturnItemList,
}: ShowSaleForm) {
  const [Loading, setLoading] = useState(false);
  const [ShowProduct, setShowProduct] = useState(false);
  const [TillID, setTillID] = useState("");
  const [SalesManID, setSalesManID] = useState("");
  const [CustomerID, setCustomerID] = useState("");
  const [saleDate, setSaleDate] = useState("");
  const [Description, setDescription] = useState("");
  const [Barcode, setBarcode] = useState("");
  const [ProductName, setProductName] = useState("");
  const [RemaningBalance, setRemaningBalance] = useState(0);
  const [AmountPaid, setAmountPaid] = useState(0);
  const [Discount, setDiscount] = useState(0);
  const [TotalBill, setTotalBill] = useState(0);
  const [salesmanList, setSalesmanList] = useState<Salesman[]>([]);
  const [customerList, setCustomerList] = useState<CustomerData[]>([]);
  const [productList2, setProductList2] = useState<Product[]>([]);
  const [TillList, setTillList] = useState<TillList[]>([]);

  const resetForm = () => {
    setBarcode("");
    setDiscount(0);
    setProductName("");
    setDescription("");
    resetReturnItemList(true);
    setAmountPaid(0);
    setLoading(false);
  };

  const fetchSalesman = async () => {
    const token = localStorage.getItem("posSellerToken");
    if (!token) return;

    try {
      const response = await GetSalesMan(String(token));

      if (response.status === 200 || response.status === 201) {
        const data = response.data as SalesmanApiResponse;

        setSalesmanList(data.salesmanList || []);
        setSalesManID(data.salesmanList[0].salesmanID);
      }
    } catch (error) {
      console.error("Error fetching salesman list", error);
    }
  };
  const CustomerGet = async () => {
    const token = localStorage.getItem("posSellerToken");
    const response = await GetCustomer(String(token));
    if (response.status === 200 || response.status === 201) {
      const data = response.data as ResponseCustomerGetData;
      setCustomerID(data.customerList[0].customerID);
      setCustomerList(data.customerList);
    } else {
      setCustomerList([]);
    }
  };

  const getTill = async () => {
    const token = localStorage.getItem("posSellerToken");
    const response = await GetTillForSalesMan(String(token));

    if (response.status === 200) {
      const data = response.data as RespiosneGetTills;
      if (data?.tillList?.length > 0) {
        console.log(data);
        setTillList(data.tillList);
        setTillID(data.tillList[0].tillID);
      } else {
        setTillList([]);
      }
    }
  };
  const getProduct = async () => {
    const token = localStorage.getItem("posSellerToken");

    if (!token) return;

    const response = await GetProductSalesMan(token, TillID, ProductName);

    if (response.status === 200 || response.status === 201) {
      const data = response.data as ProductApiResponseSalesMan;
      setProductList2(data.productList);
      productData(data.productList);
    } else {
      setProductList2([]);
    }
  };

  useEffect(() => {
    if (!ProductName || ProductName.trim().length === 0) return;

    const delayDebounce = setTimeout(() => {
      getProduct();
    }, 50);

    return () => clearTimeout(delayDebounce);
  }, [ProductName]);

  useEffect(() => {
    const date = new Date().toISOString().split("T")[0];
    setSaleDate(date);
    getTill();
    fetchSalesman();
    CustomerGet();
  }, []);

  useEffect(() => {
    const getItemTotal = (item: any) => {
      const totalWithoutDiscount = item.qty * item.price;
      const discountAmount = (item.price * item.discount) / 100; // discount only once
      return totalWithoutDiscount - discountAmount;
    };
    const totalSum = returnItemData.reduce(
      (total, item) => total + getItemTotal(item),
      0,
    );
    setAmountPaid(totalSum);
    setTotalBill(totalSum);
  }, [returnItemData]);

  const addSalepos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("posSellerToken");
      const formData = {
        customerID: CustomerID,
        postingDate: saleDate,
        SalesmanID: SalesManID,
        totalBill: TotalBill,
        amountPaid: AmountPaid,
        adjustment: Discount,
        remarks: Description,
        list: returnItemData.map((item) => ({
          attributeID: item.attributeID,
          qty: item.qty,
          amount: item.price,
          remakrs: "",
        })),
      };
      const response = await AddSale(formData, String(token));
      if (response.status === 200) {
        resetForm();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* {showReturnList && (
        <>
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md ">
              <ShowReturnItemsList />
            </div>
          </div>
        </>
      )} */}
      <div className="w-full  mx-auto p-6  min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Create New Invoice
          </h1>
          <p className="text-gray-500">
            Fill in the details to generate a new bill
          </p>
        </div>

        {/* Main Container */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* Left Panel - Sales Info */}
            <div className="w-full lg:w-1/2 min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                Sales Information
              </h2>
              <div className="space-y-4">
                {/* Sales Man */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Sales Representative
                  </label>
                  <div className="relative">
                    <select
                      value={SalesManID}
                      onChange={(e) => setSalesManID(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
                    >
                      <option>Select Sales-Men</option>
                      {salesmanList.map((cat) => (
                        <option key={cat.salesmanID} value={cat.salesmanID}>
                          {cat.salesmanName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sale Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Sale Date
                  </label>
                  <input
                    type="date"
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* Customer */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Customer
                  </label>
                  <div className="relative">
                    <select
                      value={CustomerID}
                      onChange={(e) => setCustomerID(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
                    >
                      <option>Select Customer</option>
                      {customerList.map((cat) => (
                        <option key={cat.customerID} value={cat.customerID}>
                          {cat.customerName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Product Details Section */}
                <div className="pt-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Product Details
                  </h3>

                  {/* Barcode */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Barcode
                    </label>
                    <input
                      type="text"
                      value={Barcode}
                      onChange={(e) => {
                        setBarcode(e.target.value);
                        BarcodeValue(e.target.value);
                        TillIDPass(TillID);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") BarcodeValue(Barcode);
                      }}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter barcode"
                    />
                  </div>

                  {/* Product Name */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Product Name
                    </label>
                    <div className=" ">
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={ProductName}
                          onFocus={() => setShowProduct(true)}
                          onBlur={() =>
                            setTimeout(() => setShowProduct(false), 100)
                          }
                          onChange={(e) => {
                            setShowProduct(true);
                            setProductName(e.target.value);
                            const data = productList2.find(
                              (item) => item.productName === e.target.value,
                            );
                            if (data) {
                              console.log(
                                "Sending productID to parent:",
                                data.productID,
                              );
                              onToggleProductID(data.productID);
                            }
                          }}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="Enter product name"
                        />
                        <button
                          onClick={() => onToggleVarientLIstShow(true)}
                          className="px-2 py-2 bg-blue-500 hover:bg-blue-600 shadow-md rounded-md text-white"
                        >
                          <Notebook />
                        </button>
                      </div>
                      {ShowProduct && productList2.length > 0 && (
                        <ul className="relative  w-full bg-white border border-neutral-200 rounded mt-1 shadow-sm max-h-40 overflow-auto">
                          {productList2.map((opt, index) => (
                            <li
                              key={index}
                              onMouseDown={() => {
                                setProductName(opt.productName);
                                setShowProduct(false);
                                const product = productList2.find(
                                  (item) =>
                                    item.productName === opt.productName,
                                );
                                if (product) {
                                  onToggleProductID(product.productID);
                                }
                              }}
                              className="px-4 py-2 cursor-pointer hover:bg-neutral-100"
                            >
                              {opt.productName}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={Description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                      placeholder="Product description..."
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                Payment Summary
              </h2>

              <div className="space-y-4">
                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Discount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={Discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-right"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Amount Paid */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Amount Paid
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={AmountPaid}
                      onChange={(e) => setAmountPaid(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-right"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3 mt-4">
                  {/* Total Bill */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Bill:</span>
                    <span className="text-lg font-semibold text-gray-800">
                      {TotalBill?.toFixed(2) || "0.00"} -/
                    </span>
                  </div>

                  {/* Remaining Balance */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-700">
                      Remaining Balance:
                    </span>
                    <span
                      className={`text-lg font-bold ${TotalBill - AmountPaid - Discount > 0 ? "text-red-500" : "text-green-500"}`}
                    >
                      {(TotalBill - AmountPaid - Discount).toFixed(2) || "0.00"}{" "}
                      -/
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4">
                  <button
                    onClick={() => addSalepos()}
                    className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2.5 px-4 rounded-lg transition shadow-sm"
                  >
                    {Loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Center - Product Table */}
          <div className="w-full min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-center mt-2">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2">
                Product List
              </h2>
              <button
                onClick={() => {
                  onToggleReturnList(true);
                }}
                className="px-5 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                Return Item
              </button>
            </div>
            <hr className="border border-gray-200 mb-2" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Barcode
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Variant
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Original
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {returnItemData.length > 0 ? (
                    <>
                      {returnItemData.map((item, index) => (
                        <>
                          <tr
                            key={item.attributeID}
                            className={`${item.qty > item.stockQty ? "bg-red-200" : "hover:bg-gray-50"} transition`}
                          >
                            <td className="py-3 px-4 text-sm">
                              {item.barcode}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {item.productName}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {item.varientValue}
                            </td>
                            <td className="px-4 py-2 text-center text-gray-700 font-medium">
                              <input
                                type="number"
                                className="w-[8ch] text-center border rounded-md px-1 py-1"
                                value={item.qty}
                                min={1}
                                onChange={(e) => {
                                  const value = Number(e.target.value) || 1;
                                  onQtyChange(item.attributeID, value);
                                }}
                              />
                            </td>
                            <td className="px-4 py-2 text-center text-gray-700 font-medium">
                              <input
                                type="number"
                                size={20}
                                className="w-[8ch] text-center border rounded-md px-1 py-1"
                                value={item.price}
                                min={1}
                                onChange={(e) => {
                                  const value = Number(e.target.value) || 1;
                                  onOriginalChange(item.attributeID, value);
                                }}
                              />
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {item.discount}
                            </td>
                            <td className="py-3 px-4 text-sm font-medium">
                              {item.qty * item.price -
                                (item.price * item.qty * item.discount) / 100}
                            </td>
                            <td className="py-3 px-4 ">
                              <button
                                onClick={() =>
                                  onToggleAttribuetID(item.attributeID)
                                }
                                className="px-2 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white "
                              >
                                <Trash />
                              </button>
                            </td>
                          </tr>
                        </>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-16">
                        <div className="flex flex-col items-center justify-center text-center text-gray-500">
                          <svg
                            className="w-14 h-14 text-gray-300 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                          <p className="text-sm">No products added yet</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Empty State */}
            </div>
          </div>

          {/* Right Panel - Payment Info */}
        </div>
      </div>
    </>
  );
}
