import Link from "next/link";
import { notFound } from "next/navigation";

import { getCategoryBySlug, getProducts } from "@/lib/data/strapi";
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

interface PageProps {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: string;
    offer?: string;
  }>;
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
  const sp = await searchParams;

  const category = await getCategoryBySlug(categorySlug);
  if (!category) {
    notFound();
  }

  const page = Math.max(1, Number(sp.page) || 1);
  const search = sp.search?.trim() || undefined;
  const sort = isSortKey(sp.sort) ? sp.sort : DEFAULT_SORT;
  const offer = sp.offer === "true" ? true : undefined;

  // Fuente única de datos: getProducts con categoryId (pagina todo,
  // resuelve el bug del tope de 50 del modelo client-side anterior).
  const res = await getProducts({
    page,
    pageSize: PAGE_SIZE,
    search,
    sort,
    categoryId: category.id,
    isRebaja: offer,
  });

  const products = res.data;
  const pageCount = res.meta.pagination?.pageCount ?? 1;
  const total = res.meta.pagination?.total ?? products.length;

  return (
    <div className="max-w-[1600px] py-10 mx-auto sm:px-8 px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Inicio</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{category.categoryName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mt-4 mb-6 font-display text-3xl font-bold">
        {category.categoryName}
      </h1>

      <ListingControls />

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
