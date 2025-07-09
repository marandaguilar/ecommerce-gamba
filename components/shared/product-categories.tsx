import { CategoryType } from "@/types/category";
import { useRouter } from "next/navigation";

interface ProductCategoriesProps {
  category: CategoryType | undefined;
}

const ProductCategories = (props: ProductCategoriesProps) => {
  const { category } = props;
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-between gap-3 cursor-pointer"
      onClick={() => router.push(`/category/${category?.slug}`)}
    >
      <p className="px-2 py-1 text-xs text-white bg-red-950 dark:bg-white dark:text-black rounded-full">
        {category?.categoryName}
      </p>
    </div>
  );
};

export default ProductCategories;
