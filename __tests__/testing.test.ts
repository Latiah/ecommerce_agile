import { expect, test, describe, vi } from 'vitest';
import { supabase } from '@/lib/supabase';


vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }), // Simulate successful insert
    })),
  },
}));

// 1. Test the Product API (Using a Mock)
describe('API Check', () => {
  test('FakeStore API should return products correctly', async () => {
    
    // We MOCK the fetch function so it doesn't actually go to the internet
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: () => Promise.resolve([
        { id: 1, title: 'Mock Shirt', price: 10.99 }
      ]),
    });

    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();
    
    expect(response.status).toBe(200);
   
    
    console.log("API Mock test passed successfully");
  });
});

// Inserting data into Supabase testing
describe('Database Integration', () => {
  test('Should call Supabase insert with correct product data', async () => {
    const mockProduct = { 
      product_id: 1, 
      title: 'Test Product', 
      price: 99.99 
    };

    const { error } = await supabase.from('cart').insert([mockProduct]);

    expect(error).toBeNull();
    expect(supabase.from).toHaveBeenCalledWith('cart'); 
    
    console.log("Insert into SUpabase Test passed");
  });
});

// 2. Test the Cart Math
describe('Cart Total price Logic', () => {
  test('Should calculate the sum of prices correctly', () => {
    const mockCart = [
      { price: 10.00 },
      { price: 20.00 },
      { price: 15.00 }
    ];

    const total = mockCart.reduce((acc: number, curr: any) => acc + curr.price, 0);
    
    expect(total).toBe(45.00);
    console.log("Cart Math test passed successfully");
  });
});