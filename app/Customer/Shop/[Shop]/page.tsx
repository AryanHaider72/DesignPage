"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../LandingPage/Navbar/page";
import Footer from "../../LandingPage/FooterSection/page";
import { ChevronDown, FilterIcon, Heart, X } from "lucide-react";
import FilterComponent from "@/app/Component/UsefullComponent/FilterComponent/page";
import Link from "next/link";
import { useAppContext } from "@/app/useContext";
import { CartData } from "@/api/types/CookiesApi/CartItem";
import { getServerCart } from "@/api/lib/CookiesApi/GetCart/GetCart";
import { addToServerCart } from "@/api/lib/CookiesApi/AddCart/AddCart";
import { getServerWishlist } from "@/api/lib/CookiesApi/WishList/GetWishList/GetWishList";
import { addToServerWishList } from "@/api/lib/CookiesApi/WishList/AddWishlist/AddWishlist";
import { FeaturedProductForCustomer } from "@/api/types/Customer/LandingPage/Product/Product";

export default function ShopItems() {
  const { categoryList, storeInfo, ProductList } = useAppContext();
  const param = useParams();
  const [subCategoryID, setSubCategoryID] = useState("");
  const [selectedSubCategoryDetails, setSelectedSubCategoryDetails] = useState<
    string[]
  >([]);
  const [searchItem, setSearchItems] = useState<FeaturedProductForCustomer[]>(
    [],
  );
  const [originalFilteredProducts, setOriginalFilteredProducts] = useState<
    FeaturedProductForCustomer[]
  >([]);
  const [categoryID, setCategoryID] = useState("");
  const [Filter, setFilters] = useState(false);
  const [sortType, setSortType] = useState<string | null>("featured");
  const [Open, setOpen] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [productPrices, setProductPrices] = useState<Record<string, number>>(
    () => {
      const initialPrices: Record<string, number> = {};
      ProductList.forEach((product) => {
        const firstVariant = product.variants[0];
        const firstAttribute = firstVariant?.variantValues[0];
        if (firstAttribute) {
          initialPrices[product.productID] = firstAttribute.salePrice;
        }
      });
      return initialPrices;
    },
  );

  // Get navbar height dynamically
  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, []);

  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  // Filter products based on both main category and subcategory details
  useEffect(() => {
    let filtered = [...ProductList];

    // Filter by main subcategory
    if (subCategoryID) {
      filtered = filtered.filter(
        (item) => item.subCategoryID === subCategoryID,
      );
    }

    // Filter by subcategory details (checkbox selections)
    if (selectedSubCategoryDetails.length > 0) {
      filtered = filtered.filter((item) => {
        // Check if product has any variant that matches selected subcategory details
        return (
          item.subCategoryDetailID &&
          selectedSubCategoryDetails.includes(item.subCategoryDetailID)
        );
      });
    }

    // Store original filtered products before sorting
    setOriginalFilteredProducts(filtered);

    // Apply current sort to the filtered products
    applySorting(filtered, sortType);
  }, [ProductList, subCategoryID, selectedSubCategoryDetails]);

  // Apply sorting function
  const applySorting = (
    products: FeaturedProductForCustomer[],
    sort: string | null,
  ) => {
    let sorted = [...products];

    switch (sort) {
      case "Featured":
        sorted.sort((a, b) => {
          return (b.feturedProduct ? 1 : 0) - (a.feturedProduct ? 1 : 0);
        });
        break;
      case "Price: Low to High":
        sorted.sort((a, b) => {
          const priceA =
            productPrices[a.productID] ||
            a.variants[0]?.variantValues[0]?.salePrice ||
            0;
          const priceB =
            productPrices[b.productID] ||
            b.variants[0]?.variantValues[0]?.salePrice ||
            0;
          return priceA - priceB;
        });
        break;
      case "Price: High to Low":
        sorted.sort((a, b) => {
          const priceA =
            productPrices[a.productID] ||
            a.variants[0]?.variantValues[0]?.salePrice ||
            0;
          const priceB =
            productPrices[b.productID] ||
            b.variants[0]?.variantValues[0]?.salePrice ||
            0;
          return priceB - priceA;
        });
        break;
      case "all":
      default:
        // Keep original order
        sorted = [...products];
        break;
    }

    setSearchItems(sorted);
  };

  const updatePrice = (
    productID: string,
    variantID: string,
    attributeID: string,
  ) => {
    const product = ProductList.find((item) => item.productID === productID);
    if (!product) return;

    const variant = product.variants.find(
      (item2) => item2.varientID === variantID,
    );
    if (!variant) return;

    const attribute = variant.variantValues.find(
      (item3) => item3.attributeID === attributeID,
    );
    if (!attribute) return;

    setProductPrices((prev) => ({
      ...prev,
      [productID]: attribute.salePrice,
    }));

    setSelectedAttributes((prev) => ({
      ...prev,
      [productID]: attributeID,
    }));

    // Re-sort if current sort is price-based
    if (
      sortType === "Featured" ||
      sortType === "Price: Low to High" ||
      sortType === "Price: High to Low"
    ) {
      applySorting(originalFilteredProducts, sortType);
    }
  };

  const addToCart = async (ID: string) => {
    const newItem: CartData = {
      attributeID: ID,
      qty: 1,
    };
    const currentCart = await getServerCart();
    const updatedCart = [...currentCart, newItem];
    await addToServerCart(updatedCart);
  };

  const addToWishList = async (ID: string) => {
    const newItem: CartData = {
      attributeID: ID,
      qty: 1,
    };
    const currentCart = await getServerWishlist();
    const updatedCart = [...currentCart, newItem];
    await addToServerWishList(updatedCart);
  };

  const handleSort = (type: string) => {
    setSortType(type);
    setOpen(false);

    // Apply sorting to original filtered products
    applySorting(originalFilteredProducts, type);
  };

  useEffect(() => {
    console.log(param.Shop);
    if (param && !Array.isArray(param.Shop)) {
      setCategoryID(param?.Shop || "");
      setSubCategoryID(param?.Shop || "");
    }
  }, [param]);

  // Handle subcategory details filter change
  const handleSubCategoryDetailsChange = (selectedIds: string[]) => {
    setSelectedSubCategoryDetails(selectedIds);
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-15">
        <div>
          <Navbar
            scrolled={true}
            categoryList={categoryList}
            logoUrl={storeInfo[0]?.logoUrl}
            productList={[]}
            onCommit={() => {}}
          />
        </div>
        <div
          className="flex flex-col items-center w-full min-h-[calc(100vh-200px)] px-4 py-10"
          style={{ paddingTop: `${navbarHeight + 50}px` }}
        >
          {/* Header Section */}
          <div>
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-px w-8 bg-gray-300" />
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Shop
                  </span>
                  <div className="h-px w-8 bg-gray-300" />
                </div>
              </div>
              <h2
                className="text-3xl md:text-4xl font-light text-gray-900 mb-3"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Shop Overview
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-sm flex items-center justify-center gap-2">
                Click any product to view complete details, specifications, and
                available options
              </p>
            </div>
            <hr className="w-full border-gray-300 mb-10" />
          </div>

          {/* Filter Bar */}
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2 border-b border-gray-200 pb-4">
            <div className="flex items-center gap-4">
              <button
                title="filter"
                onClick={() => setFilters(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-sm font-medium"
              >
                <FilterIcon className="w-4 h-4" />
                Filters
                {selectedSubCategoryDetails.length > 0 && (
                  <span className="bg-gray-900 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {selectedSubCategoryDetails.length}
                  </span>
                )}
              </button>

              {/* Active Filters Display */}
              <div className="hidden md:flex items-center gap-2">
                <span className="text-xs text-gray-400">|</span>
                <span className="text-xs text-gray-500">
                  {searchItem.length} products
                </span>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setOpen(!Open)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-sm font-medium"
              >
                <span className="text-gray-500">Sort by:</span>
                <span className="font-semibold">
                  {sortType === "Featured"
                    ? "Featured"
                    : sortType === "Price: Low to High"
                      ? "Price: Low to High"
                      : sortType === "Price: High to Low"
                        ? "Price: High to Low"
                        : "All"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    Open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {Open && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 z-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    <div className="py-1">
                      {[
                        { label: "All", value: "all" },
                        { label: "Featured", value: "featured" },
                        { label: "Price: Low to High", value: "price_asc" },
                        { label: "Price: High to Low", value: "price_desc" },
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() => {
                            handleSort(item.label);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            sortType === item.label
                              ? "bg-gray-100 text-gray-900 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {item.label}
                          {sortType === item.label && (
                            <span className="float-right text-gray-400">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="w-full p-10 mx-auto mt-16 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
              {searchItem.map((item, index) => {
                // Get current price for display
                const currentPrice =
                  productPrices[item.productID] ||
                  item?.variants[0]?.variantValues[0]?.salePrice ||
                  0;
                const originalPrice =
                  item?.variants[0]?.variantValues[0]?.salePrice || 0;
                const hasDiscount = originalPrice > currentPrice;

                return (
                  <div
                    key={item.productID || index}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 min-w-[280px] sm:min-w-[320px]"
                  >
                    {/* Image Section - Larger height */}
                    <div className="relative h-[320px] sm:h-[360px] md:h-[380px] lg:h-[400px] overflow-hidden bg-gray-50">
                      <Link href={`/Customer/Product/${item.productID}`}>
                        <img
                          src={item?.images[0]?.url || "/placeholder.jpg"}
                          alt={item.productName}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </Link>

                      {/* Overlay with Actions - Shows on hover */}
                      {item.variants && item.variants.length > 0 && (
                        <div
                          className="absolute inset-x-0 bottom-0 bg-white bg-opacity-95 
                                   transform translate-y-full group-hover:translate-y-0
                                   transition-transform duration-300 ease-out
                                   p-4 border-t border-gray-100"
                        >
                          {/* Sizes/Options */}
                          <div className="flex flex-wrap gap-2 justify-center mb-3">
                            {item.variants.map((size) => (
                              <div key={size.varientID} className="flex gap-1">
                                {size.variantValues.map((item2) => (
                                  <button
                                    onClick={() =>
                                      updatePrice(
                                        item.productID,
                                        size.varientID,
                                        item2.attributeID,
                                      )
                                    }
                                    key={item2.attributeID}
                                    className={`${
                                      item2.qty > 0 ||
                                      item.isStock === "InStock"
                                        ? `px-2.5 py-1 text-xs font-medium rounded transition-all duration-200 ${
                                            selectedAttributes[
                                              item.productID
                                            ] === item2.attributeID
                                              ? "bg-gray-900 text-white"
                                              : "text-gray-600 hover:bg-gray-100"
                                          }`
                                        : "text-gray-300"
                                    }`}
                                  >
                                    {item2.varientValue?.toUpperCase() || ""}
                                  </button>
                                ))}
                              </div>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-center gap-4">
                            {item.isStock === "InStock" && (
                              <button
                                onClick={() => {
                                  const attrId =
                                    selectedAttributes[item.productID];
                                  if (attrId) addToCart(attrId);
                                }}
                                className="px-4 py-1.5 text-xs font-medium text-gray-700 
                                         hover:text-gray-900 transition-colors duration-200
                                         border border-gray-300 rounded hover:border-gray-400 hover:bg-gray-50"
                              >
                                ADD TO BAG
                              </button>
                            )}
                            <button
                              onClick={() => {
                                const attrId =
                                  selectedAttributes[item.productID];
                                if (attrId) addToWishList(attrId);
                              }}
                              className="p-1.5 text-gray-500 hover:text-red-500 transition-colors duration-200 hover:scale-110"
                            >
                              <Heart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Out of Stock Badge */}
                      {item.isStock !== "InStock" && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                          Out of Stock
                        </div>
                      )}

                      {/* Discount Badge */}
                      {hasDiscount && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                          {Math.round(
                            ((originalPrice - currentPrice) / originalPrice) *
                              100,
                          )}
                          % OFF
                        </div>
                      )}
                    </div>

                    {/* Content - Larger padding and text */}
                    <div className="p-4">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-gray-900">
                            Rs. {currentPrice.toLocaleString()}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through">
                              Rs. {originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {/* Rating */}
                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                          <span className="text-yellow-500 text-sm">★</span>
                          <span className="text-xs text-gray-600 font-medium">
                            4.5
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {searchItem.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No products found matching your filters.
                </p>
              </div>
            )}
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>

      {/* Filter Drawer */}
      {Filter && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-500"
            onClick={() => setFilters(false)}
          />
          <div className="fixed top-0 left-0 z-100 h-full bg-white shadow-xl transform transition-transform duration-500 ease-in-out w-[80vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] xl:w-[25vw] flex flex-col">
            <div className="flex w-full items-center justify-between p-4 border-b border-gray-200">
              <h1 className="text-3xl font-bold mb-4 text-gray-900">
                Filter & Sorting
              </h1>
              <button
                title="Close"
                className="text-gray-500 hover:text-red-500 transition"
                onClick={() => setFilters(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <FilterComponent
              subCategoryID={setSubCategoryID}
              onSubCategoryDetailsChange={handleSubCategoryDetailsChange}
              ReturnSubCategroy={subCategoryID}
              selectedSubCategoryDetails={selectedSubCategoryDetails}
            />
          </div>
        </>
      )}
    </>
  );
}
