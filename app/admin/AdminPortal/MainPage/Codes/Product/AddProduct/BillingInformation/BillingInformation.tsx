import { useEffect, useState } from "react";

interface ProductInfo {
  supplierID: string;
  invoiceNo: string;
  purchaseDate: string;
  productName: string;
  discount: number;
  threshold: number;
  purchaseAdd: boolean;
  storeSale: string;
  showinAllCountry: boolean;
  feturedProduct: boolean;
  showinCountry: boolean;
  notShowinCountry: boolean;
  description: string;
  listCountry: listCountry[];
}
interface listCountry {
  countryID: string;
  countryName: string;
}
interface CategoryInfo {
  storeID: string;
  length: Number;
  height: Number;
  depth: Number;
  weight: Number;
  categoryID: string;
  unitID: string;
  subCategoryDetailID: string;
  subCategoryID: string;
}
interface listVarient {
  varientName: string;
  varientAttributes: varientAttributes[];
}

interface varientAttributes {
  varientValue: string;
  qty: number;
  costPrice: number;
  salePrice: number;
  barcode: string;
}

interface Imagettype {
  image: File;
}
interface BillingInfomration {
  AmountPaid: number;
  totalBill: number;
  discount: number;
}
interface BillingAddProductProps {
  onEdit: (DataPassed: BillingInfomration) => void;
  productInfo: ProductInfo;
  CategoryInfo: CategoryInfo;
  listVarient: listVarient[];
  Imagettype: Imagettype[];
}
export default function BillingInformation({
  onEdit,
  productInfo,
  listVarient,
}: BillingAddProductProps) {
  const [RemaningBalance, setRemaningBalance] = useState(0);
  const [AmountPaid, setAmountPaid] = useState(0);
  const [Discount, setDiscount] = useState(0);
  const [TotalBill, setTotalBill] = useState(0);

  useEffect(() => {
    const costPrice = listVarient.reduce((total, variant) => {
      return (
        total +
        variant.varientAttributes.reduce((sum, attr) => sum + attr.costPrice, 0)
      );
    }, 0);
    setAmountPaid(costPrice);
    setTotalBill(costPrice);
  }, []);

  useEffect(() => {
    const formData = {
      AmountPaid: AmountPaid,
      totalBill: TotalBill,
      discount: Discount,
    };
    onEdit(formData);
  }, []);
  return (
    <>
      <div className="w-full flex flex-col xl:flex-row gap-6">
        <div className="shadow-md w-1/2  border border-gray-100 rounded-md">
          <h2 className="text-md font-semibold text-gray-700 mb-4 p-2 border-b border-gray-100">
            Billing Summary
          </h2>
          <div className="p-5">
            {/* Discount */}
            <div>
              <label className="mt-2 block text-sm font-medium text-gray-600 mb-1.5">
                Discount
              </label>
              <div className="relative">
                {!productInfo.purchaseAdd ? (
                  <input
                    type="number"
                    value={Discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    disabled
                    className={`w-full ${productInfo.purchaseAdd && "text-gray-400"} pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-right`}
                    placeholder="0.00"
                  />
                ) : (
                  <input
                    type="number"
                    value={Discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-right"
                    placeholder="0.00"
                  />
                )}
              </div>
            </div>

            {/* Amount Paid */}
            <div>
              <label className="mt-2 block text-sm font-medium text-gray-600 mb-1.5">
                Amount Paid
              </label>
              <div className="relative">
                {!productInfo.purchaseAdd ? (
                  <input
                    type="number"
                    value={AmountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    disabled
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-right"
                    placeholder="0.00"
                  />
                ) : (
                  <input
                    type="number"
                    value={AmountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-right"
                    placeholder="0.00"
                  />
                )}
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
                  {(TotalBill - AmountPaid - Discount).toFixed(2) || "0.00"} -/
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="shadow-md w-1/2 xl:w-full border border-gray-100 rounded-md">
          <h2 className="text-md font-semibold text-gray-700 mb-4 p-2 border-b border-gray-100">
            Item Preview
          </h2>
        </div> */}
      </div>
    </>
  );
}
