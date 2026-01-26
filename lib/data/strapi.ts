/**
 * Strapi Data Layer
 * Server-side data fetching with selective population and ISR support
 */

import { ProductType } from '@/types/product';
import { CategoryType } from '@/types/category';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined');
}

interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Build selective populate query for products
 */
function buildProductPopulate(includeDescription: boolean = false): URLSearchParams {
  const params = new URLSearchParams();

  // Only fetch first image URL
  params.append('populate[images][fields][0]', 'url');

  // Only fetch category essentials
  params.append('populate[category][fields][0]', 'categoryName');
  params.append('populate[category][fields][1]', 'slug');
  params.append('populate[category][fields][2]', 'id');

  // Only fetch needed product fields
  params.append('fields[0]', 'id');
  params.append('fields[1]', 'productName');
  params.append('fields[2]', 'slug');
  params.append('fields[3]', 'price');
  params.append('fields[4]', 'price_mayoreo');
  params.append('fields[5]', 'isFeatured');
  params.append('fields[6]', 'active');

  if (includeDescription) {
    params.append('fields[7]', 'description');
  }

  return params;
}

/**
 * Build selective populate query for categories
 */
function buildCategoryPopulate(): URLSearchParams {
  const params = new URLSearchParams();

  params.append('populate[mainImage][fields][0]', 'url');
  params.append('fields[0]', 'id');
  params.append('fields[1]', 'categoryName');
  params.append('fields[2]', 'slug');

  return params;
}

/**
 * Fetch products with pagination and filters
 */
export async function getProducts(options: {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: number;
  isFeatured?: boolean;
  isRebaja?: boolean;
} = {}): Promise<StrapiResponse<ProductType[]>> {
  const {
    page = 1,
    pageSize = 24,
    search,
    categoryId,
    isFeatured,
    isRebaja
  } = options;

  const params = buildProductPopulate(false);

  // Pagination
  params.append('pagination[page]', page.toString());
  params.append('pagination[pageSize]', pageSize.toString());

  // Always filter by active
  params.append('filters[active][$eq]', 'true');

  // Search filter
  if (search) {
    params.append('filters[$or][0][productName][$containsi]', search);
    params.append('filters[$or][1][description][$containsi]', search);
  }

  // Category filter
  if (categoryId) {
    params.append('filters[category][id][$eq]', categoryId.toString());
  }

  // Featured filter
  if (isFeatured !== undefined) {
    params.append('filters[isFeatured][$eq]', isFeatured.toString());
  }

  // Rebaja filter
  if (isRebaja !== undefined) {
    params.append('filters[isRebaja][$eq]', isRebaja.toString());
  }

  // Sort by creation date descending
  params.append('sort[0]', 'createdAt:desc');

  const url = `${BACKEND_URL}/api/products?${params.toString()}`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 3600, // ISR: 1 hour
        tags: ['products']
      }
    });

    if (!res.ok) {
      console.error('Failed to fetch products:', res.statusText);
      return { data: [], meta: { pagination: { page: 1, pageSize: 24, pageCount: 0, total: 0 } } };
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 24, pageCount: 0, total: 0 } } };
  }
}

/**
 * Fetch single product by slug with full details
 */
export async function getProductBySlug(slug: string): Promise<ProductType | null> {
  const params = new URLSearchParams();

  // Full populate for detail page
  params.append('populate[images][fields][0]', 'url');
  params.append('populate[images][fields][1]', 'id');
  params.append('populate[category][fields][0]', 'categoryName');
  params.append('populate[category][fields][1]', 'slug');
  params.append('populate[category][fields][2]', 'id');

  // Filter by slug
  params.append('filters[slug][$eq]', slug);

  const url = `${BACKEND_URL}/api/products?${params.toString()}`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 1800, // ISR: 30 minutes for product pages
        tags: [`product-${slug}`]
      }
    });

    if (!res.ok) {
      return null;
    }

    const json: StrapiResponse<ProductType[]> = await res.json();
    return json.data[0] || null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

/**
 * Fetch products by category slug with limit
 */
export async function getCategoryProducts(
  categorySlug: string,
  limit: number = 24
): Promise<ProductType[]> {
  const params = buildProductPopulate(false);

  // Filter by category slug and active
  params.append('filters[category][slug][$eq]', categorySlug);
  params.append('filters[active][$eq]', 'true');

  // Limit results
  params.append('pagination[limit]', limit.toString());

  // Sort by creation date
  params.append('sort[0]', 'createdAt:desc');

  const url = `${BACKEND_URL}/api/products?${params.toString()}`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 3600, // ISR: 1 hour
        tags: [`category-${categorySlug}`, 'products']
      }
    });

    if (!res.ok) {
      return [];
    }

    const json: StrapiResponse<ProductType[]> = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching category products:', error);
    return [];
  }
}

/**
 * Fetch featured products (for home page carousel)
 */
export async function getFeaturedProducts(limit: number = 12): Promise<ProductType[]> {
  const params = buildProductPopulate(false);

  params.append('filters[isFeatured][$eq]', 'true');
  params.append('filters[active][$eq]', 'true');
  params.append('pagination[limit]', limit.toString());
  params.append('sort[0]', 'createdAt:desc');

  const url = `${BACKEND_URL}/api/products?${params.toString()}`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 1800, // ISR: 30 minutes
        tags: ['featured-products']
      }
    });

    if (!res.ok) {
      return [];
    }

    const json: StrapiResponse<ProductType[]> = await res.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

/**
 * Fetch rebaja (sale) products
 */
export async function getRebajaProducts(limit: number = 12): Promise<ProductType[]> {
  const params = buildProductPopulate(false);

  params.append('filters[isRebaja][$eq]', 'true');
  params.append('filters[active][$eq]', 'true');
  params.append('pagination[limit]', limit.toString());
  params.append('sort[0]', 'createdAt:desc');

  const url = `${BACKEND_URL}/api/products?${params.toString()}`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 1800, // ISR: 30 minutes
        tags: ['rebaja-products']
      }
    });

    if (!res.ok) {
      return [];
    }

    const json: StrapiResponse<ProductType[]> = await res.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching rebaja products:', error);
    return [];
  }
}

/**
 * Fetch all categories
 */
export async function getAllCategories(): Promise<CategoryType[]> {
  const params = buildCategoryPopulate();

  const url = `${BACKEND_URL}/api/categories?${params.toString()}`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 7200, // ISR: 2 hours (categories change rarely)
        tags: ['categories']
      }
    });

    if (!res.ok) {
      return [];
    }

    const json: StrapiResponse<CategoryType[]> = await res.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Fetch single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryType | null> {
  const params = buildCategoryPopulate();
  params.append('filters[slug][$eq]', slug);

  const url = `${BACKEND_URL}/api/categories?${params.toString()}`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 7200, // ISR: 2 hours
        tags: [`category-${slug}`]
      }
    });

    if (!res.ok) {
      return null;
    }

    const json: StrapiResponse<CategoryType[]> = await res.json();
    return json.data[0] || null;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

/**
 * Fetch related products (same category, excluding current product)
 */
export async function getRelatedProducts(
  categorySlug: string,
  excludeProductId: number,
  limit: number = 6
): Promise<ProductType[]> {
  const params = buildProductPopulate(false);

  params.append('filters[category][slug][$eq]', categorySlug);
  params.append('filters[id][$ne]', excludeProductId.toString());
  params.append('filters[active][$eq]', 'true');
  params.append('pagination[limit]', limit.toString());
  params.append('sort[0]', 'createdAt:desc');

  const url = `${BACKEND_URL}/api/products?${params.toString()}`;

  try {
    const res = await fetch(url, {
      next: {
        revalidate: 3600, // ISR: 1 hour
        tags: [`category-${categorySlug}`, 'products']
      }
    });

    if (!res.ok) {
      return [];
    }

    const json: StrapiResponse<ProductType[]> = await res.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}
