"use client";
import DeleteProductApi from "@/api/lib/Admin/Codes/Product/DeleteProduct/DeleteProduct";
import GetProductApi from "@/api/lib/Admin/Codes/Product/GetProduct/GetProduct";
import GetInitalStoreSalesMan from "@/api/lib/Admin/Stores/GetInitalStore/GetInitalStore";
import {
  ProductApiResponse,
  ProductForAdmin,
} from "@/api/types/Admin/Codes/Product/getProduct";
import {
  ResponseStoreList,
  storeListInital,
} from "@/api/types/Admin/Store/Store";
import DeleteComponent from "@/app/UsefullComponent/DeleteComponent/page";
import Spinner from "@/app/UsefullComponent/Spinner/page";
import { Camera, Pencil, Trash } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import ModifyBasicInfo from "./GetProduct/ModifyBasicInfo/page";
import { Varient } from "@/api/types/Admin/Codes/Product/Product";

interface AddExpenseProps {
  productID: (data: string) => void;
  refreshKey: number;
  values: (type: "basic" | "varient" | "images") => void;
  onModifyData: (data: ModfiyBasicInfoData) => void;
  onVarientData: (data: Variant[]) => void;
  onShowMessage: (message: any, type: "success" | "error") => void;
}

interface ModfiyBasicInfoData {
  storeID: string;
  storeName: string;
  productID: string;
  supplierID: string;
  storeSale: string;
  categoryID: string;
  subCategoryID: string;
  subCategoryDetailID: string;
  unitID: string;
  productName: string;
  description: string;
  feturedProduct: boolean;
  discount: number;
  currentStock: number;
  threshold: number;
  width: number;
  height: number;
  depth: number;
  weight: number;
  showinAllCountry: boolean;
  showinCountry: boolean;
  notShowinCountry: boolean;
  countryList: countryList[];
}
type countryList = {
  countryID: string;
  countryName: string;
};
interface Variant {
  varientID: string;
  variantName: string;
  variantValues: VariantValue[];
}
type VariantValue = {
  attributeID: string;
  varientValue: string;
  costPrice: number;
  salePrice: number;
  qty: number;
  barcode: string;
};

export default function GetProductsFunctionForm({
  productID,
  refreshKey,
  values,
  onModifyData,
  onVarientData,
  onShowMessage,
}: AddExpenseProps) {
  const [ID, setID] = useState("");
  const [Loading, setLoading] = useState(false);
  const [Delete, setDelete] = useState(false);
  const [InitialLoading, setInitialLoading] = useState(false);
  const [LoadingMore, setLoadingMore] = useState(false);
  const [StoreID, setStoreID] = useState("");
  const [storeList, setStoreList] = useState<storeListInital[]>([]);
  const [productList, setProductList] = useState<ProductForAdmin[]>([]);
  const [VarientList, setVarientList] = useState<Varient[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [ModfiyBasicInfo, setModfiyBasicInfo] = useState(false);

  // Observer ref for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (LoadingMore) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !LoadingMore) {
            console.log("Loading more products..."); // Debug log
            loadMoreProducts();
          }
        },
        {
          threshold: 0.1, // Trigger when 10% of the element is visible
          rootMargin: "100px", // Start loading 100px before the element comes into view
        },
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [LoadingMore, hasMore, currentPage, totalPages], // Add all dependencies
  );

  const getStores = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetInitalStoreSalesMan(String(token));
    const data = response.data as ResponseStoreList;

    if (data.storeList.length > 0) {
      setStoreList(data.storeList);
      setStoreID(data.storeList[0].storeID);
      // Load products for first store
      getProducts(data.storeList[0].storeID, 1, true);
    } else {
      setStoreList([]);
    }
  };
  useEffect(() => {
    getProducts(StoreID, 1, true);
  }, [refreshKey]);

  const getProducts = async (
    ID: string,
    page: number,
    isInitial: boolean = false,
  ) => {
    try {
      if (isInitial) {
        setInitialLoading(true);
        setProductList([]); // Clear existing products
        setCurrentPage(1);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      const token = localStorage.getItem("adminToken");
      console.log(`Loading page ${page} for store ${ID}`); // Debug log
      const response = await GetProductApi(String(token), ID, page);

      if (response.status === 200) {
        console.log(response.data);
        const data = response.data as ProductApiResponse;

        if (data.list.length === 0) return setProductList([]);
        if (isInitial) {
          setProductList(data.list);
        } else {
          setProductList((prev) => [...prev, ...data.list]);
        }

        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setHasMore(data.currentPage < data.totalPages);
        console.log(
          `Page ${data.currentPage} of ${data.totalPages}, hasMore: ${data.currentPage < data.totalPages}`,
        ); // Debug log
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      if (isInitial) {
        setInitialLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  const loadMoreProducts = useCallback(() => {
    if (currentPage < totalPages && !LoadingMore && hasMore) {
      console.log("Loading next page:", currentPage + 1); // Debug log
      getProducts(StoreID, currentPage + 1, false);
    } else {
      console.log("Cannot load more:", {
        currentPage,
        totalPages,
        LoadingMore,
        hasMore,
      }); // Debug log
    }
  }, [currentPage, totalPages, LoadingMore, hasMore, StoreID]);

  const handleStoreChange = (storeId: string) => {
    setStoreID(storeId);
    getProducts(storeId, 1, true);
  };
  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this record? This action cannot be undone.",
      )
    ) {
      DeleteProductFromLList(id);
    }
    setDelete(false);
    setID("");
  };
  const DeleteProductFromLList = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await DeleteProductApi({ productID: ID }, String(token));
    if (response.status === 200 || response.status === 201) {
      const data = productList.filter((item) => item.productID !== ID);
      setProductList(data);
      setDelete(false);
    } else {
      setDelete(false);
      onShowMessage(
        response.message || "An Error Occurred while Deleting.",
        "error",
      );
    }
  };
  useEffect(() => {
    getStores();
  }, []);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const fetchDatabasicInfo = (ID: string) => {
    const data = productList.find((item) => item.productID === ID);
    if (data) {
      const newData: ModfiyBasicInfoData = {
        storeID: data.storeID,
        supplierID: data.supplierID,
        storeName: data.storeName,
        productID: data.productID,
        storeSale: data.storeSale,
        categoryID: data.categoryID,
        subCategoryID: data.subCategoryID,
        subCategoryDetailID: data.subCategoryDetailID,
        unitID: data.unitID,
        productName: data.productName,
        description: data.description,
        feturedProduct: data.feturedProduct,
        discount: data.discount,
        currentStock: 0,
        threshold: data.threshold,
        width: data.width,
        height: data.height,
        depth: data.depth,
        weight: data.weight,
        showinAllCountry: data.showinAllCountry,
        showinCountry: data.showinCountry,
        notShowinCountry: data.notShowinCountry,
        countryList: data.countryList.map((item) => ({
          countryID: item.countryID,
          countryName: item.countryName,
        })),
      };
      onModifyData(newData);
    }
  };

  const fetchDataVarient = (ID: string) => {
    const data = productList.find((item) => item.productID === ID);

    if (data) {
      setID(ID);
      const newData: Variant[] = data.variants.map((variant) => ({
        varientID: variant.varientID,
        variantName: variant.variantName,
        variantValues: variant.variantValues.map((value) => ({
          attributeID: value.attributeID,
          varientValue: value.varientValue,
          costPrice: value.costPrice,
          salePrice: value.salePrice,
          qty: value.qty,
          barcode: value.barcode,
        })),
      }));

      onVarientData(newData);
    }
  };

  return (
    <>
      {ModfiyBasicInfo && (
        <>
          <div></div>
        </>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1.5">
          Store
        </label>
        <div className="relative">
          <select
            value={StoreID}
            onChange={(e) => handleStoreChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
          >
            <option>Select Store</option>
            {storeList.map((cat) => (
              <option key={cat.storeID} value={cat.storeID}>
                {cat.storeName}
              </option>
            ))}
          </select>
        </div>
      </div>
      {productList.length > 0 ? (
        <>
          <div className="mt-2">
            {InitialLoading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : (
              <>
                {productList.length > 0 ? (
                  <div className="space-y-4">
                    {productList.map((item, index) => {
                      // Check if this is the last item to attach the ref
                      const isLastItem = index === productList.length - 1;

                      return (
                        <div
                          key={item.productID}
                          ref={isLastItem ? lastProductRef : null}
                          className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition relative"
                        >
                          {/* Image Section */}
                          <div className="relative flex-shrink-0">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={
                                  item.images && item.images.length > 0
                                    ? item.images[0].url
                                    : "/placeholder.jpg"
                                }
                                alt={item.productName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.jpg";
                                }}
                              />
                            </div>

                            <button
                              title="Edit Images"
                              className="absolute -top-2 -right-2 bg-slate-900/80 hover:bg-slate-900 text-white p-1.5 rounded-full shadow"
                            >
                              <Camera size={12} />
                            </button>
                          </div>

                          {/* Product Info Section */}
                          <div className="relative flex-1 max-w-sm  rounded-md  p-3">
                            <h3 className="text-base font-semibold text-gray-800">
                              {item.productName}
                            </h3>

                            <p className="text-xs text-gray-600 mt-1">
                              <span className="font-medium">Desc:</span>{" "}
                              {item.description
                                ? item.description
                                    .split(" ")
                                    .slice(0, 10)
                                    .join(" ") +
                                  (item.description.split(" ").length > 10
                                    ? "..."
                                    : "")
                                : "No description"}
                            </p>

                            {/* Pencil Button */}
                            <button
                              onClick={() => {
                                values("basic");
                                fetchDatabasicInfo(item.productID);
                              }}
                              title="Edit Product Info"
                              className="absolute -top-2 -right-2 bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded-full shadow"
                            >
                              <Pencil size={12} />
                            </button>
                          </div>

                          {/* Variants Section */}
                          <div className="relative bg-gray-50 rounded-md shadow-md p-3 flex-shrink-0 min-w-[120px]">
                            <div className="flex flex-wrap gap-1.5">
                              {item.variants && item.variants.length > 0 ? (
                                item.variants.map((variant) => (
                                  <span
                                    key={variant.varientID}
                                    className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                                  >
                                    {variant.variantName}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-gray-400">
                                  No variants
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => {
                                values("varient");

                                fetchDataVarient(item.productID);
                              }}
                              title="Edit Variants"
                              className="absolute -top-2 -right-2 bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded-full shadow"
                            >
                              <Pencil size={12} />
                            </button>
                          </div>

                          {/* Delete Button */}
                          <div className="flex-shrink-0">
                            <button
                              onClick={() => {
                                setDelete(true);
                                handleDelete(item.productID);
                              }}
                              className="p-2 text-red-600 hover:bg-red-300 border border-red-600 rounded-lg transition"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Loading more indicator */}
                    {LoadingMore && (
                      <div className="flex justify-center py-4">
                        <Spinner />
                      </div>
                    )}

                    {/* End of list message */}
                    {!hasMore && productList.length > 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No more products to load
                      </div>
                    )}

                    {/* Hidden sentinel element when there are no more items but still have more to load */}
                    {hasMore && !LoadingMore && productList.length > 0 && (
                      <div ref={lastProductRef} className="h-4" />
                    )}
                  </div>
                ) : (
                  <span className="block text-center py-8 text-gray-500">
                    No Record Found
                  </span>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <span className="block text-center py-8 text-gray-500">
            No Record Found
          </span>
        </>
      )}
    </>
  );
}
