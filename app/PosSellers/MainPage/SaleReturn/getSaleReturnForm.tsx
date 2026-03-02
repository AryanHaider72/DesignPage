"use client";
import GetSalePosReturn from "@/api/lib/PosIntegration/SaleReturn/GetSaleReturn/GetSaleReturn";
import DeleteSalePos from "@/api/lib/PosIntegration/SalesPanel/DeleteSale/DeleteSale";
import {
  GetReturnResponse,
  ReturnSale,
} from "@/api/types/Posintegration/ReturnItem/ReturnItem";
import DeleteComponent from "@/app/UsefullComponent/DeleteComponent/page";
import Spinner from "@/app/UsefullComponent/Spinner/page";
import { List, Receipt, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface SaleGetFromProps {
  showInvocie: (data: boolean) => void;
  reciptData: (data: ReturnSale) => void;
  onListGet: (sale: ReturnSale) => void;
  onShowItemList: (value: boolean) => void;
  onShowMessage: (message: any, type: "success" | "error") => void;
}
export default function GetSaleReturnForm({
  showInvocie,
  reciptData,
  onListGet,
  onShowItemList,
  onShowMessage,
}: SaleGetFromProps) {
  const [isloading, setIsLoading] = useState(false);
  const [SaleList, setSaleList] = useState<ReturnSale[]>([]);
  const [ID, setID] = useState("");
  const [Invoice, setInvoice] = useState("");
  const [Delete, setDelete] = useState(false);

  const saleGetReturn = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("posSellerToken");
      const response = await GetSalePosReturn(String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as GetReturnResponse;
        setSaleList(data.mainList);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    saleGetReturn();
  }, []);

  const FetchData = (ID: string) => {
    const data = SaleList.find((item) => item.saleID === ID);
    if (data) {
      onListGet(data);
    }
  };
  const FetchDataFor = (ID: string) => {
    const data = SaleList.find((item) => item.saleID === ID);
    if (data) {
      reciptData(data);
      showInvocie(true);
    }
  };
  const SaleDelete = async (ID: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("posSellerToken");
      const formData = {
        saleID: ID,
        invoiceNo: Invoice,
      };
      const response = await DeleteSalePos(String(token), formData);
      if (response.status === 200 || response.status === 201) {
        setSaleList((item) => item.filter((emp) => emp.saleID !== ID));
        setDelete(false);
        setID("");
      } else {
        setDelete(false);
        onShowMessage(
          response.message || "An Error Occured while Deleting.",
          "error",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {Delete && (
        <DeleteComponent
          onCancel={() => {
            setDelete(false);
            setID("");
          }}
          onConfirm={() => SaleDelete(ID)}
        />
      )}
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
                        {item.adjustments}
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
                      {item.subList.length > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                          {item.subList.length}
                        </span>
                      )}

                      {/* Icon */}
                      <List />
                    </button>
                    {/* <button
                            title="Edit"
                            className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                            //onClick={() => fetchData(item.expenseID)}
                          >
                            <Pencil />
                          </button> */}
                    <button
                      onClick={() => {
                        FetchDataFor(item.saleID);
                      }}
                      title="Receipt"
                      className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-green-600 border border-green-600 rounded hover:bg-green-50 transition"
                    >
                      <Receipt />
                    </button>
                    <button
                      onClick={() => {
                        setDelete(true);
                        setID(item.saleID);
                        setInvoice(String(item.invoiceNo));
                      }}
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
