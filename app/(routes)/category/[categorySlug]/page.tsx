import { notFound } from "next/navigation";

import { getCategoryBySlug, getProducts } from "@/lib/data/strapi";
import { loadListingParams } from "@/lib/listing-params";
import ProductListing from "@/components/listing/product-listing";

interface PageProps {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const PAGE_SIZE = 24;

export async function generateMetadata({ params }: PageProps) {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    return { title: "Categoría no encontrada | Gamba" };
  }

  return {
    title: `${category.categoryName} | Gamba`,
    description: `Explora productos de ${category.categoryName}`,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { categorySlug } = await params;
  const { page, search, sort, offer } = await loadListingParams(searchParams);

  const category = await getCategoryBySlug(categorySlug);
  if (!category) {
    notFound();
  }

  // Fuente única de datos: getProducts con categoryId (pagina todo,
  // resuelve el bug del tope de 50 del modelo client-side anterior).
  const res = await getProducts({
    page: Math.max(1, page),
    pageSize: PAGE_SIZE,
    search: search.trim() || undefined,
    sort,
    categoryId: category.id,
    isRebaja: offer || undefined,
  });

  return (
    <ProductListing
      title={category.categoryName}
      breadcrumbCurrent={category.categoryName}
      products={res.data}
      pageCount={res.meta.pagination?.pageCount ?? 1}
      total={res.meta.pagination?.total ?? res.data.length}
    />
  );
}
