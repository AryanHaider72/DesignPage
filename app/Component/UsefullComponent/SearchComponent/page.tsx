"use client";
import ProductSearchParamCustomer from "@/api/lib/Customer/SearchProductCustomer/SearchProductCustoemr";
import {
  ProductFetchRepsonse,
  productList,
} from "@/api/types/Admin/SearchProduct/SearchProduct";
import { useAppContext } from "@/app/useContext";
import { useEffect, useState } from "react";
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function SearchSidebarCompnent() {
  const { categoryList, FeaturedProduct } = useAppContext();
  const [subCategoryID, setsubCategoryID] = useState("");
  const [ProductName, setProductName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductList] = useState<productList[]>([]);

  useEffect(() => {
    if (categoryList) {
      setsubCategoryID(categoryList[1]?.subCategoryID);
    }
  }, [categoryList]);
  const productFetch = async () => {
    if (!ProductName.trim()) return;
    setIsLoading(true);
    try {
      const response = await ProductSearchParamCustomer(ProductName);
      const data = response.data as ProductFetchRepsonse;
      setProductList(data.productList);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!ProductName || ProductName.trim().length === 0) {
      setProductList([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      productFetch();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [ProductName]);

  // Limit to 5-6 items for "You Might Also Like"
  const limitedFeaturedProducts = FeaturedProduct.slice(0, 6);

  return (
    <div className="w-full h-full bg-gradient-to-b from-white to-gray-50/50">
      <div className="p-5 md:p-6 flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {/* Search Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-1 bg-gradient-to-b from-gray-800 to-gray-600 rounded-full" />
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Search Products
            </h1>
          </div>
          <p className="text-xs text-gray-500 ml-3">Find your perfect style</p>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-300" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={ProductName}
                onChange={(e) => {
                  const value = e.target.value;
                  setProductName(value);
                  setShowDropdown(true);
                }}
                onFocus={() => productList.length && setShowDropdown(true)}
                className="w-full pl-9 pr-10 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-sm placeholder:text-gray-400"
                placeholder="Search by product name..."
              />
              {ProductName && (
                <button
                  onClick={() => {
                    setProductName("");
                    setProductList([]);
                    setShowDropdown(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            </div>
          )}

          {/* Search Results Dropdown */}
          {ProductName && showDropdown && productList.length > 0 && (
            <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-4 py-2 border-b border-gray-100">
                <p className="text-xs text-gray-500">
                  {productList.length} results found
                </p>
              </div>
              {productList.map((item) => (
                <Link
                  href={`/Customer/Product/${item.productID}`}
                  key={item.productID}
                  onClick={() => {
                    setProductName(item.productName);
                    setShowDropdown(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.images?.[0]?.url || "/placeholder.jpg"}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {item.storeName}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {ProductName &&
            !isLoading &&
            productList.length === 0 &&
            showDropdown && (
              <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 p-6 text-center animate-in fade-in duration-200">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">No products found</p>
                <p className="text-xs text-gray-400 mt-1">
                  Try searching with different keywords
                </p>
              </div>
            )}
        </div>

        {/* Categories Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <h2 className="text-base font-semibold text-gray-800">
              Browse Categories
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categoryList.slice(0, 8).map((item2) => (
              <Link
                key={item2.subCategoryID}
                href={`/Customer/Shop/${item2.subCategoryID}`}
                className="group"
              >
                <div className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-900 hover:text-white transition-all duration-200 cursor-pointer">
                  {item2.subCategoryName}
                </div>
              </Link>
            ))}
            {categoryList.length > 8 && (
              <Link href="/categories">
                <div className="px-3 py-1.5 rounded-full bg-transparent border border-gray-300 text-gray-500 text-xs font-medium hover:border-gray-900 hover:text-gray-900 transition-all duration-200 cursor-pointer">
                  +{categoryList.length - 8} more
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* You Might Also Like Section */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-semibold text-gray-800">
                You Might Also Like
              </h2>
            </div>
            <Link
              href={`/Customer/Shop/${subCategoryID}`}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {limitedFeaturedProducts.map((item2, index) => (
              <Link
                key={item2.productID || index}
                href={`/Customer/Product/${item2.productID}`}
                className="group"
              >
                <Link
                  href={`/Customer/Product/${item2.productID}`}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <img
                      src={item2?.images[0]?.url || "/placeholder.jpg"}
                      alt={item2?.productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-xs font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        Quick View
                      </span>
                    </div>
                    {/* Discount Badge */}
                    {item2.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        -{item2.discount}%
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 mb-1 group-hover:text-gray-600 transition-colors">
                      {item2?.productName}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Rs.{" "}
                          {item2?.variants[0]?.variantValues[0]?.salePrice?.toLocaleString()}
                        </p>
                        {item2.discount > 0 && (
                          <p className="text-[10px] text-gray-400 line-through">
                            Rs.{" "}
                            {item2?.variants[0]?.variantValues[0]?.salePrice?.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        <span className="text-yellow-500 text-xs">★</span>
                        <span className="text-[10px] text-gray-500">4.5</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Link>
            ))}
          </div>

          {/* View More Button */}
          {FeaturedProduct.length > 6 && (
            <Link href={`/Customer/Shop/${subCategoryID}`}>
              <button className="w-full mt-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200">
                Load More
              </button>
            </Link>
          )}
        </div>

        {/* Recent Searches Section (Optional) */}
        {/* <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recent Searches
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Jackets", "Sneakers", "Hoodies", "T-Shirts"].map(
              (search, idx) => (
                <button
                  key={idx}
                  onClick={() => setProductName(search)}
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs hover:bg-gray-200 transition-colors"
                >
                  {search}
                </button>
              ),
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}
