import { expect, test, describe, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';

const mockInsert = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();
const mockSelect = vi.fn();
const mockFrom = vi.fn((_table: string) => ({ // eslint-disable-line @typescript-eslint/no-unused-vars
  select: mockSelect,
  insert: mockInsert,
  delete: mockDelete,
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (table: string) => mockFrom(table),
  },
}));

const sampleProducts = [
  { id: 1, title: 'Blue Backpack', price: 49.99, image: 'backpack.png' },
  { id: 2, title: 'Cotton Jacket', price: 55.99, image: 'jacket.png' },
];

beforeEach(() => {
  vi.restoreAllMocks();
  mockInsert.mockReset();
  mockDelete.mockReset();
  mockEq.mockReset();
  mockSelect.mockReset();

  mockSelect.mockResolvedValue({ data: [], error: null });
  mockInsert.mockResolvedValue({ error: null });
  mockDelete.mockReturnValue({ eq: mockEq });
  mockEq.mockResolvedValue({ error: null });

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(sampleProducts),
  }) as unknown as typeof fetch;
});

describe('Home page', () => {
  test('shows a loading state before products arrive', () => {
    // Freeze the fetch/Supabase promises so the component stays in its
    // initial loading state for the duration of this assertion.
    global.fetch = vi.fn(() => new Promise(() => {})) as unknown as typeof fetch;
    mockSelect.mockReturnValue(new Promise(() => {}));

    render(<Home />);
    expect(screen.getByText('Loading Store...')).toBeInTheDocument();
  });

  test('renders the product grid once products load', async () => {
    render(<Home />);

    expect(await screen.findByText('Blue Backpack')).toBeInTheDocument();
    expect(screen.getByText('Cotton Jacket')).toBeInTheDocument();
  });

  test('shows an error state instead of hanging when the API call fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    }) as unknown as typeof fetch;

    render(<Home />);

    expect(await screen.findByText(/could not load products/i)).toBeInTheDocument();
    expect(screen.queryByText('Loading Store...')).not.toBeInTheDocument();
  });

  test('adding a product calls Supabase insert and refreshes the cart', async () => {
    const user = userEvent.setup();
    mockSelect
      .mockResolvedValueOnce({ data: [], error: null }) // initial cart load
      .mockResolvedValueOnce({
        data: [{ id: 1, product_id: 1, title: 'Blue Backpack', price: 49.99 }],
        error: null,
      }); // cart refresh after add

    render(<Home />);
    await screen.findByText('Blue Backpack');

    const addButtons = screen.getAllByRole('button', { name: /add to cart/i });
    await user.click(addButtons[0]);

    await waitFor(() => expect(mockInsert).toHaveBeenCalledWith([
      { product_id: 1, title: 'Blue Backpack', price: 49.99 },
    ]));
    expect(await screen.findByLabelText(/remove blue backpack from cart/i)).toBeInTheDocument();
  });

  test('removing a cart item calls Supabase delete and updates the total', async () => {
    const user = userEvent.setup();
    mockSelect.mockResolvedValue({
      data: [{ id: 7, product_id: 1, title: 'Blue Backpack', price: 49.99 }],
      error: null,
    });

    render(<Home />);
    const removeButton = await screen.findByLabelText(/remove blue backpack from cart/i);

    await user.click(removeButton);

    await waitFor(() => expect(mockEq).toHaveBeenCalledWith('id', 7));
    expect(await screen.findByText('Empty')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });
});
