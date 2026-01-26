import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/strapi";
import CarouselProduct from "./components/carousel-product";
import InfoProduct from "./components/info-product";
import { Separator } from "@/components/ui/separator";
import RelatedProductsServer from "./components/related-products-server";

interface PageProps {
  params: Promise<{
    productSlug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);

  if (!product) {
    return {
      title: "Producto no encontrado | Gamba",
    };
  }

  return {
    title: `${product.productName} | Gamba`,
    description: product.description || `Compra ${product.productName} en Gamba`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);

  if (!product) {
    notFound();
  }

  // Fetch related products server-side (reduced from 100 to 10)
  const relatedProducts = product.category
    ? await getRelatedProducts(product.category.slug, product.id, 10)
    : [];

  return (
    <div className="max-w-6xl py-4 mx-auto sm:py-32 sm:px-24">
      <div className="grid sm:grid-cols-2">
        <div className="p-2 sm:p-0">
          <CarouselProduct
            images={product.images || []}
            productName={product.productName}
          />
        </div>

        <div className="sm:px-12">
          <InfoProduct product={product} />
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <>
          <Separator className="my-8" />
          <RelatedProductsServer products={relatedProducts} />
        </>
      )}
    </div>
  );
}

// ISR: Revalidate every 30 minutes
export const revalidate = 1800;
