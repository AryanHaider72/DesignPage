// app/useContext.tsx
"use client";
import { Dispatch, SetStateAction } from "react";
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
  setProductList: Dispatch<SetStateAction<FeaturedProductForCustomer[]>>;
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
  loading: true, // Start with loading true
});

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [categoryList, setCategoryList] = useState<categoryList[]>([]);
  const [pageNumber] = useState(1);
  const [storeInfo, setStoreInfo] = useState<storeGet[]>([]);
  const [ProductList, setProductList] = useState<FeaturedProductForCustomer[]>(
    [],
  );
  const [FeaturedProduct, setFeaturedProduct] = useState<
    FeaturedProductForCustomer[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel for better performance
        const [catResponse, storeResponse, featuredResponse, productResponse] =
          await Promise.all([
            GetCategoryiesCustomerApi(),
            GetStoreCustomerApi(),
            GetCustomerFeaturedProductApi(),
            GetProductCustomerApi(pageNumber),
          ]);

        // Process categories
        if (catResponse.status === 200 || catResponse.status === 201) {
          const catData = catResponse.data as GetCategoryResponse;
          setCategoryList(catData.categoryList);
        }

        // Process store info
        if (storeResponse.status === 200 || storeResponse.status === 201) {
          const storeData = storeResponse.data as CustomerStoreInfoResponse;
          setStoreInfo(storeData.storeGet);
        }

        // Process featured products
        if (
          featuredResponse.status === 200 ||
          featuredResponse.status === 201
        ) {
          const data = featuredResponse.data as ProductApiResponseCustomer;
          setFeaturedProduct(data.productList);
        }

        // Process all products
        if (productResponse.status === 200 || productResponse.status === 201) {
          const data = productResponse.data as ProductApiResponseCustomer;
          setProductList(data.productList);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // Add a small delay to ensure smooth transition
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchAllData();
  }, [pageNumber]);

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
