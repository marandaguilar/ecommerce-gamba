"use client";
import { useRouter } from "next/navigation";

import { BaggageClaim, Heart, ShoppingCart, User } from "lucide-react";

import MenuList from "./menu-list";
import ItemsMenuMobile from "./items-menu-mobile";
import ToggleTheme from "./toggle-theme";
import { useCart } from "@/hooks/use-cart";
import { useLovedProducts } from "@/hooks/use-loved-products";

const Navbar = () => {
    const router = useRouter();
    const cart = useCart();
    const { lovedItems } = useLovedProducts();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center p-4 mx-auto cursor-pointer sm:max-w-4xl md:max-w-6xl">
        <h1 className="text-3xl font-bold" onClick={() => router.push("/")}>
          GAMBA
        </h1>
        <div className="items-center justify-center hidden sm:flex">
          <MenuList />
        </div>
        <div className="flex sm:hidden">
          <ItemsMenuMobile />
        </div>
        <div className="flex items-center justify-center gap-2 sm:gap-7">
          {cart.items.length === 0 ? (
            <ShoppingCart strokeWidth={1} 
            className="cursor-pointer" 
            onClick={() => router.push("/cart")} 
        />
          ) : (
            <div className="flex gap-1" onClick={() => router.push("/cart")}>
              <BaggageClaim strokeWidth={1} className="cursor-pointer" />
              <span className="text-sm">{cart.items.length}</span>
            </div>
          )}
          
          <Heart strokeWidth={1} 
           className={`cursor-pointer ${lovedItems.length > 0 ? "fill-black dark:fill-white" : ""}`}
           onClick={() => router.push("/loved-products")}
          />
          <User strokeWidth={1} 
           className="cursor-pointer"
           onClick={() => router.push("/profile")}
          />
          <ToggleTheme />
        </div>
      </div>
    </div>
  );
};

export default Navbar;