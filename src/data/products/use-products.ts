// src/data/products/use-products.ts
import { useCallback, useEffect, useState } from 'react';

import { getProducts } from './api';
import { Product } from './types';

const PAGE_SIZE = 20;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async (skip: number) => {
    const data = await getProducts({ limit: PAGE_SIZE, skip });
    setTotal(data.total);
    setProducts((prev) => (skip === 0 ? data.products : [...prev, ...data.products]));
  }, []);

  const loadInitial = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await fetchPage(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [fetchPage]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || products.length >= total) return;
    setIsLoadingMore(true);
    try {
      await fetchPage(products.length);
    } catch {
      // senyap sahaja — user boleh scroll semula untuk cuba lagi
    } finally {
      setIsLoadingMore(false);
    }
  }, [fetchPage, isLoadingMore, products.length, total]);
  
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      await fetchPage(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchPage]);

  return {
    products,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    hasMore: products.length < total,
    loadMore,
    retry: loadInitial,
    refresh,
  };
}
