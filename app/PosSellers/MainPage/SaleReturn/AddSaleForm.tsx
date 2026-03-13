import GetTillForSalesMan from "@/api/lib/OfflineSeller/MainPage/TillsGet/SalesManTill/SelemanGetTill";
import GetProductSalesMan from "@/api/lib/PosIntegration/ProductSalesMan/GetProductSalesMan/GetProductSalesMan";
import AddSalePosReturn from "@/api/lib/PosIntegration/SaleReturn/AddSaleReturn/AddSaleReturn";
import GetSalePosInvoice from "@/api/lib/PosIntegration/SalesPanel/SaleGetInvoice/SaleGetInvoice";
import SearchByInvoice from "@/api/lib/PosIntegration/SearchHistory/SearchByInvoice/SearchInvocie";
import SearchByProduct from "@/api/lib/PosIntegration/SearchHistory/SearchProduct/SearchProduct";
import {
  RespiosneGet,
  TillList,
} from "@/api/types/Admin/TillRegister/TillRegister";
import {
  Product,
  ProductApiResponseSalesMan,
} from "@/api/types/Posintegration/Product/ProductGet";
import { responseGetSale, Sale } from "@/api/types/Posintegration/Salespanel";
import { Check, Plus, ShoppingCart, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface historyData {
  attributeID: string;
  productName: string;
  qty: number;
  varientValue: string;
  salePrice: number;
  barcode: string;
  maxQty: number;
  saleDate: string;
  customerName: string;
  customerID: string;
}

interface responseList {
  showHistory: historyData[];
}

interface AddReturnForm {
  isOpenReturn: (data: boolean) => void;
  exchangeItems: newItem[];
  removeItem: (data: string) => void;
  handleResetNewItem: (data: boolean) => void;
  onShowMessage: (message: any, type: "success" | "error") => void;
}
interface newItem {
  attributeID: string;
  productName: string;
  qty: number;
  varientValue: string;
  price: number;
  barcode: string;
  stockQty: number;
  discount: number;
}
export default function AddSaleForm({
  isOpenReturn,
  exchangeItems,
  removeItem,
  handleResetNewItem,
  onShowMessage,
}: AddReturnForm) {
  const [open, setOpen] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [ShowProduct, setShowProduct] = useState(false);
  const [saleDate, setSaleDate] = useState("");
  const [TillID, setTillID] = useState("");
  const [SaleID, setSaleID] = useState("");
  const [returnType, setReturnType] = useState("");
  const [selectedOption, setSelectedOption] = useState("inovice");
  const [CustomerName, setCustomerName] = useState("");
  const [CustomerID, setCustomerID] = useState("");
  const [inoviceNo, setInvoiceNo] = useState("");
  const [ProductName, setProductName] = useState("");
  const [SaleList, setSaleList] = useState<Sale[]>([]);
  const [InvocieHistory, setInvocieHistory] = useState<historyData[]>([]);
  const [productList2, setProductList2] = useState<Product[]>([]);
  const [TillList, setTillList] = useState<TillList[]>([]);
  const [AmountPaid, setAmountPaid] = useState(0);
  const [Discount, setDiscount] = useState(0);
  const [TotalBill, setTotalBill] = useState(0);
  const [TotalExchnage, setTotalExchnage] = useState(0);

  const saleGet = async () => {
    const token = localStorage.getItem("posSellerToken");
    const response = await GetSalePosInvoice(String(token));
    if (response.status === 200 || response.status === 201) {
      const data = response.data as responseGetSale;
      console.log(data);
      setSaleList(data.saleList);
    }
  };

  const getInvoiceHistory = async (invoice: string) => {
    console.log(invoice);
    const token = localStorage.getItem("posSellerToken");

    if (!token) return;
    const data = SaleList.find((item) => item.invoiceNo === Number(invoice));
    if (data) {
      const response = await SearchByInvoice(token, data.saleID);
      if (response.status === 200 || response.status === 201) {
        const data = response.data as responseList;
        console.log(data);
        setInvocieHistory(
          data.showHistory.map((item) => ({
            attributeID: item.attributeID,
            productName: item.productName,
            qty: 1,
            varientValue: item.varientValue,
            salePrice: item.salePrice,
            barcode: item.barcode,
            maxQty: item.qty,
            saleDate: item.saleDate,
            customerName: item.customerName,
            customerID: item.customerID,
          })) || [],
        );
        if (data.showHistory && data.showHistory.length > 0) {
          setCustomerName(data.showHistory[0].customerName);
          setCustomerID(data.showHistory[0].customerID);
        }
      }
    }
  };

  const getProductHistory = async (ID: string) => {
    const token = localStorage.getItem("posSellerToken");
    if (!token) return;
    const response = await SearchByProduct(token, ID);
    if (response.status === 200 || response.status === 201) {
      const data = response.data as responseList;
      console.log(data);
      setInvocieHistory(data.showHistory || []);
      if (data.showHistory && data.showHistory.length > 0) {
        setCustomerName(data.showHistory[0].customerName);
      }
    }
  };

  const getTill = async () => {
    const token = localStorage.getItem("posSellerToken");
    const response = await GetTillForSalesMan(String(token));

    if (response.status === 200) {
      const data = response.data as RespiosneGet;
      if (data?.tillList?.length > 0) {
        setTillList(data.tillList);
        setTillID(data.tillList[0].tillID);
      } else {
        setTillList([]);
      }
    }
  };

  useEffect(() => {
    if (!ProductName || ProductName.trim().length === 0) return;

    const delayDebounce = setTimeout(() => {
      getProduct();
    }, 50);

    return () => clearTimeout(delayDebounce);
  }, [ProductName]);

  const getProduct = async () => {
    const token = localStorage.getItem("posSellerToken");

    if (!token) return;

    const response = await GetProductSalesMan(token, TillID, ProductName);

    if (response.status === 200 || response.status === 201) {
      const data = response.data as ProductApiResponseSalesMan;
      console.log(data);
      setProductList2(data.productList);
    } else {
      setProductList2([]);
    }
  };

  useEffect(() => {
    const date = new Date().toISOString().split("T")[0];
    setSaleDate(date);
    saleGet();
    getTill();
  }, []);

  useEffect(() => {
    const total = InvocieHistory.reduce((sum, item) => {
      return sum + item.salePrice * item.qty;
    }, 0);
    const totalExchange = exchangeItems.reduce((sum, item) => {
      return sum + item.price * item.qty;
    }, 0);
    setTotalExchnage(totalExchange);
    setTotalBill(total);
    setAmountPaid(total); // Initialize AmountPaid with total
  }, [InvocieHistory, exchangeItems]);

  const filteredOptions = SaleList.filter((opt) =>
    String(opt.invoiceNo).toLowerCase().includes(inoviceNo.toLowerCase()),
  );

  // Handle quantity change
  const handleQuantityChange = (index: number, newQty: number) => {
    if (newQty < 1) {
      alert("Quantity cannot be less than 1");
      return;
    }

    const updatedHistory = [...InvocieHistory];
    updatedHistory[index] = {
      ...updatedHistory[index],
      qty: newQty,
    };
    setInvocieHistory(updatedHistory);
  };

  const handleSave = async (type: string) => {
    if (!returnType) return alert("please select a return Type");

    let totalBill = 0;
    let amountPaid = 0;
    // if (returnType === "refund") {
    //   totalBill = -totalReturn;
    //   amountPaid = AmountPaid;
    // }
    if (type === "refund") {
      totalBill = TotalBill;
      amountPaid = AmountPaid - Discount;
    }
    // if (type === "credit") {
    //   totalBill = -totalReturn;
    //   amountPaid = 0;
    // }
    if (type === "credit") {
      totalBill = TotalBill;
      amountPaid = AmountPaid;
    }
    if (type === "Exchange") {
      totalBill = TotalBill - TotalExchnage;
      amountPaid = AmountPaid + Discount;
    }
    const formData = {
      saleID: SaleID,
      customerID: CustomerID,
      postingDate: saleDate,
      totalBill,
      amountPaid,
      adjustment: Discount,
      RetunrType: type,
      remarks: "",

      ...(type === "exchange"
        ? {
            listReturn: InvocieHistory.map((item) => ({
              attributeID: item.attributeID,
              productName: item.productName,
              barcode: item.barcode,
              qty: item.qty,
              rate: item.salePrice,
            })),
            listExcahnge: exchangeItems.map((item) => ({
              attributeID: item.attributeID,
              productName: item.productName,
              barcode: item.barcode,
              qty: item.qty,
              rate: item.price,
            })),
          }
        : {
            listReturn: InvocieHistory.map((item) => ({
              attributeID: item.attributeID,
              productName: item.productName,
              barcode: item.barcode,
              qty: item.qty,
              rate: item.salePrice,
            })),
            listExcahnge: [],
          }),
    };
    const token = localStorage.getItem("posSellerToken");
    console.log(formData);
    try {
      setLoading(true);
      const response = await AddSalePosReturn(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        handleResetNewItem(true);
        setAmountPaid(0);
        setDiscount(0);
        setInvocieHistory([]);
        setInvoiceNo("");
        setProductName("");
        setCustomerName("");
        setSaleDate("");
        setCustomerID("");
        setSaleID("");
        setReturnType("");
        setTotalBill(0);
        setTotalExchnage(0);
        onShowMessage(
          response.message || "Customer Added successfully",
          "success",
        );
      } else {
        onShowMessage(response.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReturnTypeChange = (type: string) => {
    setReturnType(type);
  };
  const removeItemFromList = (ID: string) => {
    removeItem(ID);
  };
  const handleRemoveInvoiceItems = (ID: string) => {
    const updated = InvocieHistory.filter((item) => item.attributeID !== ID);
    setInvocieHistory(updated);
  };
  return (
    <>
      <div className="w-full mx-auto p-6 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Create Return Invoice
          </h1>
          <p className="text-gray-500">
            Fill in the details to generate a new bill for return sale
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section - Sales Information */}
          <div className="w-full lg:w-1/2 min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
              Sales Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Search by
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="inline-radio"
                      value="inovice"
                      checked={selectedOption === "inovice"}
                      onChange={(e) => {
                        setSelectedOption(e.target.value);
                        setInvocieHistory([]);
                        setCustomerName("");
                        setInvoiceNo("");
                      }}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700 text-sm font-medium">
                      Invoice No
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="inline-radio"
                      value="product"
                      checked={selectedOption === "product"}
                      onChange={(e) => {
                        setSelectedOption(e.target.value);
                        setInvocieHistory([]);
                        setCustomerName("");
                        setProductName("");
                      }}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700 text-sm font-medium">
                      Product
                    </span>
                  </label>
                </div>
              </div>

              {selectedOption === "inovice" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Invoice No
                  </label>
                  <input
                    type="text"
                    value={inoviceNo}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 100)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setInvoiceNo(value);
                      getInvoiceHistory(value);
                    }}
                    placeholder="Invoice No"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  {open && filteredOptions.length > 0 && (
                    <ul className="relative w-full bg-white border border-neutral-200 rounded mt-1 shadow-sm max-h-40 overflow-auto z-10">
                      {filteredOptions.map((opt, index) => (
                        <li
                          key={index}
                          onMouseDown={() => {
                            setInvoiceNo(String(opt.invoiceNo));
                            getInvoiceHistory(String(opt.invoiceNo));
                            setSaleID(opt.saleID);
                            setOpen(false);
                          }}
                          className="px-4 py-2 cursor-pointer hover:bg-neutral-100"
                        >
                          {opt.invoiceNo}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Product Name
                  </label>
                  <div>
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
                      }}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter product name"
                    />
                    {ShowProduct && productList2.length > 0 && (
                      <ul className="relative w-full bg-white border border-neutral-200 rounded mt-1 shadow-sm max-h-40 overflow-auto z-10">
                        {productList2.map((opt, index) => (
                          <li
                            key={index}
                            onMouseDown={() => {
                              setProductName(opt.productName);
                              setShowProduct(false);
                              getProductHistory(opt.productID);
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
              )}

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={CustomerName}
                  readOnly
                  placeholder="Customer Name"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

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
            </div>
          </div>

          {/* Right Section - Billing Summary */}
          <div className="w-full lg:w-1/2 min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100 ">
              Billing Summary
            </h2>
            <div className="p-5 space-y-4">
              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Discount
                </label>
                <input
                  type="number"
                  value={Discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-right"
                  placeholder="0.00"
                  min="0"
                />
              </div>

              {/* Amount Paid */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Amount Paid
                </label>
                <input
                  type="number"
                  value={AmountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-right"
                  placeholder="0.00"
                  min="0"
                />
              </div>

              {/* Summary Cards */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {/* Total Bill */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Bill:</span>
                  <span className="text-lg font-semibold text-gray-800">
                    Rs. {TotalBill?.toFixed(2) || "0.00"}
                  </span>
                </div>

                {/* Net Amount after Discount */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">After Discount:</span>
                  <span className="text-lg font-semibold text-gray-800">
                    Rs. {(TotalBill - Discount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Exchange Amount:
                  </span>
                  <span className="text-lg font-semibold text-gray-800">
                    Rs. {TotalExchnage.toFixed(2)}
                  </span>
                </div>

                {/* Remaining Balance */}
                {/* Remaining Balance */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-700">
                    Remaining Balance:
                  </span>

                  {(() => {
                    const remaining =
                      TotalBill - TotalExchnage - AmountPaid - Discount;

                    let statusText = "";
                    let statusColor = "";

                    if (remaining > 0) {
                      statusText = " (Due)";
                      statusColor = "text-red-500";
                    } else if (remaining < 0) {
                      statusText = " (Change)";
                      statusColor = "text-blue-500";
                    } else {
                      statusText = " (Settled)"; // ✅ NEW TERM
                      statusColor = "text-green-600";
                    }

                    return (
                      <span className={`text-lg font-bold ${statusColor}`}>
                        Rs. {remaining.toFixed(2)} {statusText}
                      </span>
                    );
                  })()}
                </div>
              </div>
              <div className="space-y-2 pt-4">
                <button
                  onClick={() => handleSave(returnType)}
                  className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2.5 px-4 rounded-lg transition shadow-sm"
                >
                  {Loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        {InvocieHistory.length > 0 && (
          <div className="mt-6 flex-1 min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 p-5 overflow-x-auto">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
              Return Items
            </h2>
            <div className="w-full">
              <table className="w-full border border-gray-50 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium whitespace-nowrap">
                      Sale Date
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium whitespace-nowrap">
                      Barcode
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium whitespace-nowrap">
                      Product Name
                    </th>
                    <th className="px-4 py-2 text-center text-gray-700 font-medium whitespace-nowrap">
                      Variant
                    </th>
                    <th className="px-4 py-2 text-center text-gray-700 font-medium whitespace-nowrap">
                      Return Qty
                    </th>
                    <th className="px-4 py-2 text-center text-gray-700 font-medium whitespace-nowrap">
                      Original Price
                    </th>
                    <th className="px-4 py-2 text-center text-gray-700 font-medium whitespace-nowrap">
                      Total
                    </th>
                    <th className="px-4 py-2 text-center text-gray-700 font-medium whitespace-nowrap">
                      Action
                    </th>
                    <th className="px-4 py-2 text-center text-gray-700 font-medium whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {InvocieHistory.map((item, index) => (
                    <tr
                      key={item.attributeID}
                      className={`${
                        item.maxQty < item.qty
                          ? "bg-red-50"
                          : "hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <td className="px-4 py-2 text-left text-gray-700 whitespace-nowrap">
                        {item.saleDate.split("T")[0]}
                      </td>
                      <td className="px-4 py-2 text-left text-gray-700 whitespace-nowrap">
                        {item.barcode}
                      </td>
                      <td className="px-4 py-2 text-left text-gray-700 whitespace-nowrap">
                        {item.productName}
                      </td>
                      <td className="px-4 py-2 text-center text-gray-700 whitespace-nowrap">
                        {item.varientValue || "N/A"}
                      </td>
                      <td className="px-4 py-2 text-center text-gray-700 whitespace-nowrap">
                        <input
                          type="number"
                          className="w-20 text-center border rounded-md px-2 py-1 border-gray-200"
                          value={item.qty}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            handleQuantityChange(index, value);
                          }}
                          min={1}
                          max={item.maxQty}
                        />
                      </td>
                      <td className="px-4 py-2 text-center text-gray-700 whitespace-nowrap">
                        Rs. {item.salePrice?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-4 py-2 text-center text-gray-700 whitespace-nowrap font-medium">
                        Rs. {(item.salePrice * item.qty)?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-4 py-2 text-center text-gray-700 whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                          {["refund", "credit", "Exchange"].map((type) => {
                            const isActive = returnType === type;

                            return (
                              <button
                                key={type}
                                onClick={() => {
                                  handleReturnTypeChange(type);
                                  if (type === "Exchange") isOpenReturn(true);
                                }}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
                                  ${
                                    isActive
                                      ? type === "refund"
                                        ? "bg-yellow-500 text-white shadow-md scale-105"
                                        : type === "credit"
                                          ? "bg-green-500 text-white shadow-md scale-105"
                                          : "bg-purple-500 text-white shadow-md scale-105"
                                      : type === "refund"
                                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                        : type === "credit"
                                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                                          : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                                  }
                                `}
                              >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                {isActive && (
                                  <Check size={12} className="inline ml-1" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center text-gray-700 whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              handleRemoveInvoiceItems(item.attributeID)
                            }
                            className="px-3 py-1.5 rounded-md text-white font-semibold bg-red-500  hover:bg-red-600 transition"
                          >
                            <Trash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {returnType === "Exchange" && (
          <>
            {exchangeItems.length > 0 && (
              <div className="mt-6 flex-1 min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 p-5 overflow-x-auto">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                  Exchange Items
                </h2>
                <div className="w-full">
                  <table className="w-full border border-gray-50 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-700 font-medium whitespace-nowrap">
                          Barcode
                        </th>
                        <th className="px-4 py-2 text-left text-gray-700 font-medium whitespace-nowrap">
                          Product Name
                        </th>
                        <th className="px-4 py-2 text-center text-gray-700 font-medium whitespace-nowrap">
                          Variant
                        </th>
                        <th className="px-4 py-2 text-center text-gray-700 font-medium whitespace-nowrap">
                          Qty
                        </th>
                        <th className="px-4 py-2 text-center text-gray-700 font-medium whitespace-nowrap">
                          Original Price
                        </th>
                        <th className="px-4 py-2 text-center text-gray-700 font-medium whitespace-nowrap">
                          Discount
                        </th>
                        <th className="px-4 py-2 text-center text-gray-700 font-medium whitespace-nowrap">
                          Total
                        </th>
                        <th className="px-4 py-2 text-center text-gray-700 font-medium whitespace-nowrap">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {exchangeItems.map((item, index) => (
                        <tr
                          key={item.attributeID}
                          className={`${
                            item.stockQty < item.qty
                              ? "bg-red-50"
                              : "hover:bg-gray-50"
                          } transition-colors`}
                        >
                          <td className="px-4 py-2 text-left text-gray-700 whitespace-nowrap">
                            {item.barcode}
                          </td>
                          <td className="px-4 py-2 text-left text-gray-700 whitespace-nowrap">
                            {item.productName}
                          </td>
                          <td className="px-4 py-2 text-center text-gray-700 whitespace-nowrap">
                            {item.varientValue || "N/A"}
                          </td>
                          <td className="px-4 py-2 text-center text-gray-700 whitespace-nowrap">
                            <input
                              type="number"
                              className="w-20 text-center border rounded-md px-2 py-1 border-gray-200"
                              value={item.qty}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 1;
                                handleQuantityChange(index, value);
                              }}
                              min={1}
                              max={item.stockQty}
                            />
                          </td>
                          <td className="px-4 py-2 text-center text-gray-700 whitespace-nowrap">
                            Rs. {item.price?.toFixed(2) || "0.00"}
                          </td>
                          <td className="px-4 py-2 text-center text-gray-700 whitespace-nowrap font-medium">
                            Rs. {item.discount?.toFixed(2) || "0.00"}
                          </td>
                          <td className="px-4 py-2 text-center text-gray-700 whitespace-nowrap font-medium">
                            Rs.{" "}
                            {item.qty * item.price -
                              (item.discount * (item.qty * item.price)) / 100}
                          </td>
                          <td className="px-4 py-2 text-center text-gray-700 whitespace-nowrap">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() =>
                                  removeItemFromList(item.attributeID)
                                }
                                className="px-3 py-1.5 rounded-md text-white font-semibold bg-red-500  hover:bg-red-600 transition"
                              >
                                <Trash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
