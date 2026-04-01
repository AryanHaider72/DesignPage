import { addToServerCart } from "@/api/lib/CookiesApi/AddCart/AddCart";
import { getServerCart } from "@/api/lib/CookiesApi/GetCart/GetCart";
import { addToServerWishList } from "@/api/lib/CookiesApi/WishList/AddWishlist/AddWishlist";
import { getServerWishlist } from "@/api/lib/CookiesApi/WishList/GetWishList/GetWishList";
import { CartData } from "@/api/types/CookiesApi/CartItem";
import { FeaturedProductForCustomer } from "@/api/types/Customer/LandingPage/Product/Product";
import { useAppContext } from "@/app/useContext";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SuggestedProps {
  MightLikeProduct: FeaturedProductForCustomer[];
}
export default function YouMightAlsoLike({ MightLikeProduct }: SuggestedProps) {
  const { categoryList } = useAppContext();

  const [productPrices, setProductPrices] = useState<Record<string, number>>(
    () => {
      const initialPrices: Record<string, number> = {};
      MightLikeProduct.forEach((product) => {
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

  // Initialize selected attributes for each product
  useEffect(() => {
    const initialSelected: Record<string, string> = {};
    MightLikeProduct.forEach((product) => {
      const firstVariant = product.variants[0];
      const firstAttribute = firstVariant?.variantValues[0];
      if (firstAttribute) {
        initialSelected[product.productID] = firstAttribute.attributeID;
      }
    });
    setSelectedAttributes(initialSelected);
  }, [MightLikeProduct]);

  const updatePrice = (
    productID: string,
    variantID: string,
    attributeID: string,
  ) => {
    const product = MightLikeProduct.find(
      (item) => item.productID === productID,
    );
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
    const data = currentCart.find((item: CartData) => item.attributeID === ID);
    if (data) return;
    else {
      const updatedCart = [...currentCart, newItem];
      await addToServerCart(updatedCart);
    }
  };
  const addToWishList = async (ID: string) => {
    const newItem: CartData = {
      attributeID: ID,
      qty: 1,
    };
    const currentCart = await getServerWishlist();
    const data = currentCart.find((item: CartData) => item.attributeID === ID);
    if (data) return;
    else {
      const updatedCart = [...currentCart, newItem];
      await addToServerWishList(updatedCart);
    }
  };
  const displayProducts = MightLikeProduct.slice(0, 10);

  return (
    <div className="w-full p-10 mx-auto mt-16 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2
          style={{ fontFamily: "var(--font-playfair)" }}
          className="text-3xl md:text-4xl font-light text-gray-900"
        >
          You Might Also Like
        </h2>
        {displayProducts.length > 5 && (
          <Link
            href={`/Customer/Shop/${categoryList[1]?.subCategoryID}`}
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            View All →
          </Link>
        )}
      </div>

      {/* Grid Layout - Larger cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
        {displayProducts.map((item, index) => (
          <div
            key={item.productID || index}
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 min-w-[280px] sm:min-w-[320px]"
          >
            {/* Image Section - Larger height */}
            <div className="relative h-[320px] sm:h-[360px] md:h-[380px] lg:h-[400px] overflow-hidden bg-gray-50">
              <Link href={`/Customer/Product/${item.productID}`}>
                <img
                  src={item?.images[0]?.url || "/placeholder.jpg"}
                  alt={item.productName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>

              {/* Overlay with Actions - Shows on hover */}
              {item.variants && item.variants.length > 0 && (
                <div
                  className="absolute inset-x-0 bottom-0 bg-white bg-opacity-95 
                                   transform translate-y-full group-hover:translate-y-0
                                   transition-transform duration-300 ease-out
                                   p-4 border-t border-gray-100"
                >
                  {/* Sizes */}
                  <div className="flex flex-wrap gap-2 justify-center mb-3">
                    {item.variants.map((size, indx2) => (
                      <div key={indx2} className="flex gap-1">
                        {size.variantValues.map((item2) => (
                          <button
                            onClick={() =>
                              updatePrice(
                                item.productID,
                                size.varientID,
                                item2.attributeID,
                              )
                            }
                            key={item2.attributeID}
                            className={`${
                              item2.qty > 0 || item.isStock === "InStock"
                                ? `px-2.5 py-1 text-xs font-medium rounded transition-all duration-200 ${
                                    selectedAttributes[item.productID] ===
                                    item2.attributeID
                                      ? "bg-gray-900 text-white"
                                      : "text-gray-600 hover:bg-gray-100"
                                  }`
                                : "text-gray-300"
                            }`}
                          >
                            {item2.varientValue?.toUpperCase() || ""}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center gap-4">
                    {item.isStock === "InStock" && (
                      <button
                        onClick={() => {
                          const attrId = selectedAttributes[item.productID];
                          if (attrId) addToCart(attrId);
                        }}
                        className="px-4 py-1.5 text-xs font-medium text-gray-700 
                                       hover:text-gray-900 transition-colors duration-200
                                       border border-gray-300 rounded hover:border-gray-400 hover:bg-gray-50"
                      >
                        ADD TO BAG
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const attrId = selectedAttributes[item.productID];
                        if (attrId) addToWishList(attrId);
                      }}
                      className="p-1.5 text-gray-500 hover:text-red-500 transition-colors duration-200 hover:scale-110"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Out of Stock Badge */}
              {item.isStock !== "InStock" && (
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                  Out of Stock
                </div>
              )}

              {/* Discount Badge */}
              {item.discount > 0 && (
                <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                  {item.discount}% OFF
                </div>
              )}
            </div>

            {/* Content - Larger padding and text */}
            <div className="p-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                {item.productName}
              </h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900">
                    Rs.{" "}
                    {productPrices[item.productID]?.toLocaleString() ||
                      item?.variants[0]?.variantValues[0]?.salePrice?.toLocaleString()}
                  </span>
                  {item.discount > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      Rs.{" "}
                      {item?.variants[0]?.variantValues[0]?.salePrice?.toLocaleString()}
                    </span>
                  )}
                </div>
                {/* Rating */}
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                  <span className="text-yellow-500 text-sm">★</span>
                  <span className="text-xs text-gray-600 font-medium">4.5</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show message if no products */}
      {displayProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products available.</p>
        </div>
      )}
    </div>
  );
}
