'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
   const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  //  Fetch Products from API
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
        console.log("[INFO] Products loaded from API");
      });
    fetchCart();
  }, []);

  //  Fetch Cart from Supabase
  const fetchCart = async () => {
    const { data } = await supabase.from('cart').select('*');
    if (data) setCart(data);
  };

  //  Add to Cart Logic 
  const addToCart = async (product: any) => {
    console.log(`[ACTION] Adding ${product.title} to database`);
    const { error } = await supabase.from('cart').insert([
      { product_id: product.id, title: product.title, price: product.price }
    ]);
    
    if (error) {
      console.error("[ERROR] Supabase Insert Failed:", error.message);
    } else {
      fetchCart(); // Refresh cart list
    }
  };

  if (loading) return <div className="p-10 text-center text-2xl">Loading Store...</div>;

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
              <img src={p.image} className="h-40 object-contain mb-4" alt={p.title} />
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
          {cart.length === 0 ? <p className="text-gray-500 text-sm">Empty</p> : (
            <ul className="space-y-2">
              {cart.map((item, index) => (
                <li key={index} className="text-xs bg-black p-2 rounded shadow-sm flex justify-between border border-white">
                  <span>{item.title}</span>
                  <span className="font-bold">${item.price}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t mt-4 pt-2 font-bold flex justify-between">
            <span>Total:</span>
            <span>${cart.reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}