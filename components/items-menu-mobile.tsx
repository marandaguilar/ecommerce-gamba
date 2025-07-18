import { Menu } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";

const ItemsMenuMobile = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <Menu className="size-7" />
      </PopoverTrigger>
      <PopoverContent className="w-40">
        <Link href="/products" className="block p-2">
          <p>Todos los productos</p>
        </Link>
        <Link href="/category/utensilios" className="block p-2">
          <p>Utensilios</p>
        </Link>
        <Link href="/category/quimicos" className="block p-2">
          <p>Químicos</p>
        </Link>
        <Link href="/category/fibras" className="block p-2">
          <p>Fibras</p>
        </Link>
        <Link href="/category/papel" className="block p-2">
          <p>Papel</p>
        </Link>
        <Link href="/category/miscelaneos" className="block p-2">
          <p>Misceláneos</p>
        </Link>
        <Link href="/nosotros" className="block p-2">
          <p>Sobre Nosotros</p>
        </Link>
      </PopoverContent>
    </Popover>
  );
};

export default ItemsMenuMobile;
