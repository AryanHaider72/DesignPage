import FeaturedProducts from "./FeaturedProducts/page";
import MainBannerPage from "./MainBannerSection/page";
import MostFeaturedorPopular from "./MostFeaturedorPopular/page";
import Navbar from "./Navbar/page";
import ShopByStyle from "./ShopByStyle/page";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <MainBannerPage />
      <ShopByStyle />
      <MostFeaturedorPopular />
      <FeaturedProducts />
    </>
  );
}
