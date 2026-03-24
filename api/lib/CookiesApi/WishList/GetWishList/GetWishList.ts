"use server";
import { cookies } from "next/headers";

export async function getServerWishlist() {
  const cookieStore = await cookies();
  const wishlist = cookieStore.get("wishlist")?.value;
  return wishlist ? JSON.parse(wishlist) : [];
}
