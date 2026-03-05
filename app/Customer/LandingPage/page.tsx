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

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoryList, setCategoryList] = useState<categoryList[]>([]);
  const [storeInfo, setStoreInfo] = useState<storeGet[]>([]);

  useEffect(() => {
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
  useEffect(() => {
    getStores();
    getCategory();
  }, []);

  return (
    <>
      <Navbar
        scrolled={scrolled}
        categoryList={categoryList}
        logoUrl={storeInfo[0]?.logoUrl}
      />
      <MainBannerPage store={storeInfo} />
      <ShopByStyle categoryList={categoryList} />
      <MostFeaturedorPopular />
      <FeaturedProducts categoryList={categoryList} />
      <ChooseUs />
      <Footer />
    </>
  );
}
