import { useEffect, useState } from "react";

export function useGetCategoryProduct(
  slug: string | string[],
  page: number = 1,
  limit: number = 25
) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*&filters%5Bcategory%5D%5Bslug%5D%5B%24eq%5D=${slug}&pagination[page]=${page}&pagination[pageSize]=${limit}`;
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(url);
        const json = await res.json();
        setResult(json.data);
        setPagination(json.meta?.pagination || null);
        setLoading(false);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    })();
  }, [url]);

  return { result, loading, error, pagination };
}

export function useSearchCategoryProducts(
  slug: string | string[],
  searchTerm: string,
  page: number = 1,
  limit: number = 25
) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*&filters%5Bcategory%5D%5Bslug%5D%5B%24eq%5D=${slug}&filters[$or][0][productName][$containsi]=${searchTerm}&filters[$or][1][description][$containsi]=${searchTerm}&pagination[page]=${page}&pagination[pageSize]=${limit}`;
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResult(null);
      setLoading(false);
      setError(null);
      setPagination(null);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(url);
        const json = await res.json();
        setResult(json.data);
        setPagination(json.meta?.pagination || null);
        setLoading(false);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    })();
  }, [url, searchTerm]);

  return { result, loading, error, pagination };
}
