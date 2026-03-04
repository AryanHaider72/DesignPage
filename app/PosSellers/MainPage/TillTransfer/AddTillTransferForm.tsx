"use client";
import GetTillForPos from "@/api/lib/Admin/TillRegister/TillGet/TillGet";
import GetTillForSalesMan from "@/api/lib/OfflineSeller/MainPage/TillsGet/SalesManTill/SelemanGetTill";
import GetProductSalesMan from "@/api/lib/PosIntegration/ProductSalesMan/GetProductSalesMan/GetProductSalesMan";
import AddTillTransferPosSale from "@/api/lib/PosIntegration/TillTransfer/AddTillTransfer/AddTillTransfer";
import { VariantValue } from "@/api/types/Admin/SearchProduct/SearchProduct";

import { RespiosneGet } from "@/api/types/Admin/TillRegister/TillRegister";
import {
  Product,
  ProductApiResponseSalesMan,
  Variant,
} from "@/api/types/Posintegration/Product/ProductGet";
import { Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
interface newitem {
  barcode: string;
  productName: string;
  varinetName: string;
  attributeID: string;
  qty: number;
}
interface AddReturnForm {
  //   isOpenReturn: (data: boolean) => void;
  //   exchangeItems: newItem[];
  //   removeItem: (data: string) => void;
  //   handleResetNewItem: (data: boolean) => void;
  onShowMessage: (message: any, type: "success" | "error") => void;
}
export default function AddTillTransferForm({ onShowMessage }: AddReturnForm) {
  const [isLoading, setIsLoading] = useState(false);
  const [ShowProduct, setShowProduct] = useState(false);
  const [varinetID, setvarinetID] = useState("");
  const [ProductID, setProductID] = useState("");
  const [attributeID, setAttributeID] = useState("");
  const [StockQuantity, setStockQuantity] = useState(0);
  const [quantity, setquantity] = useState(0);
  const [varinetName, setVarinetName] = useState("");
  const [TillSenderID, setTillSenderID] = useState("");
  const [ProductName, setProductName] = useState("");
  const [TillRecieverID, setTillRecieverID] = useState("");
  const [TillList, setTillList] = useState<TillList[]>([]);
  const [TillList2, setTillList2] = useState<TillList[]>([]);
  const [productList2, setProductList2] = useState<Product[]>([]);
  const [varientList, setVarientList] = useState<Variant[]>([]);
  const [AttributeList, setAttributeList] = useState<VariantValue[]>([]);
  const [Newitems, setNewitem] = useState<newitem[]>([]);

  const getTill = async () => {
    const token = localStorage.getItem("posSellerToken");
    const response = await GetTillForSalesMan(String(token));

    if (response.status === 200) {
      const data = response.data as RespiosneGetTills;
      if (data?.tillList?.length > 0) {
        console.log(data);
        setTillList(data.tillList as unknown as TillList[]);
        setTillSenderID(data.tillList[0].tillID);
      } else {
        setTillList([]);
      }
    }
  };
  const getTillReciever = async () => {
    const token = localStorage.getItem("posSellerToken");
    const response = await GetTillForPos(String(token));

    if (response.status === 200) {
      const data = response.data as RespiosneGet;
      if (data?.tillList?.length > 0) {
        console.log(data);
        setTillList2(data.tillList as unknown as TillList[]);
        setTillRecieverID(data.tillList[0].tillID);
      } else {
        setTillList2([]);
      }
    }
  };

  const getProduct = async () => {
    const token = localStorage.getItem("posSellerToken");

    if (!token) return;

    const response = await GetProductSalesMan(token, TillSenderID, ProductName);

    if (response.status === 200 || response.status === 201) {
      const data = response.data as ProductApiResponseSalesMan;
      setProductList2(data.productList);
      console.log(data.productList);
      setShowProduct(true);
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

  const fetchVarinet = (ID: string) => {
    const data = productList2.find((item) => item.productID === ID);
    if (data) {
      setVarientList(data.varient);
    }
  };
  const fetchAttribute = (ID: string) => {
    const data = varientList.find((item) => item.varientID === ID);
    if (data) {
      setAttributeList(data.varientSubList);
    }
  };
  const fetchQuantity = (ID: string) => {
    const data = AttributeList.find((item) => item.attributeID === ID);
    if (data) {
      setStockQuantity(data.qty);
    }
  };

  const AddTillTransfer = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("posSellerToken");
      const formData = {
        senderID: TillSenderID,
        recieverID: TillRecieverID,
        attributeID: attributeID,
        qty: Number(quantity),
      };
      const response = await AddTillTransferPosSale(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setProductList2([]);
        setProductName("");
        setquantity(0);
        setStockQuantity(0);
        setVarientList([]);
        setAttributeList([]);
        setAttributeID("");
        setvarinetID("");
        onShowMessage(
          response.message || "Customer Added successfully",
          "success",
        );
      } else {
        onShowMessage(response.message, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getTill();
    getTillReciever();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Till Sender
            </label>
            <select
              value={TillSenderID}
              onChange={(e) => {
                setTillSenderID(e.target.value);
              }}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            >
              {TillList.length === 0 ? (
                <option> No Till Found</option>
              ) : (
                <>
                  {TillList.map((item) => (
                    <option key={item.tillID} value={item.tillID}>
                      {item.tillName}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Till Reciever
            </label>
            <select
              value={TillRecieverID}
              onChange={(e) => {
                setTillRecieverID(e.target.value);
              }}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            >
              {TillList2.length === 0 ? (
                <option> No Till Found</option>
              ) : (
                <>
                  {TillList2.map((item) => (
                    <option key={item.tillID} value={item.tillID}>
                      {item.tillName}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
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
                  onBlur={() => setTimeout(() => setShowProduct(false), 100)}
                  onChange={(e) => {
                    setShowProduct(true);
                    setProductName(e.target.value);
                    const data = productList2.find(
                      (item) => item.productName === e.target.value,
                    );
                    if (data) {
                      fetchVarinet(data.productID);
                      setShowProduct(false);
                      setProductID(data.productID);
                    }
                  }}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter product name"
                />
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
                          (item) => item.productName === opt.productName,
                        );
                        if (product) {
                          setShowProduct(false);
                          fetchVarinet(product.productID);
                          setProductID(product.productID);
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
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Varient
            </label>
            <div className="relative">
              <select
                value={varinetID}
                onChange={(e) => {
                  setvarinetID(e.target.value);
                  fetchAttribute(e.target.value);
                }}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
              >
                <option>Select Varient</option>
                {varientList.map((cat) => (
                  <option key={cat.varientID} value={cat.varientID}>
                    {cat.variantName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Sub-Varient
            </label>
            <div className="relative">
              <select
                value={attributeID}
                onChange={(e) => {
                  setAttributeID(e.target.value);
                  fetchQuantity(e.target.value);
                }}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
              >
                <option>Select Sub-Varient</option>
                {AttributeList.map((cat) => (
                  <option key={cat.attributeID} value={cat.attributeID}>
                    {cat.varientValue}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Quantity <span>{StockQuantity}</span>
            </label>
            <div className="flex gap-1">
              <input
                type="number"
                min={0}
                max={StockQuantity}
                value={quantity}
                onChange={(e) => {
                  setquantity(Number(e.target.value));
                }}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter Quantity"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={AddTillTransfer}
              className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
