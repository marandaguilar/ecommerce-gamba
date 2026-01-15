"use client";

import CarouselTextBanner from "@/components/carousel-text-banner";
import FeaturedProducts from "@/components/featured-products";
import BannerDiscount from "@/components/banner-discount";
import BannerProduct from "@/components/banner.product";
import RebajaProducts from "@/components/rebaja-products";
import { useGetCategories } from "@/api/getProducts";
import CategorySection from "@/components/category-section";

export default function Home() {
  const { result: categories } = useGetCategories();

  return (
    <main className="mt-8">
      <CarouselTextBanner />
      <FeaturedProducts />
      <BannerProduct />
      <RebajaProducts />
      <BannerDiscount />

      {/* Category Sections */}
      {categories &&
        (categories as any[]).map((category: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
          <CategorySection key={category.id} category={category} searchTerm={""} />
        ))}
    </main>
  );
}
