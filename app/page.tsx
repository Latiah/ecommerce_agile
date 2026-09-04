'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Product,
  CartItem,
  fetchProducts,
  fetchCartItems,
  addProductToCart,
  removeCartItem,
  calculateCartTotal,
} from '../lib/cart';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setError(null);
      const data = await fetchProducts();
      setProducts(data);
      console.log('[INFO] Products loaded from API');
    } catch (err) {
      console.error('[ERROR] Failed to load products:', err);
      setError('Could not load products right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    try {
      const data = await fetchCartItems();
      setCart(data);
    } catch (err) {
      console.error('[ERROR] Failed to load cart:', err);
    }
  };

  // Fetch Products from API + Cart from Supabase on mount.
  // (One-time initial data load, not a derived-state sync — intentionally
  // calling these here rather than lifting fetching into a library like
  // React Query, which is out of scope for this lab.)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Add to Cart Logic
  const addToCart = async (product: Product) => {
    console.log(`[ACTION] Adding ${product.title} to database`);
    const { error } = await addProductToCart(product);

    if (error) {
      console.error('[ERROR] Supabase Insert Failed:', error.message);
    } else {
      loadCart(); // Refresh cart list
    }
  };

  // Remove from Cart Logic
  const removeFromCart = async (cartItemId: number) => {
    console.log(`[ACTION] Removing cart item ${cartItemId} from database`);
    const { error } = await removeCartItem(cartItemId);

    if (error) {
      console.error('[ERROR] Supabase Delete Failed:', error.message);
    } else {
      setCart(prev => prev.filter(item => item.id !== cartItemId));
    }
  };

  if (loading) return <div className="p-10 text-center text-2xl">Loading Store...</div>;

  if (error) {
    return (
      <div className="p-10 text-center">
        <p className="text-xl text-red-600 mb-4">{error}</p>
        <button
          onClick={() => {
            setLoading(true);
            loadProducts();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <header className="flex justify-between items-center border-b pb-4 mb-8">
        <h1 className="text-3xl font-extrabold text-blue-600">E-Store</h1>
        <div className="bg-black-100 p-2 rounded text-sm font-mono border border-white">
          Cart Items: {cart.length}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p.id} className="border rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <Image
                src={p.image}
                width={160}
                height={160}
                unoptimized
                className="h-40 w-full object-contain mb-4"
                alt={p.title}
              />
              <h2 className="font-bold text-sm h-12 overflow-hidden">{p.title}</h2>
              <p className="text-green-700 font-bold my-2">${p.price}</p>
              <button
                onClick={() => addToCart(p)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <div className="bg-black-50 p-4 rounded-xl border h-fit">
          <h2 className="text-xl font-bold mb-4">Your Cart</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500 text-sm">Empty</p>
          ) : (
            <ul className="space-y-2">
              {cart.map(item => (
                <li
                  key={item.id}
                  className="text-xs bg-black p-2 rounded shadow-sm flex justify-between items-center border border-white"
                >
                  <span>{item.title}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-bold">${item.price}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.title} from cart`}
                      className="text-red-400 hover:text-red-600 font-bold px-1"
                    >
                      ✕
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t mt-4 pt-2 font-bold flex justify-between">
            <span>Total:</span>
            <span>${calculateCartTotal(cart).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
