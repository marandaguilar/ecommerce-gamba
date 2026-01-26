import { notFound } from "next/navigation";
import { getCategoryBySlug, getCategoryProducts } from "@/lib/data/strapi";
import CategoryClientWrapper from "./components/category-client-wrapper";

interface PageProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "Categoría no encontrada | Gamba",
    };
  }

  return {
    title: `${category.categoryName} | Gamba`,
    description: `Explora productos de ${category.categoryName}`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { categorySlug } = await params;

  // Fetch category and products server-side
  const [category, initialProducts] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getCategoryProducts(categorySlug, 50), // Fetch 50 products initially (increased for better search)
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-[1600px] py-10 mx-auto sm:px-8 px-4">
      {/* Client wrapper handles search and "load more" functionality */}
      <CategoryClientWrapper
        initialProducts={initialProducts}
        categorySlug={categorySlug}
        categoryName={category.categoryName}
      />
    </div>
  );
}

// ISR: Revalidate every 1 hour
export const revalidate = 3600;
