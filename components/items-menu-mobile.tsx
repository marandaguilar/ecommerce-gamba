"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";

import { CategoryType } from "@/types/category";
import HeaderSearch from "./header-search";

interface ItemsMenuMobileProps {
  categories: CategoryType[];
}

const ItemsMenuMobile = ({ categories }: ItemsMenuMobileProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger aria-label="Abrir menú">
        <Menu className="size-9" />
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 text-center">
        <div className="mb-2">
          <HeaderSearch onSubmitted={() => setOpen(false)} />
        </div>
        <Link
          href="/products"
          className="block p-2 text-lg"
          onClick={() => setOpen(false)}
        >
          <p>Todos los productos</p>
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="block p-3 text-lg"
            onClick={() => setOpen(false)}
          >
            <p>{category.categoryName}</p>
          </Link>
        ))}
        <Link
          href="/nosotros"
          className="block p-3 text-lg"
          onClick={() => setOpen(false)}
        >
          <p>Sobre Nosotros</p>
        </Link>
      </PopoverContent>
    </Popover>
  );
};

export default ItemsMenuMobile;
