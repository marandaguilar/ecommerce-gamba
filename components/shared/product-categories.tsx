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
    quimicos: "bg-lime-700 dark:bg-lime-400",
    químicos: "bg-lime-700 dark:bg-lime-400",
    Quimicos: "bg-lime-700 dark:bg-lime-400",
    Químicos: "bg-lime-700 dark:bg-lime-400",
    miscelaneos: "bg-purple-700 dark:bg-purple-400",
    misceláneos: "bg-purple-700 dark:bg-purple-400",
    Miscelaneos: "bg-purple-700 dark:bg-purple-400",
    Misceláneos: "bg-purple-700 dark:bg-purple-400",
    utensilios: "bg-red-700 dark:bg-red-400",
    Utensilios: "bg-red-700 dark:bg-red-400",
    celulosa: "bg-sky-700 dark:bg-sky-400",
    Celulosa: "bg-sky-700 dark:bg-sky-400",
  };

  const specificColor = categoryColorMap[categoryName];
  if (specificColor) {
    console.log("Found exact match for:", categoryName, "->", specificColor);
    return specificColor;
  }

  const specificColorLower = categoryColorMap[categoryName.toLowerCase()];
  if (specificColorLower) {
    console.log(
      "Found lowercase match for:",
      categoryName,
      "->",
      specificColorLower
    );
    return specificColorLower;
  }

  console.log("No specific color found for:", categoryName, "using fallback");

  const colors = [
    "bg-red-700 dark:bg-red-400",
    "bg-lime-700 dark:bg-lime-400",
    "bg-sky-700 dark:bg-sky-400",
    "bg-purple-700 dark:bg-purple-400",
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
        className={`px-2 py-1 text-xs text-white dark:text-black rounded-full ${categoryColor}`}
      >
        {category?.categoryName}
      </p>
    </div>
  );
};

export default ProductCategories;
