"use client";
import { useEffect, useState } from "react";
import ChooseUs from "./ChooseUS/page";
import FeaturedProducts from "./FeaturedProducts/page";
import Footer from "./FooterSection/page";
import MainBannerPage from "./MainBannerSection/page";
import MostFeaturedorPopular from "./MostFeaturedorPopular/page";
import Navbar from "./Navbar/page";
import ShopByStyle from "./ShopByStyle/page";
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
import GetCustomerFeaturedProductApi from "@/api/lib/Customer/LandingPage/FeaturedProduct/FeaturedProduct";
import {
  FeaturedProductForCustomer,
  ProductApiResponseCustomer,
} from "@/api/types/Customer/LandingPage/Product/Product";
import GetProductCustomerApi from "@/api/lib/Customer/LandingPage/CustomerProductsFetched/CustomerFecthedProduct";
import CartItems from "@/app/UsefullComponent/CartSidebar/page";
import FilterComponent from "@/app/UsefullComponent/FilterComponent/page";
import SearchSidebarCompnent from "@/app/UsefullComponent/SearchComponent/page";
import { getServerCart } from "@/api/lib/CookiesApi/GetCart/GetCart";
interface cartItems {
  attributeID: string;
  qty: number;
}
export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoryList, setCategoryList] = useState<categoryList[]>([]);
  const [storeInfo, setStoreInfo] = useState<storeGet[]>([]);
  const [showItem, setShowItem] = useState(false);
  const [cartItem, setCarItem] = useState<cartItems[]>([]);
  const [FeaturedProduct, setFeaturedProduct] = useState<
    FeaturedProductForCustomer[]
  >([]);
  const [ProductList, setProductList] = useState<FeaturedProductForCustomer[]>(
    [],
  );

  const item = () =>
    void useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 50);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

  const getCategory = async () => {
    try {
      setLoading(true);
      const response = await GetCategoryiesCustomerApi();
      if (response.status === 200 || response.status === 201) {
        const data = response.data as GetCategoryResponse;
        setCategoryList(data.categoryList);
      }
    } finally {
      setLoading(false);
    }
  };
  const getStores = async () => {
    try {
      const response = await GetStoreCustomerApi();
      if (response.status === 200 || response.status === 201) {
        const data = response.data as CustomerStoreInfoResponse;
        setStoreInfo(data.storeGet);
      }
    } finally {
    }
  };

  const getFeaturedProduct = async () => {
    try {
      const response = await GetCustomerFeaturedProductApi();
      if (response.status === 200 || response.status === 201) {
        const data = response.data as ProductApiResponseCustomer;
        setFeaturedProduct(data.productList);
      }
    } finally {
    }
  };
  const getProduct = async () => {
    try {
      const response = await GetProductCustomerApi();
      if (response.status === 200 || response.status === 201) {
        const data = response.data as ProductApiResponseCustomer;
        setProductList(data.productList);
      }
    } finally {
    }
  };
  useEffect(() => {
    getStores();
    getCategory();
    getFeaturedProduct();
  }, []);
  useEffect(() => {
    if (FeaturedProduct) {
      getProduct();
    }
  }, [FeaturedProduct]);
  return (
    <>
      <Navbar
        scrolled={scrolled}
        categoryList={categoryList}
        logoUrl={storeInfo[0]?.logoUrl}
        productList={ProductList}
        onCommit={item}
      />
      <MainBannerPage store={storeInfo} />
      <ShopByStyle categoryList={categoryList} />
      <MostFeaturedorPopular
        FeaturedProduct={FeaturedProduct}
        onCommitChnage={item}
      />
      <FeaturedProducts categoryList={categoryList} />
      <ChooseUs />
      <Footer />
    </>
  );
}
