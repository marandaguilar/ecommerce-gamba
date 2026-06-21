"use client";

import * as React from "react";
import Link from "next/link";

import { CategoryType } from "@/types/category";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface MenuListProps {
  categories: CategoryType[];
}

const MenuList = ({ categories }: MenuListProps) => {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        {categories.length > 0 && (
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-md">
              Categorias
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-2 md:grid-cols-1">
                {categories.map((category) => (
                  <ListItem
                    key={category.id}
                    title={category.categoryName}
                    href={`/category/${category.slug}`}
                  />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={`${navigationMenuTriggerStyle()} text-md`}
          >
            <Link href="/products">Productos</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={`${navigationMenuTriggerStyle()} text-md`}
          >
            <Link href="/nosotros">Sobre Nosotros</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MenuList;

function ListItem({
  title,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
