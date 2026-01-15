"use client";

import { useState, useEffect } from "react";

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

export function useGetAllProducts(page: number = 1, pageSize: number = 25) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
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
