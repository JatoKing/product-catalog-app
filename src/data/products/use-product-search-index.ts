// src/data/products/use-product-search-index.ts
import { useEffect, useState } from 'react';

import { getProducts } from './api';
import { Product } from './types';

export function useProductSearchIndex() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    let isMounted = true;
    getProducts({ limit: 0, skip: 0 })
      .then((data) => {
        if (isMounted) setAllProducts(data.products);
      })
      .catch(() => {
        // search index tu "best-effort" — kalau gagal, biar filter jatuh balik ke list yang dah loaded
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return allProducts;
}
