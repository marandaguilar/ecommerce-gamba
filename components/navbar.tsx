"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Heart, MessageCircle, ShoppingCart } from "lucide-react";

import MenuList from "./menu-list";
import ItemsMenuMobile from "./items-menu-mobile";
import HeaderSearch from "./header-search";
import { useLovedProducts } from "@/hooks/use-loved-products";
import { useCart } from "@/hooks/use-cart";
import { CategoryType } from "@/types/category";
import { cn } from "@/lib/utils";

interface NavbarProps {
  categories: CategoryType[];
}

const Navbar = ({ categories }: NavbarProps) => {
  const router = useRouter();
  const { lovedItems } = useLovedProducts();
  const { items } = useCart();

  // Guard de hydration: los contadores vienen de estado persistido en
  // localStorage; solo se reflejan tras montar para evitar mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const lovedCount = mounted ? lovedItems.length : 0;
  const cartCount = mounted ? items.length : 0;

  const openWhatsapp = () => {
    const phoneNumber = "+524494056193";
    const message = "Quiero más información";
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="flex justify-between items-center p-4 mx-auto cursor-pointer sm:max-w-4xl md:max-w-6xl">
        <div className="text-center">
          <h1
            className="font-display text-3xl font-extrabold tracking-tight text-primary"
            onClick={() => router.push("/")}
          >
            GAMBA
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            1er aniversario
          </p>
        </div>
        <div className="hidden flex-1 items-center justify-end gap-4 sm:flex">
          <HeaderSearch className="max-w-xs" />
          <MenuList categories={categories} />
        </div>
        <div className="flex sm:hidden">
          <ItemsMenuMobile categories={categories} />
        </div>
        <div className="flex items-center justify-center gap-4 sm:gap-5">
          <button
            type="button"
            aria-label="Contactar por WhatsApp"
            onClick={openWhatsapp}
          >
            <MessageCircle
              size={28}
              strokeWidth={1.5}
              className="cursor-pointer text-whatsapp fill-whatsapp"
            />
          </button>

          <NavIcon
            label="Favoritos"
            count={lovedCount}
            onClick={() => router.push("/loved-products")}
          >
            <Heart
              size={28}
              strokeWidth={1.5}
              className={cn(lovedCount > 0 && "fill-primary text-primary")}
            />
          </NavIcon>

          <NavIcon
            label="Mi pedido"
            count={cartCount}
            onClick={() => router.push("/cart")}
          >
            <ShoppingCart size={28} strokeWidth={1.5} />
          </NavIcon>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

interface NavIconProps {
  label: string;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}

function NavIcon({ label, count, onClick, children }: NavIconProps) {
  return (
    <button
      type="button"
      aria-label={count > 0 ? `${label} (${count})` : label}
      onClick={onClick}
      className="relative cursor-pointer"
    >
      {children}
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
          {count}
        </span>
      )}
    </button>
  );
}
