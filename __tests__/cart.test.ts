import { expect, test, describe, vi, beforeEach } from 'vitest';

// Mock the Supabase client module before importing anything that uses it.
const mockInsert = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();
const mockSelect = vi.fn();
const mockFrom = vi.fn();

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

// Import the real application code under test (not re-implemented in the test).
import {
  calculateCartTotal,
  fetchProducts,
  fetchCartItems,
  addProductToCart,
  removeCartItem,
  type Product,
} from '@/lib/cart';

beforeEach(() => {
  vi.restoreAllMocks();
  mockFrom.mockReset();
  mockInsert.mockReset();
  mockDelete.mockReset();
  mockEq.mockReset();
  mockSelect.mockReset();

  mockFrom.mockImplementation(() => ({
    select: mockSelect,
    insert: mockInsert,
    delete: mockDelete,
  }));
});

describe('calculateCartTotal', () => {
  test('sums the price of every item in the cart', () => {
    const cart = [{ price: 10 }, { price: 20 }, { price: 15 }];
    expect(calculateCartTotal(cart)).toBe(45);
  });

  test('returns 0 for an empty cart (edge case flagged in Sprint 1 retro)', () => {
    expect(calculateCartTotal([])).toBe(0);
  });
});

describe('fetchProducts', () => {
  test('returns the parsed product list on a successful response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([{ id: 1, title: 'Mock Shirt', price: 10.99, image: 'x.png' }]),
    }) as unknown as typeof fetch;

    const products = await fetchProducts();

    expect(global.fetch).toHaveBeenCalledWith('https://fakestoreapi.com/products');
    expect(products).toHaveLength(1);
    expect(products[0].title).toBe('Mock Shirt');
  });

  test('throws when the API responds with a non-2xx status (failed API call edge case)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    }) as unknown as typeof fetch;

    await expect(fetchProducts()).rejects.toThrow('Failed to fetch products: 500');
  });

  test('propagates a network failure instead of hanging', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network down'));

    await expect(fetchProducts()).rejects.toThrow('network down');
  });
});

describe('fetchCartItems', () => {
  test('returns cart rows from Supabase', async () => {
    mockSelect.mockResolvedValue({ data: [{ id: 1, product_id: 1, title: 'Shirt', price: 10 }], error: null });

    const items = await fetchCartItems();

    expect(mockFrom).toHaveBeenCalledWith('cart');
    expect(items).toEqual([{ id: 1, product_id: 1, title: 'Shirt', price: 10 }]);
  });

  test('returns an empty array when the cart table has no rows', async () => {
    mockSelect.mockResolvedValue({ data: [], error: null });

    const items = await fetchCartItems();

    expect(items).toEqual([]);
  });

  test('throws when Supabase returns an error', async () => {
    mockSelect.mockResolvedValue({ data: null, error: new Error('db unreachable') });

    await expect(fetchCartItems()).rejects.toThrow('db unreachable');
  });
});

describe('addProductToCart', () => {
  test('inserts the product into the cart table', async () => {
    mockInsert.mockResolvedValue({ error: null });
    const product: Product = { id: 1, title: 'Test Product', price: 99.99, image: 'x.png' };

    const { error } = await addProductToCart(product);

    expect(mockFrom).toHaveBeenCalledWith('cart');
    expect(mockInsert).toHaveBeenCalledWith([
      { product_id: 1, title: 'Test Product', price: 99.99 },
    ]);
    expect(error).toBeNull();
  });
});

describe('removeCartItem', () => {
  test('deletes the row matching the given cart item id', async () => {
    mockEq.mockResolvedValue({ error: null });
    mockDelete.mockReturnValue({ eq: mockEq });

    const { error } = await removeCartItem(42);

    expect(mockFrom).toHaveBeenCalledWith('cart');
    expect(mockEq).toHaveBeenCalledWith('id', 42);
    expect(error).toBeNull();
  });
});
