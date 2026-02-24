"use client";
import GetSalePos from "@/api/lib/PosIntegration/SalesPanel/SaleGet/SaleGet";
import { responseGetSale, Sale } from "@/api/types/Posintegration/Salespanel";
import Spinner from "@/app/UsefullComponent/Spinner/page";
import { List, Pencil, Receipt, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
interface SaleGetFromProps {
  onListGet: (sale: Sale) => void;
  onShowItemList: (value: boolean) => void;
}
export default function PosSaleGetForm({
  onListGet,
  onShowItemList,
}: SaleGetFromProps) {
  const [isloading, setIsLoading] = useState(false);
  const [showList, setShowList] = useState(false);
  const [SaleList, setSaleList] = useState<Sale[]>([]);

  const saleGet = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("posSellerToken");
      const response = await GetSalePos(String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as responseGetSale;
        setSaleList(data.saleList);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const FetchData = (ID: string) => {
    const data = SaleList.find((item) => item.saleID === ID);
    if (data) {
      onListGet(data);
    }
  };
  useEffect(() => {
    saleGet();
  }, []);
  return (
    <>
      {isloading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <>
          {SaleList.length > 0 ? (
            <div className="space-y-4">
              {SaleList.map((item) => (
                <div
                  key={item.saleID}
                  className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition relative"
                >
                  {/* Left: Till Info */}
                  <div className="flex flex-col">
                    <span className="text-md  text-gray-800">
                      <span className="font-bold">Invoice No: </span>{" "}
                      {item.invoiceNo}
                    </span>
                    <div className="flex flex-col gap-2 mt-1">
                      <span className="text-sm  text-gray-800">
                        <span className="font-bold">Total Bill: </span>{" "}
                        {item.totalBill}
                      </span>
                      <span className="text-sm  text-gray-800">
                        <span className="font-bold"> Amount Paid: </span>{" "}
                        {item.amountPaid}
                      </span>
                      <span className="text-sm  text-gray-800">
                        <span className="font-bold"> Adjustment: </span>{" "}
                        {item.adjustment}
                      </span>
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onShowItemList(true);
                        FetchData(item.saleID);
                      }}
                      title="List"
                      className="relative flex items-center gap-1 px-2 py-1 text-sm font-medium text-yellow-600 border border-yellow-600 rounded hover:bg-yellow-50 transition"
                    >
                      {/* Badge */}
                      {item.itemList.length > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                          {item.itemList.length}
                        </span>
                      )}

                      {/* Icon */}
                      <List />
                    </button>
                    <button
                      title="Edit"
                      className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                      //onClick={() => fetchData(item.expenseID)}
                    >
                      <Pencil />
                    </button>
                    <button
                      // onClick={() => {
                      //   setDelete(true);
                      //   setID(item.expenseID);
                      // }}
                      title="Receipt"
                      className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-green-600 border border-green-600 rounded hover:bg-green-50 transition"
                    >
                      <Receipt />
                    </button>
                    <button
                      // onClick={() => {
                      //   setDelete(true);
                      //   setID(item.expenseID);
                      // }}
                      title="Delete"
                      className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
                    >
                      <Trash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span>No Record Found</span>
          )}
        </>
      )}
    </>
  );
}
