import { useEffect, useState } from "react";

export function useGetCategoryProduct(slug: string | string[], page: number = 1, pageSize: number = 25, limit?: number) {
  const url = limit
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*&filters%5Bcategory%5D%5Bslug%5D%5B%24eq%5D=${slug}&pagination[limit]=${limit}`
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*&filters%5Bcategory%5D%5Bslug%5D%5B%24eq%5D=${slug}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(url);
        const json = await res.json();
        setResult(json.data);
        setMeta(json.meta);
        setLoading(false);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    })();
  }, [url]);

  return { result, loading, error, meta };
}
