import { Menu } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";

import { CategoryType } from "@/types/category";

interface ItemsMenuMobileProps {
  categories: CategoryType[];
}

const ItemsMenuMobile = ({ categories }: ItemsMenuMobileProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Menu className="size-9" />
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 text-center">
        <Link href="/products" className="block p-2 text-lg">
          <p>Todos los productos</p>
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="block p-3 text-lg"
          >
            <p>{category.categoryName}</p>
          </Link>
        ))}
        <Link href="/nosotros" className="block p-3 text-lg">
          <p>Sobre Nosotros</p>
        </Link>
      </PopoverContent>
    </Popover>
  );
};

export default ItemsMenuMobile;
