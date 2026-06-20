import { getProducts, getAllCategories } from "@/lib/data/strapi";
import ProductsClientWrapper from "./components/products-client-wrapper";

export const metadata = {
  title: "Todos los productos | Gamba",
  description: "Explora nuestro catálogo completo de productos",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const initialSearch = search?.trim() ?? "";

  // Fetch initial products (filtrados por la búsqueda de la URL) y categorías
  const [productsResponse, categories] = await Promise.all([
    getProducts({ page: 1, pageSize: 24, search: initialSearch || undefined }),
    getAllCategories(),
  ]);

  return (
    <div className="max-w-[1600px] py-4 mx-auto sm:py-16 sm:px-8 px-4 mt-8 sm:mt-0">
      {/* Client wrapper handles filtering, search, and "load more" */}
      <ProductsClientWrapper
        initialProducts={productsResponse.data}
        initialPagination={productsResponse.meta.pagination}
        categories={categories}
        initialSearch={initialSearch}
      />
    </div>
  );
}

// ISR: Revalidate every 1 hour
export const revalidate = 3600;
