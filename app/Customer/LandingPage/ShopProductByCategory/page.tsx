import { addToServerCart } from "@/api/lib/CookiesApi/AddCart/AddCart";
import { getServerCart } from "@/api/lib/CookiesApi/GetCart/GetCart";
import { CartData } from "@/api/types/CookiesApi/CartItem";
import { FeaturedProductForCustomer } from "@/api/types/Customer/LandingPage/Product/Product";
import { useAppContext } from "@/app/useContext";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
export default function ShopByProductCategory({
  value,
  SubCategoryID,
}: {
  value: string;
  SubCategoryID: string;
}) {
  const { ProductList } = useAppContext();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [productItem, setProductItem] = useState<FeaturedProductForCustomer[]>(
    [],
  );
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
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({
      left: -400,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({
      left: 400,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    if (ProductList) {
      const data = ProductList.filter(
        (item) => item.subCategoryDetailID === SubCategoryID,
      );
      if (data) {
        setProductItem(data);
      }
    }
  }, [ProductList, SubCategoryID]);

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
  };
  const addToCart = async (ID: string) => {
    const newItem: CartData = {
      attributeID: ID,
      qty: 1,
    };
    const currentCart = await getServerCart();

    const updatedCart = [...currentCart, newItem];
    await addToServerCart(updatedCart);
    //onCommitChnage();
  };
  return (
    <div className="mt-10 mb-10">
      <h1 className="px-10 mb-5 text-3xl font-extralight text-center sm:text-left">
        Shop By {value}
      </h1>

      {/* Carousel */}
      <div className="relative">
        {/* Left Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2
                   rounded-full bg-white p-3 shadow-md
                   hover:bg-gray-100"
        >
          <ChevronLeft />
        </button>

        {/* Right Button */}
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2
                   rounded-full bg-white p-3 shadow-md
                   hover:bg-gray-100"
        >
          <ChevronRight />
        </button>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide"
        >
          {productItem.map((item, index) => (
            <div
              key={index}
              className="group snap-start min-w-[280px] sm:min-w-[420px] lg:min-w-[450px]
                 bg-white rounded-xl border border-gray-200 overflow-hidden
                 flex flex-col cursor-pointer transition-shadow duration-300 hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative h-[500px] overflow-hidden">
                <img
                  src={item?.images[0]?.url || "/placeholder.jpg"}
                  alt={item.productName}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Sublist + Add to Bag Overlay */}
                {item.variants && item.variants.length > 0 && (
                  <div
                    className="absolute w-full bottom-0 left-1/2 transform -translate-x-1/2
                       w-4/5 bg-white bg-opacity-90 opacity-0 group-hover:opacity-80
                       flex flex-col items-center justify-center gap-2
                       p-3  transition-opacity duration-300"
                  >
                    {/* Sizes */}
                    <div className="flex gap-2">
                      {item.variants.map((size) => (
                        <div key={size.varientID}>
                          {size.variantValues.map((item2) => (
                            <span
                              onClick={() =>
                                updatePrice(
                                  item.productID,
                                  size.varientID,
                                  item2.attributeID,
                                )
                              }
                              key={item2.attributeID}
                              className={`px-3 py-1 text-sm font-medium cursor-pointer transition-colors duration-200
                              ${
                                selectedAttributes[item.productID] ===
                                item2.attributeID
                                  ? "text-black font-bold "
                                  : "text-gray-500 hover:text-gray-800"
                              }
                              `}
                            >
                              {item2.varientValue.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Add to Bag */}
                    <div className="flex gap-20">
                      <button
                        onClick={() => {
                          addToCart(String(selectedAttributes[item.productID]));
                        }}
                        className="mt-2 ml-10 px-4 py-1  text-[18px] text-gray-700 text-sm font-semibold rounded hover:text-black transition-colors duration-200"
                      >
                        ADD TO BAG
                      </button>
                      <button className="mt-2 px-4 py-1  text-[30px] text-black text-sm font-semibold rounded hover:text-red-500 transition-colors duration-200">
                        <Heart />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {item.productName}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-2">
                  {item.description}
                </p>

                <span className="mt-2 text-lg font-semibold text-gray-900">
                  {item?.variants[0]?.variantValues[0]?.salePrice.toLocaleString()}
                  -/
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
