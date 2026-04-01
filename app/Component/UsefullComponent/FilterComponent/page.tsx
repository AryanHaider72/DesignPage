"use client";
import { categoryList } from "@/api/types/Customer/LandingPage/Category/GetCategroy";
import { useAppContext } from "@/app/useContext";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface FilterComponent {
  subCategoryID: (subCategoryID: string) => void;
  onSubCategoryDetailsChange?: (selectedIds: string[]) => void; // New prop for checkbox selections
  ReturnSubCategroy: string;
  selectedSubCategoryDetails?: string[]; // Selected checkbox IDs from parent
}

export default function FilterComponent({
  subCategoryID,
  onSubCategoryDetailsChange,
  ReturnSubCategroy,
  selectedSubCategoryDetails = [],
}: FilterComponent) {
  const { categoryList } = useAppContext();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    selectedSubCategoryDetails,
  );

  const handleSubCategoryChange = (id: string) => {
    const updated = selectedSubCategories.includes(id)
      ? selectedSubCategories.filter((i) => i !== id)
      : [...selectedSubCategories, id];

    setSelectedSubCategories(updated);

    // Pass the selected IDs back to parent
    if (onSubCategoryDetailsChange) {
      onSubCategoryDetailsChange(updated);
    }
  };

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    if (ReturnSubCategroy) {
      setSelectedCategoryId(ReturnSubCategroy);
    } else if (categoryList.length > 0) {
      setSelectedCategoryId(categoryList[0].subCategoryID);
    }
  }, [categoryList, ReturnSubCategroy]);

  // Clear all selected subcategories
  const clearAllFilters = () => {
    setSelectedSubCategories([]);
    if (onSubCategoryDetailsChange) {
      onSubCategoryDetailsChange([]);
    }
  };

  return (
    <>
      <div className="w-full h-[100vh] flex flex-col p-5 rounded-2xl">
        <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
          {/* === Main Categories Accordion === */}
          <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
            <button
              type="button"
              onClick={() => toggleAccordion(0)}
              className="flex items-center justify-between w-full p-4 font-semibold text-gray-800 hover:bg-gray-50 transition-all"
            >
              Categories
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${
                  activeIndex === 0 ? "rotate-180" : ""
                }`}
              />
            </button>
            {activeIndex === 0 && (
              <div className="p-4 border-t border-gray-100">
                {categoryList.map((cat) => (
                  <label
                    key={cat.subCategoryID}
                    className="flex items-center gap-3 mb-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategoryId === cat.subCategoryID}
                      onChange={() => {
                        setSelectedCategoryId(cat.subCategoryID);
                        subCategoryID(cat.subCategoryID);
                        // Clear subcategory selections when main category changes
                        setSelectedSubCategories([]);
                        if (onSubCategoryDetailsChange) {
                          onSubCategoryDetailsChange([]);
                        }
                      }}
                      className="w-5 h-5 rounded accent-gray-900"
                    />
                    <span className="text-lg">{cat.subCategoryName}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* === Subcategories Accordion === */}
          {selectedCategoryId &&
            (() => {
              const selectedCategory = categoryList.find(
                (cat) => cat.subCategoryID === selectedCategoryId,
              );

              if (
                !selectedCategory ||
                selectedCategory.subCategory.length === 0
              ) {
                return null;
              }

              return (
                <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(1)}
                    className="flex items-center justify-between w-full p-4 font-semibold text-gray-800 hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      Sub Categories
                      {selectedSubCategories.length > 0 && (
                        <span className="bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">
                          {selectedSubCategories.length}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        activeIndex === 1 ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {activeIndex === 1 && (
                    <div className="p-4 border-t border-gray-100">
                      {/* Clear All Button */}
                      {selectedSubCategories.length > 0 && (
                        <button
                          onClick={clearAllFilters}
                          className="mb-3 text-xs text-red-500 hover:text-red-600 transition-colors"
                        >
                          Clear all ({selectedSubCategories.length})
                        </button>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        {selectedCategory.subCategory.map((sub) => (
                          <label
                            key={sub.subCategoryDetailID}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSubCategories.includes(
                                sub.subCategoryDetailID,
                              )}
                              onChange={() =>
                                handleSubCategoryChange(sub.subCategoryDetailID)
                              }
                              className="w-5 h-5 rounded accent-gray-900"
                            />
                            <span className="text-sm">{sub.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
        </div>
      </div>
    </>
  );
}
