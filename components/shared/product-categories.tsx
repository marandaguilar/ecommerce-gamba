"use client";

import { CategoryType } from "@/types/category";
import { useRouter } from "next/navigation";

interface ProductCategoriesProps {
  category: CategoryType | undefined;
}

const getCategoryColor = (
  categoryId: number | undefined,
  categoryName: string | undefined
) => {
  if (!categoryName) return "bg-gray-500";
  const categoryColorMap: { [key: string]: string } = {
    quimicos: "bg-lime-600",
    químicos: "bg-lime-600",
    Quimicos: "bg-lime-600",
    Químicos: "bg-lime-600",
    miscelaneos: "bg-purple-600",
    misceláneos: "bg-purple-600",
    Miscelaneos: "bg-purple-700",
    Misceláneos: "bg-purple-700",
    utensilios: "bg-red-700",
    Utensilios: "bg-red-700",
    papel: "bg-sky-700",
    Papel: "bg-sky-700",
    fibras: "bg-green-700",
    Fibras: "bg-green-700",
  };

  const specificColor = categoryColorMap[categoryName];
  if (specificColor) {
    return specificColor;
  }

  const specificColorLower = categoryColorMap[categoryName.toLowerCase()];
  if (specificColorLower) {
    return specificColorLower;
  }

  const colors = [
    "bg-red-700",
    "bg-lime-700",
    "bg-sky-700",
    "bg-purple-700",
    "bg-green-700",
  ];

  // Usar el ID de la categoría si está disponible, sino usar el nombre
  const seed = categoryId || categoryName?.charCodeAt(0) || 0;
  const colorIndex = seed % colors.length;

  return colors[colorIndex];
};

const ProductCategories = (props: ProductCategoriesProps) => {
  const { category } = props;
  const router = useRouter();

  const categoryColor = getCategoryColor(category?.id, category?.categoryName);

  return (
    <div
      className="flex items-center justify-between gap-3 cursor-pointer"
      onClick={() => router.push(`/category/${category?.slug}`)}
    >
      <p
        className={`px-2 py-1 text-sm font-bold sm:font-normal text-white rounded-full ${categoryColor}`}
      >
        {category?.categoryName}
      </p>
    </div>
  );
};

export default ProductCategories;
