import GetTillForSalesMan from "@/api/lib/OfflineSeller/MainPage/TillsGet/SalesManTill/SelemanGetTill";
import GetProductVarient from "@/api/lib/PosIntegration/ProductSalesMan/FetchProductVarient/FetchProductVarinet";
import GetProductSalesMan from "@/api/lib/PosIntegration/ProductSalesMan/GetProductSalesMan/GetProductSalesMan";
import GetProductBarcode from "@/api/lib/PosIntegration/ProductSalesMan/SearchByBarcode/SearchByBarcode";
import {
  Product,
  ProductApiResponseSalesMan,
  varinetMessage,
} from "@/api/types/Posintegration/Product/ProductGet";
import { Plus, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";

interface AddReturnForm {
  isOpenReturn: (data: boolean) => void;
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
interface ProductApiResponseBarcode {
  messaga: string;
  productList: BarcodeResposne[];
}
type BarcodeResposne = {
  productID: string;
  barcode: string;
  productName: string;
  attributeID: string;
  varientValue: string;
  costPrice: number;
  salePrice: number;
  qty: number;
};
interface VarintList {
  productName: string;
  varientID: string;
  variantName: string;
  discount: number;
  variantValues: variantValues[];
}
interface variantValues {
  attributeID: string;
  varientValue: string;
  costPrice: number;
  salePrice: number;
  qty: number;
  barcode: string;
}
export default function AddReturnItemtoSaleform({
  isOpenReturn,
}: AddReturnForm) {
  const [Barcode, setBarcode] = useState("");
  const [showVareintList, setShowVareintList] = useState(false);
  const [ProductName, setProductName] = useState("");
  const [newItem, setNewItem] = useState<newItem[]>([]);
  const [TillID, setTillID] = useState("");
  const [productList2, setProductList2] = useState<Product[]>([]);
  const [ShowProduct, setShowProduct] = useState(false);
  const [TillList, setTillList] = useState<TillList[]>([]);
  const [varientID, setVarientID] = useState("");
  const [attributeID, setattributeID] = useState("");
  const [VarintListInPopUp, setVarintListInPopUp] = useState<VarintList[]>([]);
  const [AttribuetListInPopUp, setAttribuetListInPopUp] = useState<
    variantValues[]
  >([]);

  const getProductBarcode = async (barcode: string) => {
    const token = localStorage.getItem("posSellerToken");

    if (!token) return;

    const response = await GetProductBarcode(token, barcode);

    if (response.status === 200 || response.status === 201) {
      const data = response.data as ProductApiResponseBarcode;
      const newData = data.productList[0];
      const mappedData: newItem = {
        attributeID: newData.attributeID,
        productName: newData.productName,
        qty: 1,
        varientValue: newData.varientValue,
        price: newData.salePrice,
        barcode: newData.barcode,
        stockQty: newData.qty,
        discount: 0,
      };
      addOrIncreaseQty(mappedData);
    }
  };
  const addOrIncreaseQty = (item: newItem) => {
    setNewItem((prev) => {
      const existingIndex = prev.findIndex(
        (p) => p.attributeID === item.attributeID,
      );

      if (existingIndex !== -1) {
        return prev.map((p, index) =>
          index === existingIndex ? { ...p, qty: p.qty + 1 } : p,
        );
      }
      setBarcode("");
      return [...prev, { ...item, qty: item.qty ?? 1 }];
    });
  };

  const onQtyChange = (ID: string, value: number) => {
    setNewItem((prev) =>
      prev.map((item) =>
        item.attributeID === ID ? { ...item, qty: value } : item,
      ),
    );
  };
  const onOriginalChange = (ID: string, value: number) => {
    setNewItem((prev) =>
      prev.map((item) =>
        item.attributeID === ID ? { ...item, price: value } : item,
      ),
    );
  };
  const varinetList = async (ID: string) => {
    const token = localStorage.getItem("posSellerToken");
    const response = await GetProductVarient(String(token), ID);
    if (response.status === 200 || response.status === 201) {
      const data = response.data as varinetMessage;
      if (data.variants.length > 0) {
        setShowVareintList(true);
        setVarintListInPopUp(data.variants);
      } else {
        setShowVareintList(false);
        setVarintListInPopUp([]);
      }
    }
  };
  const removeItem = (attribuetID: string) => {
    setNewItem((item) =>
      item.filter((item2) => item2.attributeID !== attribuetID),
    );
  };
  const getTill = async () => {
    const token = localStorage.getItem("posSellerToken");
    const response = await GetTillForSalesMan(String(token));

    if (response.status === 200) {
      const data = response.data as RespiosneGetTills;
      if (data?.tillList?.length > 0) {
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
    } else {
      setProductList2([]);
    }
  };
  const AttriubuetList = (ID: string) => {
    const data = VarintListInPopUp.find((item) => item.varientID);
    if (data) {
      setAttribuetListInPopUp(
        data.variantValues.map((item) => ({
          attributeID: item.attributeID,
          varientValue: item.varientValue,
          costPrice: item.costPrice,
          salePrice: item.salePrice,
          qty: item.qty,
          barcode: item.barcode,
        })),
      );
    }
  };

  const handleAddEvent = () => {
    const data = AttribuetListInPopUp.find(
      (item) => item.attributeID === attributeID,
    );
    const varient = VarintListInPopUp.find(
      (item) => item.varientID === varientID,
    );
    if (!data || !varient) return alert("Could Not Add Item");
    const newEntry: newItem = {
      attributeID: data.attributeID,
      productName: varient.productName,
      qty: 1,
      varientValue: data.varientValue,
      price: data.salePrice,
      barcode: data.barcode,
      stockQty: data.qty,
      discount: varient.discount,
    };
    setNewItem((prev) => [...prev, newEntry]);
    setProductName("");
    setVarintListInPopUp([]);
    setAttribuetListInPopUp([]);
  };
  useEffect(() => {
    if (!ProductName || ProductName.trim().length === 0) return;

    const delayDebounce = setTimeout(() => {
      getProduct();
    }, 50);

    return () => clearTimeout(delayDebounce);
  }, [ProductName]);
  useEffect(() => {
    if (Barcode) {
      getProductBarcode(Barcode);
    }
  }, [Barcode]);
  useEffect(() => {
    getTill();
  }, []);
  return (
    <>
      <div className="fixed inset-0 z-[50] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Modal - centered */}
        <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-5xl mx-auto max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => isOpenReturn(false)}
            title="Close"
            className=" w-full rounded-full  flex items-end justify-end transition group"
          >
            <X className="w-7 h-7 text-gray-500 group-hover:text-red-500 transition cursor-pointer" />
          </button>
          <>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Barcode
              </label>
              <input
                type="text"
                value={Barcode}
                onChange={(e) => {
                  setBarcode(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") getProductBarcode(Barcode);
                }}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter barcode"
              />
            </div>
            <div className="flex gap-2 mb-3">
              <div className="w-full">
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
                          varinetList(data.productID);
                        }
                      }}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                              varinetList(product.productID);
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
                    value={varientID}
                    onChange={(e) => {
                      (AttriubuetList(e.target.value),
                        setVarientID(e.target.value));
                    }}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
                  >
                    <option>Select Varient</option>
                    {VarintListInPopUp.map((cat) => (
                      <option key={cat.varientID} value={cat.varientID}>
                        {cat.variantName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="w-full mb-3">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Attribute
              </label>
              <div className="flex gap-1">
                <select
                  value={attributeID}
                  onChange={(e) => setattributeID(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
                >
                  <option>Select Attribute</option>
                  {AttribuetListInPopUp.map((cat) => (
                    <option key={cat.attributeID} value={cat.attributeID}>
                      {cat.varientValue}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleAddEvent()}
                  className="px-2 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-md text-white"
                >
                  <Plus />
                </button>
              </div>
            </div>
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
                  {newItem.length > 0 ? (
                    <>
                      {newItem.map((item, index) => (
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
                                onClick={() => removeItem(item.attributeID)}
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
          </>
        </div>
        <button></button>
      </div>
    </>
  );
}
