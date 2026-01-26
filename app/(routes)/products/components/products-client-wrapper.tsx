"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProductType } from "@/types/product";
import { CategoryType } from "@/types/category";
import ProductCard from "./carousel-products";
import ProductsFilter from "./products-filter";
import { Button } from "@/components/ui/button";
import ProductsCounter from "@/components/shared/products-counter";
import { Separator } from "@/components/ui/separator";

type PaginationMeta = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

interface ProductsClientWrapperProps {
  initialProducts: ProductType[];
  initialPagination?: PaginationMeta;
  categories: CategoryType[];
}

const PAGE_SIZE = 24;

export default function ProductsClientWrapper({
  initialProducts,
  initialPagination,
  categories,
}: ProductsClientWrapperProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [products, setProducts] = useState<ProductType[]>(initialProducts ?? []);
  const [page, setPage] = useState<number>(initialPagination?.page ?? 1);
  const [pageCount, setPageCount] = useState<number>(initialPagination?.pageCount ?? 1);
  const [total, setTotal] = useState<number>(initialPagination?.total ?? (initialProducts?.length ?? 0));
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const didInitRef = useRef(false);

  const fetchProductsPage = useCallback(
    async (targetPage: number, mode: "replace" | "append") => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        setError("NEXT_PUBLIC_BACKEND_URL no esta configurado");
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setError(null);
      if (mode === "append") {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const params = new URLSearchParams();

      // Minimal populate (matches server data layer)
      params.append("populate[images][fields][0]", "url");
      params.append("populate[category][fields][0]", "categoryName");
      params.append("populate[category][fields][1]", "slug");
      params.append("populate[category][fields][2]", "id");
      params.append("fields[0]", "id");
      params.append("fields[1]", "productName");
      params.append("fields[2]", "slug");
      params.append("fields[3]", "price");
      params.append("fields[4]", "price_mayoreo");
      params.append("fields[5]", "active");
      params.append("fields[6]", "description");

      params.append("pagination[page]", targetPage.toString());
      params.append("pagination[pageSize]", PAGE_SIZE.toString());
      params.append("filters[active][$eq]", "true");
      params.append("sort[0]", "createdAt:desc");

      const trimmedSearch = searchTerm.trim();
      if (trimmedSearch !== "") {
        params.append("filters[$or][0][productName][$containsi]", trimmedSearch);
        params.append("filters[$or][1][description][$containsi]", trimmedSearch);
      }

      if (selectedCategory !== null) {
        params.append("filters[category][id][$eq]", selectedCategory);
      }

      const url = `${backendUrl}/api/products?${params.toString()}`;

      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Error al cargar productos (${res.status})`);
        }

        const json = await res.json();
        const nextProducts: ProductType[] = json?.data ?? [];
        const pagination: PaginationMeta | undefined = json?.meta?.pagination;

        setProducts((prev) => (mode === "append" ? [...prev, ...nextProducts] : nextProducts));

        setPage(pagination?.page ?? targetPage);
        setPageCount(pagination?.pageCount ?? 1);
        setTotal(pagination?.total ?? nextProducts.length);
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === "AbortError") {
          return;
        }

        setError(e instanceof Error ? e.message : "Error desconocido");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [searchTerm, selectedCategory]
  );

  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
      return;
    }

    fetchProductsPage(1, "replace");
  }, [fetchProductsPage, searchTerm, selectedCategory]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleLoadMore = () => {
    if (isLoadingMore || isLoading) return;
    if (page >= pageCount) return;
    fetchProductsPage(page + 1, "append");
  };

  const displayedProducts = useMemo(() => products, [products]);
  const hasMoreProducts = page < pageCount;

  return (
    <>
      {/* Title and filters in same row */}
      <div className="mb-6 px-2 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-medium">Todos los productos</h1>
          <ProductsFilter
            products={initialProducts}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </div>
      </div>

      <Separator />

      {/* Product grid */}
      <div className="flex justify-center">
        <div className="grid gap-2 mt-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-4 max-w-md sm:max-w-none mx-auto px-2 sm:px-0">
          {error ? (
            <p className="col-span-full text-center py-8">{error}</p>
          ) : isLoading && displayedProducts.length === 0 ? (
            <p className="col-span-full text-center py-8">Cargando productos...</p>
          ) : displayedProducts.length > 0 ? (
            displayedProducts.map((product: ProductType) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center py-8">
              No hay productos disponibles
            </p>
          )}
        </div>
      </div>

      {/* Load more button */}
      {hasMoreProducts && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="px-8 py-2"
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Cargando..." : "Cargar más productos"}
          </Button>
        </div>
      )}

      {/* Product counter */}
      <ProductsCounter
        visibleCount={displayedProducts.length}
        totalCount={total}
        isLoading={false}
      />
    </>
  );
}
