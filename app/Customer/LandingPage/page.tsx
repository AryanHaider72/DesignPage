"use client";
import { useContext, useEffect, useState } from "react";
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
import { useAppContext } from "@/app/useContext";
interface cartItems {
  attributeID: string;
  qty: number;
}
export default function HomePage() {
  const { categoryList, storeInfo, ProductList, FeaturedProduct } =
    useAppContext();
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [showItem, setShowItem] = useState(false);
  const [cartItem, setCarItem] = useState<cartItems[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getFeaturedProduct = async () => {
    try {
    } finally {
    }
  };

  const item = () => {};
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
