import { Sale, SaleItem } from "@/api/types/Posintegration/Salespanel";
import { useEffect, useState } from "react";

interface GetData {
  SaleItems: Sale[];
}
export default function ShowProductSoldListCall({ SaleItems }: GetData) {
  const [list, setList] = useState<SaleItem[]>([]);
  useEffect(() => {
    const data = SaleItems[0].itemList;
    setList(data);
  }, [SaleItems]);
  return (
    <>
      <div className="w-full overflow-x-auto mt-2">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700 font-medium">
                Date
              </th>
              <th className="px-4 py-2 text-left text-gray-700 font-medium">
                Barcode
              </th>
              <th className="px-4 py-2 text-center text-gray-700 font-medium">
                Variant
              </th>
              <th className="px-4 py-2 text-center text-gray-700 font-medium">
                Quantity
              </th>
              <th className="px-4 py-2 text-center text-gray-700 font-medium">
                Original Price
              </th>
            </tr>
          </thead>
          <tbody>
            {list?.map((item2, index) => (
              <tr
                key={index}
                className={`border-t ${item2.qty < 0 ? "bg-red-100" : ""}`}
              >
                <td className="px-4 py-2 text-left">
                  {SaleItems[0].saleDate.split("T")[0]}
                </td>
                <td className="px-4 py-2 text-left">{item2.barcode}</td>
                <td className="px-4 py-2 text-center">{item2.varinet}</td>
                <td className="px-4 py-2 text-center">{item2.qty}</td>
                <td className="px-4 py-2 text-center">{item2.price}</td>
              </tr>
            ))}
            {/* {SaleItems.item.itemList.map((item2) => (
                    <tr key={item2.attributeID} className="border-t">
                      <td className="px-4 py-2 text-left">
                        {item.saleDate.split("T")[0]}
                      </td>
                      <td className="px-4 py-2 text-left">{item2.barcode}</td>
                      <td className="px-4 py-2 text-center">{item2.varinet}</td>
                      <td className="px-4 py-2 text-center">{item2.qty}</td>
                      <td className="px-4 py-2 text-center">{item2.price}</td>
                    </tr>
                  ))} */}
          </tbody>
        </table>
      </div>
    </>
  );
}
