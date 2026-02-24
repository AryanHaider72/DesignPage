"use client";
import MessagePopUp from "@/app/UsefullComponent/MessagePopup/page";
import { List, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import PosSaleAddForm from "./PosSaleAddForm";
import ShowReturnItemsList from "./ShowReturnListItem/page";
import GetProductVarient from "@/api/lib/PosIntegration/ProductSalesMan/FetchProductVarient/FetchProductVarinet";
import { varinetMessage } from "@/api/types/Posintegration/Product/ProductGet";
import ShowVarientItems from "./ShowVarientItems/page";
import GetProductBarcode from "@/api/lib/PosIntegration/ProductSalesMan/SearchByBarcode/SearchByBarcode";
import PosSaleGetForm from "./PosSaleGetForm";
import { Sale } from "@/api/types/Posintegration/Salespanel";
import ShowProductSoldListCall from "./ShowProductSoldList/ShowProductSoldList";

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
export default function PosSaleModule() {
  //const [ExpenseList, setExpenseList] = useState<ExpenseData>();
  const [showReturnList, setShowReturnList] = useState(false);
  const [showVareintList, setShowVareintList] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [Update, setUpdate] = useState(false);
  const [newItem, setNewItem] = useState<newItem[]>([]);
  const [productID, setProductID] = useState("");
  const [AttributeID, setAttributeID] = useState("");
  const [barcode, setbarcode] = useState("");
  const [reset, setReset] = useState(false);
  const [SaleList2, setSaleList2] = useState<Sale>();
  const [ShowProductSoldList, setShowProductSoldList] = useState(false);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [view, setView] = useState<"list" | "form">("list");
  const [VarintListInPopUp, setVarintListInPopUp] = useState<VarintList[]>([]);

  useEffect(() => {
    if (productID) {
      varinetList(productID);
    }
  }, [productID]);

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
  useEffect(() => {
    if (reset) {
      setNewItem([]);
    }
  }, [reset]);

  useEffect(() => {
    if (barcode) {
      getProductBarcode(barcode);
    }
  }, [barcode]);

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

      return [...prev, { ...item, qty: item.qty ?? 1 }];
    });
  };
  useEffect(() => {
    if (AttributeID) {
      removeItem(AttributeID);
    }
  }, [AttributeID]);
  const removeItem = (AttributeID: string) => {
    const data = newItem.filter((item) => item.attributeID !== AttributeID);
    setNewItem(data);
  };

  return (
    <>
      {showMessage && (
        <MessagePopUp
          message={showMessage}
          type={messageType}
          duration={3000}
          onClose={() => setShowMessage(null)}
        />
      )}
      <div className="space-y-6">
        {/* Top Buttons */}
        <div className="w-full bg-gray-50 shadow-sm flex justify-between px-1 py-2 rounded-lg">
          <button
            onClick={() => {
              setView("list");
              setUpdate(false);
              //setExpenseList(undefined);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition
            ${view === "list" ? "bg-neutral-900 text-white" : "bg-white text-neutral-900 shadow hover:shadow-lg"}`}
          >
            <List size={18} />
            Show List
          </button>

          <button
            onClick={() => setView("form")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition
            ${view === "form" ? "bg-neutral-900 text-white" : "bg-white text-neutral-900 shadow hover:shadow-lg"}`}
          >
            <Plus size={18} />
            Add New
          </button>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Sale Management
          </h1>
        </div>
        {showReturnList && (
          <div className="fixed inset-0 w-full  h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm z-100">
            <div className="bg-white  rounded-2xl shadow-lg p-6 w-full max-w-4xl ">
              <ShowReturnItemsList
                onToggleReturnList={setShowReturnList}
                onAddReturnItem={addOrIncreaseQty}
              />
            </div>
          </div>
        )}
        {showVareintList && (
          <div className="fixed inset-0 w-full  h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm z-100">
            <div className="bg-white  rounded-2xl shadow-lg p-6 w-full max-w-4xl ">
              <ShowVarientItems
                onToggleVarientList={setShowVareintList}
                VarintListInPopUp={VarintListInPopUp}
                onAddVarientItem={addOrIncreaseQty}
              />
            </div>
          </div>
        )}
        {ShowProductSoldList && (
          <div className="fixed inset-0 w-full  h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm z-100">
            <div className="bg-white  rounded-2xl shadow-lg p-6 w-full max-w-4xl ">
              <div className="flex w-full justify-end">
                <button
                  onClick={() => {
                    setShowProductSoldList(false);
                  }}
                  className="text-right text-gray-600 hover:text-red-500"
                >
                  <X />
                </button>
              </div>
              <ShowProductSoldListCall
                SaleItems={SaleList2 ? [SaleList2] : []}
              />
            </div>
          </div>
        )}

        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <PosSaleAddForm
              onToggleReturnList={setShowReturnList}
              returnItemData={newItem}
              onToggleProductID={setProductID}
              onToggleVarientLIstShow={setShowVareintList}
              onToggleAttribuetID={setAttributeID}
              onQtyChange={(attributeID, qty) => {
                setNewItem((prev) =>
                  prev.map((item) =>
                    item.attributeID === attributeID ? { ...item, qty } : item,
                  ),
                );
              }}
              onOriginalChange={(attributeID, price) => {
                setNewItem((prev) =>
                  prev.map((item) =>
                    item.attributeID === attributeID
                      ? { ...item, price }
                      : item,
                  ),
                );
              }}
              BarcodeValue={setbarcode}
              resetReturnItemList={setReset}
            />
          )}
          {view === "list" && (
            <PosSaleGetForm
              onListGet={setSaleList2}
              onShowItemList={setShowProductSoldList}
            />
          )}
        </div>
      </div>
    </>
  );
}
