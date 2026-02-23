"use client";
import GetSalePosInvoice from "@/api/lib/PosIntegration/SalesPanel/SaleGetInvoice/SaleGetInvoice";
import SearchByInvoice from "@/api/lib/PosIntegration/SearchHistory/SearchByInvoice/SearchInvocie";
import { responseGetSale, Sale } from "@/api/types/Posintegration/Salespanel";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

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

interface ShowSaleForm {
  onToggleReturnList: (value: boolean) => void;
  onAddReturnItem: (item: newItem) => void;
}
export default function ShowReturnItemsList({
  onToggleReturnList,
  onAddReturnItem,
}: ShowSaleForm) {
  const [selectedOption, setSelectedOption] = useState("inovice");
  const [CustomerName, setCustomerName] = useState("");
  const [inoviceNo, setInvoiceNo] = useState("");
  const [ProductName, setProductName] = useState("");
  const [open, setOpen] = useState(false);

  const [SaleList, setSaleList] = useState<Sale[]>([]);
  const [InvocieHistory, setInvocieHistory] = useState<historyData[]>([]);
  const [newItem, setNewItem] = useState<newItem[]>([]);

  const saleGet = async () => {
    const token = localStorage.getItem("posSellerToken");
    const response = await GetSalePosInvoice(String(token));
    if (response.status === 200 || response.status === 201) {
      const data = response.data as responseGetSale;
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
        setInvocieHistory(data.showHistory || []);
        setCustomerName(data.showHistory[0].customerName);
      }
    }
  };

  const handleAddtoList = (attributeID: string) => {
    // find item
    const data = InvocieHistory.find(
      (item) => item.attributeID === attributeID,
    );
    if (!data) return;

    const newEntry: newItem = {
      attributeID: data.attributeID,
      productName: data.productName,
      qty: -1, // negative for return
      varientValue: data.varientValue,
      price: data.salePrice,
      barcode: data.barcode,
      stockQty: Math.abs(data.qty),
      discount: 0,
    };

    onAddReturnItem(newEntry);
  };
  useEffect(() => {
    saleGet();
  }, []);

  const filteredOptions = SaleList.filter((opt) =>
    String(opt.invoiceNo).includes(inoviceNo.toLowerCase()),
  );
  return (
    <>
      <div className="flex w-full justify-end">
        <button
          onClick={() => {
            onToggleReturnList(false);
          }}
          className="text-right text-gray-600 hover:text-red-500"
        >
          <X />
        </button>
      </div>
      <div className="p-1 rounded-xl w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Search By</h2>
        <div className="flex flex-wrap gap-4 ">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="inline-radio"
              value="inovice"
              checked={selectedOption === "inovice"}
              onChange={(e) => {
                setSelectedOption(e.target.value);
                // setProductID("");
                // setInvocieHistory([]);
              }}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700 text-sm font-medium">
              Invoice No
            </span>
          </label>
          {/* Option 1 */}
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="inline-radio"
              value="product"
              checked={selectedOption === "product"}
              onChange={(e) => {
                setSelectedOption(e.target.value);
                // setInvoiceNo("");
                // setInvocieHistory([]);
              }}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700 text-sm font-medium">
              Product
            </span>
          </label>

          {/* Option 2 */}
        </div>
      </div>
      <div className="flex w-full gap-2 mt-2 ">
        {selectedOption === "inovice" ? (
          <div className="w-full">
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
                setOpen(true);
                getInvoiceHistory(value);
              }}
              placeholder="Invoice No"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
             focus:ring-2 focus:ring-blue-500 focus:border-blue-500
             outline-none transition"
            />
            {open && filteredOptions.length > 0 && (
              <ul className="relative  w-full bg-white border border-neutral-200 rounded mt-1 shadow-sm max-h-40 overflow-auto">
                {filteredOptions.map((opt, index) => (
                  <li
                    key={index}
                    onMouseDown={() => {
                      setInvoiceNo(String(opt.invoiceNo));
                      getInvoiceHistory(String(opt.invoiceNo));
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
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Product Name
            </label>
            <input
              type="text"
              value={ProductName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Product Name"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        )}
        <div className="w-full">
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
      </div>
      <div className="w-full overflow-x-auto mt-2">
        <table className="w-full border border-gray-50 rounded-lg overflow-hidden ">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700 font-medium">
                Sale Date
              </th>
              <th className="px-4 py-2 text-left text-gray-700 font-medium">
                Barcode
              </th>
              <th className="px-4 py-2 text-left text-gray-700 font-medium">
                Product Name
              </th>
              <th className="px-4 py-2 text-center text-gray-700 font-medium">
                Variant
              </th>
              <th className="px-4 py-2 text-center text-gray-700 font-medium">
                Quantity
              </th>
              <th className="px-4 py-2 text-center text-gray-700 font-medium">
                Orignal Price
              </th>
              <th className="px-4 py-2 text-center text-gray-700 font-medium">
                Total Bill
              </th>
              <th className="px-4 py-2 text-center text-gray-700 font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {InvocieHistory.map((item, index) => (
              <tr
                key={item.attributeID}
                className={`${item.maxQty < item.qty && "bg-red-200"}`}
              >
                <td className="px-4 py-2 text-left text-gray-700 font-medium">
                  {item.saleDate.split("T")[0]}
                </td>
                <td className="px-4 py-2 text-left text-gray-700 font-medium">
                  {item.barcode}
                </td>
                <td className="px-4 py-2 text-left text-gray-700 font-medium">
                  {item.productName}
                </td>
                <td className="px-4 py-2 text-center text-gray-700 font-medium">
                  {item.varientValue}
                </td>

                {/* Editable Quantity */}
                <td className="px-4 py-2 text-center text-gray-700 font-medium">
                  <input
                    type="number"
                    className="w-16 text-center border rounded-md px-1 py-1"
                    value={item.qty}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setNewItem((prev) =>
                        prev.map((itm, i) =>
                          i === index ? { ...itm, qty: value } : itm,
                        ),
                      );
                    }}
                  />
                </td>
                {/* Editable Original Price */}
                <td className="px-4 py-2 text-center text-gray-700 font-medium">
                  {item.salePrice}
                </td>

                {/* Total Bill */}
                <td className="px-4 py-2 text-center text-gray-700 font-medium">
                  {item.salePrice * item.qty}
                </td>

                {/* Action */}
                <td className="px-4 py-2 text-center text-gray-700 font-medium">
                  <button
                    onClick={() => handleAddtoList(item.attributeID)}
                    className="px-2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
                  >
                    <Plus />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
