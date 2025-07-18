import CarouselTextBanner from "@/components/carousel-text-banner";
import FeaturedProducts from "@/components/featured-products";
import BannerDiscount from "@/components/banner-discount";
import ChooseCategory from "@/components/choose-category";
import BannerProduct from "@/components/banner.product";
import RebajaProducts from "@/components/rebaja-products";

export default function Home() {
  return (
    <main className="mt-8">
      <CarouselTextBanner />
      <FeaturedProducts />
      <BannerProduct />
      <RebajaProducts />
      <BannerDiscount />
      <ChooseCategory />
    </main>
  );
}
