import { Menu } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";

const ItemsMenuMobile = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <Menu className="size-9" />
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 text-center">
        <Link href="/products" className="block p-2 text-lg">
          <p>Todos los productos</p>
        </Link>
        <Link href="/category/utensilios" className="block p-3 text-lg">
          <p>Utensilios</p>
        </Link>
        <Link href="/category/quimicos" className="block p-3 text-lg">
          <p>Químicos</p>
        </Link>
        <Link href="/category/fibras" className="block p-3 text-lg">
          <p>Fibras</p>
        </Link>
        <Link href="/category/papel" className="block p-3 text-lg">
          <p>Papel</p>
        </Link>
        <Link href="/category/miscelaneos" className="block p-3 text-lg">
          <p>Misceláneos</p>
        </Link>
        <Link href="/nosotros" className="block p-3 text-lg">
          <p>Sobre Nosotros</p>
        </Link>
      </PopoverContent>
    </Popover>
  );
};

export default ItemsMenuMobile;
