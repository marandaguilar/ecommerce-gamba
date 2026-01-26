import CarouselTextBanner from "@/components/carousel-text-banner";
import FeaturedProductsServer from "@/components/featured-products-server";
import BannerDiscount from "@/components/banner-discount";
import BannerProduct from "@/components/banner.product";
import RebajaProductsServer from "@/components/rebaja-products-server";
import CategorySectionServer from "@/components/category-section-server";
import { getAllCategories, getFeaturedProducts, getRebajaProducts, getCategoryProducts } from "@/lib/data/strapi";

export const metadata = {
  title: "Gamba | Tienda en línea",
  description: "Encuentra los mejores productos en Gamba",
};

export default async function Home() {
  // Parallel fetch all home page data
  const [categories, featuredProducts, rebajaProducts] = await Promise.all([
    getAllCategories(),
    getFeaturedProducts(12), // Limit to 12 instead of fetching all
    getRebajaProducts(12), // Limit to 12 instead of fetching all
  ]);

  // Fetch products for ALL categories in parallel (limit 10 per category)
  const categoryProductsPromises = categories.map((category) =>
    getCategoryProducts(category.slug, 10)
  );

  const categoryProductsResults = await Promise.all(categoryProductsPromises);

  // Map all categories to their products
  const categoriesWithProducts = categories.map((category, index) => ({
    ...category,
    products: categoryProductsResults[index],
  }));

  return (
    <main className="mt-8">
      <CarouselTextBanner />

      {/* Featured products */}
      <FeaturedProductsServer products={featuredProducts} />

      <BannerProduct />

      {/* Rebaja products */}
      <RebajaProductsServer products={rebajaProducts} />

      <BannerDiscount />

      {/* All Category Sections with products */}
      {categoriesWithProducts.map((category) => (
        <CategorySectionServer
          key={category.id}
          category={category}
          products={category.products}
        />
      ))}
    </main>
  );
}

// ISR: Revalidate every 30 minutes (home page changes frequently)
export const revalidate = 1800;
