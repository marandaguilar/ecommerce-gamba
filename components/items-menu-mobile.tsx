import { Menu } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";

const ItemsMenuMobile = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <Menu />
      </PopoverTrigger>
      <PopoverContent className="w-40">
        <Link href="/category/utensilios" className="block p-2">
          <p>Utensilios</p>
        </Link>
        <Link href="/category/quimicos" className="block p-2">
          <p>Quimicos</p>
        </Link>
        <Link href="/category/celulosa" className="block p-2">
          <p>Celulosa</p>
        </Link>
        <Link href="/category/miscelaneos" className="block p-2">
          <p>Miscelaneos</p>
        </Link>
      </PopoverContent>
    </Popover>
  );
};

export default ItemsMenuMobile;
