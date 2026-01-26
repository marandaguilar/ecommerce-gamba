import { getProducts, getAllCategories } from "@/lib/data/strapi";
import ProductsClientWrapper from "./components/products-client-wrapper";

export const metadata = {
  title: "Todos los productos | Gamba",
  description: "Explora nuestro catálogo completo de productos",
};

export default async function ProductsPage() {
  // Fetch initial products and categories server-side in parallel
  const [productsResponse, categories] = await Promise.all([
    getProducts({ pageSize: 50 }), // Fetch 50 products initially for better filtering
    getAllCategories(),
  ]);

  return (
    <div className="max-w-[1600px] py-4 mx-auto sm:py-16 sm:px-8 px-4 mt-8 sm:mt-0">
      {/* Client wrapper handles filtering, search, and "load more" */}
      <ProductsClientWrapper
        initialProducts={productsResponse.data}
        categories={categories}
      />
    </div>
  );
}

// ISR: Revalidate every 1 hour
export const revalidate = 3600;
