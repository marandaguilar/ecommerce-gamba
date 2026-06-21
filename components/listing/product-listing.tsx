import Link from "next/link";

import { ProductType } from "@/types/product";
import { CategoryType } from "@/types/category";
import ProductCard from "@/components/shared/product-card";
import ListingControls from "@/components/listing/listing-controls";
import PaginationControls from "@/components/listing/pagination-controls";
import EmptyState from "@/components/listing/empty-state";
import ProductsCounter from "@/components/shared/products-counter";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

interface ProductListingProps {
  title: string;
  /** Texto del último nivel del breadcrumb (Inicio › {breadcrumbCurrent}). */
  breadcrumbCurrent: string;
  products: ProductType[];
  pageCount: number;
  total: number;
  /** Si se pasa, `ListingControls` muestra el filtro por categoría. */
  categories?: CategoryType[];
  /** Clases del contenedor (cada superficie ajusta su espaciado). */
  className?: string;
}

/**
 * Cáscara compartida del listado: breadcrumb + título + controles + grid +
 * paginación + contador + estado vacío. Productos y categoría solo aportan
 * sus datos ya resueltos y su breadcrumb/título.
 */
const ProductListing = ({
  title,
  breadcrumbCurrent,
  products,
  pageCount,
  total,
  categories,
  className = "max-w-[1600px] py-10 mx-auto sm:px-8 px-4",
}: ProductListingProps) => {
  return (
    <div className={className}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Inicio</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{breadcrumbCurrent}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mt-4 mb-6 font-display text-3xl font-bold">{title}</h1>

      <ListingControls categories={categories} />

      <Separator className="my-6" />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.length > 0 ? (
          products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 5}
            />
          ))
        ) : (
          <EmptyState
            title="No encontramos productos"
            description="Probá con otra búsqueda o quitá los filtros."
          />
        )}
      </div>

      <PaginationControls pageCount={pageCount} />

      <ProductsCounter visibleCount={products.length} totalCount={total} />
    </div>
  );
};

export default ProductListing;
