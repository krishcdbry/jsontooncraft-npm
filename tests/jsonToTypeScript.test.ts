import { jsonToTypeScript } from '../src/jsonToTypeScript';

describe('jsonToTypeScript', () => {
  test('converts simple object to TypeScript interface', () => {
    const data = {
      name: 'John',
      age: 30,
      isActive: true,
    };

    const result = jsonToTypeScript(data, 'User');

    expect(result).toContain('export interface User');
    expect(result).toContain('name: string');
    expect(result).toContain('age: number');
    expect(result).toContain('isActive: boolean');
  });

  test('handles nested objects', () => {
    const data = {
      user: {
        name: 'Alice',
        profile: {
          age: 25,
          email: 'alice@example.com',
        },
      },
    };

    const result = jsonToTypeScript(data, 'Data');

    expect(result).toContain('export interface Data');
    expect(result).toContain('user: User');
    expect(result).toContain('profile: Profile');
    expect(result).toContain('email: string');
  });

  test('handles arrays of primitives', () => {
    const data = {
      numbers: [1, 2, 3],
      strings: ['a', 'b', 'c'],
      booleans: [true, false],
    };

    const result = jsonToTypeScript(data, 'Arrays');

    expect(result).toContain('numbers: number[]');
    expect(result).toContain('strings: string[]');
    expect(result).toContain('booleans: boolean[]');
  });

  test('handles arrays of objects', () => {
    const data = {
      users: [
        { id: 1, name: 'User1' },
        { id: 2, name: 'User2' },
      ],
    };

    const result = jsonToTypeScript(data, 'UserList');

    expect(result).toContain('users: {');
    expect(result).toContain('id: number');
    expect(result).toContain('name: string');
    expect(result).toContain('}[]');
  });

  test('handles mixed arrays', () => {
    const data = {
      mixed: [1, 'text', true],
    };

    const result = jsonToTypeScript(data, 'Mixed');

    expect(result).toContain('mixed: any[]');
  });

  test('handles null values', () => {
    const data = {
      nullValue: null,
    };

    const result = jsonToTypeScript(data, 'WithNull');

    expect(result).toContain('nullValue: any');
  });

  test('handles empty objects', () => {
    const data = {
      emptyObj: {},
    };

    const result = jsonToTypeScript(data, 'WithEmpty');

    expect(result).toContain('emptyObj: any');
  });

  test('handles empty arrays', () => {
    const data = {
      emptyArray: [],
    };

    const result = jsonToTypeScript(data, 'WithEmptyArray');

    expect(result).toContain('emptyArray: any[]');
  });

  test('uses default interface name when not provided', () => {
    const data = { key: 'value' };

    const result = jsonToTypeScript(data);

    expect(result).toContain('export interface GeneratedInterface');
  });

  test('handles complex nested structure', () => {
    const data = {
      id: 123,
      name: 'Product',
      metadata: {
        tags: ['electronics', 'gadgets'],
        pricing: {
          currency: 'USD',
          amount: 99.99,
        },
        availability: {
          inStock: true,
          warehouses: [
            { id: 'w1', location: 'NY' },
            { id: 'w2', location: 'CA' },
          ],
        },
      },
    };

    const result = jsonToTypeScript(data, 'Product');

    expect(result).toContain('export interface Product');
    expect(result).toContain('metadata: {');
    expect(result).toContain('tags: string[]');
    expect(result).toContain('pricing: {');
    expect(result).toContain('amount: number');
    expect(result).toContain('warehouses: {');
  });

  test('preserves special characters in property names', () => {
    const data = {
      'user-id': 123,
      'first_name': 'John',
    };

    const result = jsonToTypeScript(data, 'Special');

    expect(result).toContain('"user-id": number');
    expect(result).toContain('first_name: string');
  });
});
