import { Sale } from "@/api/types/Posintegration/Salespanel";

interface GetData {
  SaleItems: Sale[];
}
export default function ShowProductSoldListCall({ SaleItems }: GetData) {
  return (
    <>
      <div className="w-full overflow-x-auto mt-2">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700 font-medium">
                Sale Date
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
            <>
              {SaleItems.map((item) => (
                <>
                  {item.itemList.map((item2) => (
                    <tr key={item2.attributeID} className="border-t">
                      <td className="px-4 py-2 text-left">
                        {item.saleDate.split("T")[0]}
                      </td>
                      <td className="px-4 py-2 text-left">{item2.barcode}</td>
                      <td className="px-4 py-2 text-center">{item2.varinet}</td>
                      <td className="px-4 py-2 text-center">{item2.qty}</td>
                      <td className="px-4 py-2 text-center">{item2.price}</td>
                    </tr>
                  ))}
                </>
              ))}
            </>
          </tbody>
        </table>
      </div>
    </>
  );
}
