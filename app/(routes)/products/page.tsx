import { getProducts, getAllCategories } from "@/lib/data/strapi";
import { loadListingParams } from "@/lib/listing-params";
import ProductListing from "@/components/listing/product-listing";

export const metadata = {
  title: "Todos los productos | Gamba",
  description: "Explora nuestro catálogo completo de productos",
};

const PAGE_SIZE = 24;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { page, search, sort, category, offer } =
    await loadListingParams(searchParams);
  const categoryId = category ? Number(category) : undefined;

  const [res, categories] = await Promise.all([
    getProducts({
      page: Math.max(1, page),
      pageSize: PAGE_SIZE,
      search: search.trim() || undefined,
      sort,
      categoryId: Number.isFinite(categoryId) ? categoryId : undefined,
      isRebaja: offer || undefined,
    }),
    getAllCategories(),
  ]);

  return (
    <ProductListing
      title="Todos los productos"
      breadcrumbCurrent="Productos"
      products={res.data}
      pageCount={res.meta.pagination?.pageCount ?? 1}
      total={res.meta.pagination?.total ?? res.data.length}
      categories={categories}
      className="max-w-[1600px] py-4 mx-auto sm:py-12 sm:px-8 px-4 mt-8 sm:mt-0"
    />
  );
}
