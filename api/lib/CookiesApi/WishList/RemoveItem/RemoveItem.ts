"use server";
import { CartData } from "@/api/types/CookiesApi/CartItem";
import { cookies } from "next/headers";

export async function removeItemFromServerWishList(attributeID: string) {
  const cookieStore = await cookies();
  const cart = cookieStore.get("wishlist")?.value;

  if (!cart) return [];

  const cartItems: CartData[] = JSON.parse(cart);

  const updatedCart = cartItems.filter(
    (item) => item.attributeID !== attributeID,
  );

  cookieStore.set("wishlist", JSON.stringify(updatedCart), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return updatedCart;
}
