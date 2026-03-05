"use server";
import { CartData } from "@/api/types/CookiesApi/CartItem";
import { cookies } from "next/headers";

export async function addToServerCart(item: CartData[]) {
  const cookieStore = await cookies();
  cookieStore.set("cart", JSON.stringify(item), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return { success: true };
}
