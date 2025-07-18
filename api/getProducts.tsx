import { useEffect, useState } from "react";

export function useGetCategories() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories?populate=*`;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(url);
        const json = await res.json();
        setResult(json.data);
        setLoading(false);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    })();
  }, [url]);

  return { loading, result, error };
}

export function useGetAllProducts(page: number = 1, limit: number = 25) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*&pagination[page]=${page}&pagination[pageSize]=${limit}`;
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

export function useSearchProducts(
  searchTerm: string,
  page: number = 1,
  limit: number = 25
) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*&filters[$or][0][productName][$containsi]=${searchTerm}&filters[$or][1][description][$containsi]=${searchTerm}&pagination[page]=${page}&pagination[pageSize]=${limit}`;
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
