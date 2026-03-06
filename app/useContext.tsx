// app/useContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import GetCategoryiesCustomerApi from "@/api/lib/Customer/LandingPage/Category/GetCategory";
import {
  categoryList,
  GetCategoryResponse,
} from "@/api/types/Customer/LandingPage/Category/GetCategroy";
import GetStoreCustomerApi from "@/api/lib/Customer/LandingPage/LandingPage/LandingPage";
import {
  CustomerStoreInfoResponse,
  storeGet,
} from "@/api/types/Customer/LandingPage/StoreInfo/StoreInfo";
import GetProductCustomerApi from "@/api/lib/Customer/LandingPage/CustomerProductsFetched/CustomerFecthedProduct";
import {
  FeaturedProductForCustomer,
  ProductApiResponseCustomer,
} from "@/api/types/Customer/LandingPage/Product/Product";
import GetCustomerFeaturedProductApi from "@/api/lib/Customer/LandingPage/FeaturedProduct/FeaturedProduct";

// Define the type of your context
interface AppContextType {
  categoryList: categoryList[];
  setCategoryList: (categories: categoryList[]) => void;
  storeInfo: storeGet[];
  setStoreInfo: (stores: storeGet[]) => void;
  setProductList: (product: FeaturedProductForCustomer[]) => void;
  ProductList: FeaturedProductForCustomer[];
  FeaturedProduct: FeaturedProductForCustomer[];
  setFeaturedProduct: (featured: FeaturedProductForCustomer[]) => void;
  loading: boolean;
}

// Create context with default values
const AppContext = createContext<AppContextType>({
  categoryList: [],
  setCategoryList: () => {},
  storeInfo: [],
  setStoreInfo: () => {},
  setProductList: () => {},
  ProductList: [],
  FeaturedProduct: [],
  setFeaturedProduct: () => {},
  loading: false,
});

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [categoryList, setCategoryList] = useState<categoryList[]>([]);
  const [storeInfo, setStoreInfo] = useState<storeGet[]>([]);
  const [ProductList, setProductList] = useState<FeaturedProductForCustomer[]>(
    [],
  );
  const [FeaturedProduct, setFeaturedProduct] = useState<
    FeaturedProductForCustomer[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories and store info when provider mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catResponse = await GetCategoryiesCustomerApi();
        if (catResponse.status === 200 || catResponse.status === 201) {
          const catData = catResponse.data as GetCategoryResponse;
          setCategoryList(catData.categoryList);
        }

        const storeResponse = await GetStoreCustomerApi();
        if (storeResponse.status === 200 || storeResponse.status === 201) {
          const storeData = storeResponse.data as CustomerStoreInfoResponse;
          setStoreInfo(storeData.storeGet);
        }
        const responseFetured = await GetCustomerFeaturedProductApi();
        if (responseFetured.status === 200 || responseFetured.status === 201) {
          const data = responseFetured.data as ProductApiResponseCustomer;
          setFeaturedProduct(data.productList);
        }
        const response = await GetProductCustomerApi();
        if (response.status === 200 || response.status === 201) {
          const data = response.data as ProductApiResponseCustomer;
          setProductList(data.productList);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        categoryList,
        setCategoryList,
        storeInfo,
        setStoreInfo,
        ProductList,
        setProductList,
        FeaturedProduct,
        setFeaturedProduct,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use context
export const useAppContext = (): AppContextType => useContext(AppContext);
