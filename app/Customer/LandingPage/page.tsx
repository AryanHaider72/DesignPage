// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/app/useContext";
import ChooseUs from "./ChooseUS/page";
import FeaturedProducts from "./FeaturedProducts/page";
import Footer from "./FooterSection/page";
import MainBannerPage from "./MainBannerSection/page";
import MostFeaturedorPopular from "./MostFeaturedorPopular/page";
import Navbar from "./Navbar/page";
import ShopByStyle from "./ShopByStyle/page";
import CustomerReviews from "./CustomerReview/page";
import LoaderScreen from "@/app/Component/UsefullComponent/LoaderScreen/page";
import { FaWhatsapp } from "react-icons/fa";

export default function HomePage() {
  const { categoryList, storeInfo, ProductList, FeaturedProduct, loading } =
    useAppContext();
  const [scrolled, setScrolled] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if all data is loaded
  const isDataLoaded =
    !loading &&
    categoryList?.length > 0 &&
    storeInfo?.length > 0 &&
    ProductList?.length > 0 &&
    FeaturedProduct?.length > 0;

  // Handle smooth transition from loader to content
  useEffect(() => {
    if (isDataLoaded) {
      // Small delay to let loader finish its animation
      const timer = setTimeout(() => {
        setShowContent(true);
        // Fade in content
        setTimeout(() => {
          setContentOpacity(1);
        }, 50);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isDataLoaded]);

  // Show loader while data is loading
  if (!showContent || !isDataLoaded) {
    return (
      <LoaderScreen onLoadingComplete={() => {}} isLoading={!isDataLoaded} />
    );
  }

  const item = () => {};

  return (
    <div
      className="transition-opacity duration-1000 ease-out"
      style={{ opacity: contentOpacity }}
    >
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
      <CustomerReviews />
      <Footer />
      <a
        href="https://wa.me/+923709143934"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 
                 w-14 h-14 rounded-full 
                 bg-green-500 text-white 
                 flex items-center justify-center
                 shadow-lg hover:bg-green-600 
                 hover:scale-110 transition-all duration-300"
        aria-label="Chat on WhatsApp"
        title="Whatsapp Now"
      >
        <FaWhatsapp size={28} />
      </a>
    </div>
  );
}
