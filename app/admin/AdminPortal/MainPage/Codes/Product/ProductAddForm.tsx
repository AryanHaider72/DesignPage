"use client";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Info,
} from "lucide-react";
import CategoryInformation from "./CategoryInformation/CategoryInformation";
import ProductInformation from "./ProductInformation/ProductInformation";
import VariantInformation from "./VariantInformation/VariantInformation";
import { useState } from "react";

export default function ProductAddForm() {
  const [currentStep, setCurrentStep] = useState(1);
  return (
    <>
      <ol className="justify-around items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
        {/* Step 1 */}
        <li
          onClick={() => setCurrentStep(1)}
          className={`flex items-center ${currentStep === 1 ? "text-blue-600" : "text-gray-600"} text-blue-600 space-x-3`}
        >
          <span
            className={`flex items-center justify-center w-10 h-10 ${currentStep === 1 ? "bg-blue-100" : "bg-gray-100"} rounded-full lg:h-12 lg:w-12 shrink-0`}
          >
            <Info className="w-5 h-5" />
          </span>
          <span>
            <h3 className="font-medium leading-tight">User info</h3>
            <p className="text-sm text-gray-500">Step details here</p>
          </span>
        </li>

        {/* Step 2 */}
        <li
          onClick={() => setCurrentStep(2)}
          className={`flex items-center ${currentStep === 2 ? "text-blue-600" : "text-gray-600"} text-blue-600 space-x-3`}
        >
          <span
            className={`flex items-center justify-center w-10 h-10 ${currentStep === 2 ? "bg-blue-100" : "bg-gray-100"} rounded-full lg:h-12 lg:w-12 shrink-0`}
          >
            <Building2 className="w-5 h-5" />
          </span>
          <span>
            <h3 className="font-medium leading-tight">Company info</h3>
            <p className="text-sm">Step details here</p>
          </span>
        </li>

        {/* Step 3 */}
        <li
          onClick={() => setCurrentStep(3)}
          className={`flex items-center ${currentStep === 3 ? "text-blue-600" : "text-gray-600"} text-blue-600 space-x-3`}
        >
          <span
            className={`flex items-center justify-center w-10 h-10 ${currentStep === 3 ? "bg-blue-100" : "bg-gray-100"} rounded-full lg:h-12 lg:w-12 shrink-0`}
          >
            <CreditCard className="w-5 h-5" />
          </span>
          <span>
            <h3 className="font-medium leading-tight">Payment info</h3>
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
              <ProductInformation />
            </div>
            <div className="w-full lg:w-1/2 min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                Category Information
              </h2>
              <CategoryInformation />
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
              onClick={() => setCurrentStep(2)}
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
            <VariantInformation />
          </div>
          <div className="flex justify-between items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentStep(1)}
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
              onClick={() => setCurrentStep(3)}
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
    </>
  );
}
