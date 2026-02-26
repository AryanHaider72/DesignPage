"use client";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Image,
  Info,
} from "lucide-react";
import CategoryInformation from "./CategoryInformation/CategoryInformation";
import ProductInformation from "./ProductInformation/ProductInformation";
import VariantInformation from "./VariantInformation/VariantInformation";
import { useEffect, useState } from "react";
import ImageControllerInformartion from "./ImageControllerInformartion/ImageControllerInformartion";
import BillingInformation from "./BillingInformation/BillingInformation";

interface ProductInfo {
  supplierID: string;
  invoiceNo: string;
  purchaseDate: string;
  productName: string;
  discount: number;
  threshold: number;
  storeSale: string;
  purchaseAdd: boolean;
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

export default function ProductAddForm() {
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    supplierID: "",
    invoiceNo: "",
    purchaseDate: "",
    productName: "",
    discount: 0,
    threshold: 0,
    storeSale: "OnlineStore",
    showinAllCountry: true,
    feturedProduct: false,
    showinCountry: false,
    notShowinCountry: false,
    description: "",
    purchaseAdd: false,
    listCountry: [],
  });
  const [CategoryInfo, setCategoryInfo] = useState<CategoryInfo>({
    storeID: "",
    length: 0,
    height: 0,
    depth: 0,
    weight: 0,
    categoryID: "",
    unitID: "",
    subCategoryDetailID: "",
    subCategoryID: "",
  });
  const [Varientnfo, setVarientnfo] = useState<listVarient[]>([]);
  const [images, setImages] = useState<Imagettype[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [Step1Completed, setStep1Completed] = useState(false);
  const [Step2Completed, setStep2Completed] = useState(false);
  const [Step3Completed, setStep3Completed] = useState(false);
  const [Step4Completed, setStep4Completed] = useState(false);

  return (
    <>
      <ol className="justify-around items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
        {/* Step 1 */}
        <li
          onClick={() => setCurrentStep(1)}
          className={`flex items-center ${currentStep === 1 ? "text-blue-600" : "text-gray-600"} text-blue-600 space-x-3 cursor-pointer`}
        >
          <span
            className={`flex items-center justify-center w-10 h-10 ${currentStep === 1 ? "bg-blue-100" : "bg-gray-100"} ${Step1Completed ? "bg-green-500" : "bg-blue-100"} rounded-full lg:h-12 lg:w-12 shrink-0`}
          >
            {!Step1Completed ? (
              <Info className="w-5 h-5" />
            ) : (
              <Check
                className={`${Step1Completed ? "text-white text-lg" : ""} w-5 h-5`}
              />
            )}
          </span>
          <span>
            <h3 className="font-medium leading-tight">Basic info</h3>
            <p className="text-sm text-gray-500">Step details here</p>
          </span>
        </li>

        {/* Step 2 */}
        <li
          onClick={() => setCurrentStep(2)}
          className={`flex items-center ${currentStep === 2 ? "text-blue-600" : "text-gray-600"} text-blue-600 space-x-3 cursor-pointer`}
        >
          <span
            className={`flex items-center justify-center w-10 h-10 ${currentStep === 2 ? "bg-blue-100" : "bg-gray-100"}  ${Step2Completed ? "bg-green-500" : "bg-blue-100"} rounded-full lg:h-12 lg:w-12 shrink-0`}
          >
            {!Step2Completed ? (
              <Building2 className="w-5 h-5" />
            ) : (
              <Check
                className={`${Step2Completed ? "text-white text-lg" : ""} w-5 h-5`}
              />
            )}
          </span>
          <span>
            <h3 className="font-medium leading-tight">Variant info</h3>
            <p className="text-sm">Step details here</p>
          </span>
        </li>

        {/* Step 3 */}
        <li
          onClick={() => setCurrentStep(3)}
          className={`flex items-center ${currentStep === 3 ? "text-blue-600" : "text-gray-600"} text-blue-600 space-x-3 cursor-pointer`}
        >
          <span
            className={`flex items-center justify-center w-10 h-10 ${currentStep === 3 ? "bg-blue-100" : "bg-gray-100"}  ${Step3Completed ? "bg-green-500" : "bg-blue-100"} rounded-full lg:h-12 lg:w-12 shrink-0`}
          >
            {!Step3Completed ? (
              <Image className="w-5 h-5" />
            ) : (
              <Check
                className={`${Step3Completed ? "text-white text-lg" : ""} w-5 h-5`}
              />
            )}
          </span>
          <span>
            <h3 className="font-medium leading-tight">Image info</h3>
            <p className="text-sm">Step details here</p>
          </span>
        </li>
        <li
          onClick={() => setCurrentStep(4)}
          className={`flex items-center ${currentStep === 4 ? "text-blue-600" : "text-gray-600"} text-blue-600 space-x-3 cursor-pointer`}
        >
          <span
            className={`flex items-center justify-center w-10 h-10 ${currentStep === 4 ? "bg-blue-100" : "bg-gray-100"} ${Step4Completed ? "bg-green-500" : "bg-blue-100"} rounded-full lg:h-12 lg:w-12 shrink-0`}
          >
            {!Step4Completed ? (
              <CreditCard className="w-5 h-5" />
            ) : (
              <Check
                className={`${Step4Completed ? "text-white text-lg" : ""} w-5 h-5`}
              />
            )}
          </span>
          <span>
            <h3 className="font-medium leading-tight">Billing info</h3>
            <p className="text-sm">Step details here</p>
          </span>
        </li>
      </ol>
      {currentStep === 1 && (
        <>
          <div className="mt-10 flex flex-col lg:flex-row gap-6 w-full">
            <div className="w-full lg:w-1/2 min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                Product Information
              </h2>
              <ProductInformation
                values={productInfo}
                onEdit={(data: ProductInfo) => {
                  setProductInfo(data);
                }}
              />
            </div>
            <div className="w-full lg:w-1/2 min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                Category Information
              </h2>
              <CategoryInformation
                values={CategoryInfo}
                onEdit={(data: CategoryInfo) => {
                  setCategoryInfo(data);
                }}
              />
            </div>
          </div>
          <div className="flex justify-between items-center gap-4 mt-8">
            <button
              className={`
      px-6 py-2.5 rounded-lg font-medium transition-all duration-200
      flex items-center gap-2 group
      ${
        currentStep === 1
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow"
      }
        `}
              disabled={currentStep === 1}
            >
              <ChevronLeft
                className={`w-4 h-4 transition-transform duration-200 ${currentStep !== 1 ? "group-hover:-translate-x-1" : ""}`}
              />
              Previous
            </button>

            <button
              onClick={() => {
                setCurrentStep(2);
                setStep1Completed(true);
                setStep2Completed(false);
                setStep3Completed(false);
                setStep4Completed(false);
              }}
              className={`
      px-6 py-2.5 rounded-lg font-medium transition-all duration-200
      flex items-center gap-2 group
      ${
        currentStep === 1
          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:scale-105"
          : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105"
      }
            `}
            >
              Next
              <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </>
      )}
      {currentStep === 2 && (
        <div className="w-full  mx-auto p-6  min-h-screen">
          <div className="w-full min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
              Variant Information
            </h2>
            <VariantInformation values={Varientnfo} onEdit={setVarientnfo} />
          </div>
          <div className="flex justify-between items-center gap-4 mt-8">
            <button
              onClick={() => {
                setCurrentStep(1);
                setStep1Completed(false);
                setStep2Completed(false);
                setStep3Completed(false);
                setStep4Completed(false);
              }}
              className={`
      px-6 py-2.5 rounded-lg font-medium transition-all duration-200
      flex items-center gap-2 group
      bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow
    `}
            >
              <ChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Previous
            </button>

            <button
              onClick={() => {
                console.log(Varientnfo);
                setCurrentStep(3);
                setStep1Completed(true);
                setStep2Completed(true);
                setStep3Completed(false);
                setStep4Completed(false);
              }}
              className={`
      px-6 py-2.5 rounded-lg font-medium transition-all duration-200
      flex items-center gap-2 group
      ${
        currentStep === 2
          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:scale-105"
          : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105"
      }
    `}
            >
              Next
              <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}
      {currentStep === 3 && (
        <div className="w-full  mx-auto p-6  min-h-screen">
          <div className="w-full min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
              Image Information
            </h2>
            <ImageControllerInformartion values={images} onEdit={setImages} />
          </div>
          <div className="flex justify-between items-center gap-4 mt-8">
            <button
              onClick={() => {
                setCurrentStep(2);
                setStep1Completed(true);
                setStep2Completed(false);
                setStep3Completed(false);
                setStep4Completed(false);
              }}
              className={`
      px-6 py-2.5 rounded-lg font-medium transition-all duration-200
      flex items-center gap-2 group
      bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow
    `}
            >
              <ChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Previous
            </button>

            <button
              onClick={() => {
                setCurrentStep(4);
                setStep1Completed(true);
                setStep2Completed(true);
                setStep3Completed(true);
                setStep4Completed(false);
              }}
              className={`
      px-6 py-2.5 rounded-lg font-medium transition-all duration-200
      flex items-center gap-2 group
      ${
        currentStep === 3
          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:scale-105"
          : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105"
      }
    `}
            >
              Next
              <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}
      {currentStep === 4 && (
        <div className="w-full  mx-auto p-6  min-h-screen">
          <div className="w-full min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
              Billing Information
            </h2>
            <BillingInformation
              productInfo={productInfo}
              CategoryInfo={CategoryInfo}
              listVarient={Varientnfo}
              Imagettype={images}
            />{" "}
          </div>
          <div className="flex justify-between items-center gap-4 mt-8">
            <button
              onClick={() => {
                setCurrentStep(3);
                setStep1Completed(true);
                setStep2Completed(true);
                setStep3Completed(false);
                setStep4Completed(false);
              }}
              className={`
      px-6 py-2.5 rounded-lg font-medium transition-all duration-200
      flex items-center gap-2 group
      bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow
    `}
            >
              <ChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Previous
            </button>

            <button
              //onClick={() => setCurrentStep()}
              className={`
      px-6 py-2.5 rounded-lg font-medium transition-all duration-200
      flex items-center gap-2 group
      ${
        currentStep === 4
          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:scale-105"
          : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105"
      }
    `}
            >
              Next
              <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
