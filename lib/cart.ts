import { supabase } from './supabase';

export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  title: string;
  price: number;
}

/**
 * Fetch the product catalog from the FakeStore API.
 * Throws on a network failure or a non-2xx response so callers
 * can show an error state instead of hanging on "Loading...".
 */
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('https://fakestoreapi.com/products');
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }
  return res.json();
}

/** Fetch the current cart contents from Supabase. */
export async function fetchCartItems(): Promise<CartItem[]> {
  const { data, error } = await supabase.from('cart').select('*');
  if (error) {
    throw error;
  }
  return (data as CartItem[]) ?? [];
}

/** Insert a product into the Supabase cart table. */
export async function addProductToCart(product: Product) {
  const { error } = await supabase.from('cart').insert([
    { product_id: product.id, title: product.title, price: product.price },
  ]);
  return { error };
}

/** Remove a single cart row (by its Supabase row id) from the cart table. */
export async function removeCartItem(cartItemId: number) {
  const { error } = await supabase.from('cart').delete().eq('id', cartItemId);
  return { error };
}

/** Sum the price of every item currently in the cart. */
export function calculateCartTotal(cart: { price: number }[]): number {
  return cart.reduce((acc, curr) => acc + curr.price, 0);
}
