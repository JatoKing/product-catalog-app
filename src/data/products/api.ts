// src/data/products/api.ts
import { Product, ProductListResponse } from './types';

const BASE_URL = 'https://dummyjson.com';

export async function getProducts(params: {
  limit: number;
  skip: number;
}): Promise<ProductListResponse> {
  const { limit, skip } = params;
  const response = await fetch(
    `${BASE_URL}/products?limit=${limit}&skip=${skip}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch products (status ${response.status})`);
  }

  return response.json();
}

export async function getProductById(id: number): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch product ${id} (status ${response.status})`);
  }

  return response.json();
}
