"use client";
import { useRouter } from "next/navigation";

import { Heart, MessageCircle } from "lucide-react";

import MenuList from "./menu-list";
import ItemsMenuMobile from "./items-menu-mobile";
import { useLovedProducts } from "@/hooks/use-loved-products";

const Navbar = () => {
  const router = useRouter();
  const { lovedItems } = useLovedProducts();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="flex justify-between items-center p-4 mx-auto cursor-pointer sm:max-w-4xl md:max-w-6xl">
        <div className="text-center">
          <h1
            className="text-3xl font-bold text-[#0d4c99]"
            onClick={() => router.push("/")}
          >
            GAMBA
          </h1>
          <p className="text-sm font-semibold">1er aniversario</p>
        </div>
        <div className="items-center justify-center hidden sm:flex">
          <MenuList />
        </div>
        <div className="flex sm:hidden">
          <ItemsMenuMobile />
        </div>
        <div className="flex items-center justify-center gap-4 sm:gap-5">
          <MessageCircle
            size={30}
            strokeWidth={1}
            className="cursor-pointer text-green-600 fill-green-600"
            onClick={() => {
              const phoneNumber = "+524494056193";
              const message = `Quiero más información`;
              const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                message
              )}`;
              window.open(whatsappUrl, "_blank");
            }}
          />
          <Heart
            size={30}
            strokeWidth={1}
            className={`cursor-pointer ${
              lovedItems.length > 0 ? "fill-black" : ""
            }`}
            onClick={() => router.push("/loved-products")}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
