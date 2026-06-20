import Link from "next/link";

import { getProducts, getAllCategories } from "@/lib/data/strapi";
import { isSortKey, DEFAULT_SORT } from "@/lib/sort";
import { ProductType } from "@/types/product";
import ProductCard from "@/components/shared/product-card";
import ListingControls from "@/components/listing/listing-controls";
import PaginationControls from "@/components/listing/pagination-controls";
import ProductsCounter from "@/components/shared/products-counter";
import EmptyState from "@/components/listing/empty-state";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Todos los productos | Gamba",
  description: "Explora nuestro catálogo completo de productos",
};

const PAGE_SIZE = 24;

type SearchParams = {
  page?: string;
  search?: string;
  sort?: string;
  category?: string;
  offer?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const search = sp.search?.trim() || undefined;
  const sort = isSortKey(sp.sort) ? sp.sort : DEFAULT_SORT;
  const categoryId = sp.category ? Number(sp.category) : undefined;
  const offer = sp.offer === "true" ? true : undefined;

  const [res, categories] = await Promise.all([
    getProducts({
      page,
      pageSize: PAGE_SIZE,
      search,
      sort,
      categoryId: Number.isFinite(categoryId) ? categoryId : undefined,
      isRebaja: offer,
    }),
    getAllCategories(),
  ]);

  const products = res.data;
  const pageCount = res.meta.pagination?.pageCount ?? 1;
  const total = res.meta.pagination?.total ?? products.length;

  return (
    <div className="max-w-[1600px] py-4 mx-auto sm:py-12 sm:px-8 px-4 mt-8 sm:mt-0">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Inicio</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Productos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mt-4 mb-6 font-display text-3xl font-bold">
        Todos los productos
      </h1>

      <ListingControls categories={categories} />

      <Separator className="my-6" />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.length > 0 ? (
          products.map((product: ProductType, index: number) => (
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

      <ProductsCounter
        visibleCount={products.length}
        totalCount={total}
        isLoading={false}
      />
    </div>
  );
}
