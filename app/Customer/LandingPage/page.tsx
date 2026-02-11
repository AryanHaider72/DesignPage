"use client";
import { useEffect, useState } from "react";
import ChooseUs from "./ChooseUS/page";
import FeaturedProducts from "./FeaturedProducts/page";
import Footer from "./FooterSection/page";
import MainBannerPage from "./MainBannerSection/page";
import MostFeaturedorPopular from "./MostFeaturedorPopular/page";
import Navbar from "./Navbar/page";
import ShopByStyle from "./ShopByStyle/page";

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar scrolled={scrolled} />
      <MainBannerPage />
      <ShopByStyle />
      <MostFeaturedorPopular />
      <FeaturedProducts />
      <ChooseUs />
      <Footer />
    </>
  );
}
