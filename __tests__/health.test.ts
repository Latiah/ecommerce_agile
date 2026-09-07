import { expect, test, describe } from 'vitest';
import { GET } from '@/app/api/health/route';

describe('GET /api/health', () => {
  test('returns 200 with an ok status payload', async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe('ok');
    expect(body.service).toBe('ecommerce-agile');
    expect(typeof body.timestamp).toBe('string');
    // Should be a valid, parseable ISO timestamp.
    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
  });
});
