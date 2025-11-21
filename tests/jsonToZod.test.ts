import { jsonToZod } from '../src/jsonToZod';

describe('jsonToZod', () => {
  test('converts simple object to Zod schema', () => {
    const data = {
      name: 'John',
      age: 30,
      isActive: true,
    };

    const result = jsonToZod(data, 'UserSchema');

    expect(result).toContain("import { z } from 'zod'");
    expect(result).toContain('export const UserSchema = z.object({');
    expect(result).toContain('name: z.string()');
    expect(result).toContain('age: z.number()');
    expect(result).toContain('isActive: z.boolean()');
    expect(result).toContain('export type User = z.infer<typeof UserSchema>');
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

    const result = jsonToZod(data, 'DataSchema');

    expect(result).toContain('user: z.object({');
    expect(result).toContain('profile: z.object({');
    expect(result).toContain('email: z.string()');
  });

  test('handles arrays of primitives', () => {
    const data = {
      numbers: [1, 2, 3],
      strings: ['a', 'b', 'c'],
      booleans: [true, false],
    };

    const result = jsonToZod(data, 'ArraysSchema');

    expect(result).toContain('numbers: z.array(z.number())');
    expect(result).toContain('strings: z.array(z.string())');
    expect(result).toContain('booleans: z.array(z.boolean())');
  });

  test('handles arrays of objects', () => {
    const data = {
      users: [
        { id: 1, name: 'User1' },
        { id: 2, name: 'User2' },
      ],
    };

    const result = jsonToZod(data, 'UserListSchema');

    expect(result).toContain('users: z.array(z.object({');
    expect(result).toContain('id: z.number()');
    expect(result).toContain('name: z.string()');
  });

  test('handles mixed arrays', () => {
    const data = {
      mixed: [1, 'text', true],
    };

    const result = jsonToZod(data, 'MixedSchema');

    expect(result).toContain('mixed: z.array(z.any())');
  });

  test('handles null values', () => {
    const data = {
      nullValue: null,
    };

    const result = jsonToZod(data, 'WithNullSchema');

    expect(result).toContain('nullValue: z.any()');
  });

  test('handles empty objects', () => {
    const data = {
      emptyObj: {},
    };

    const result = jsonToZod(data, 'WithEmptySchema');

    expect(result).toContain('emptyObj: z.any()');
  });

  test('handles empty arrays', () => {
    const data = {
      emptyArray: [],
    };

    const result = jsonToZod(data, 'WithEmptyArraySchema');

    expect(result).toContain('emptyArray: z.array(z.any())');
  });

  test('uses default schema name when not provided', () => {
    const data = { key: 'value' };

    const result = jsonToZod(data);

    expect(result).toContain('export const generatedSchema = z.object({');
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

    const result = jsonToZod(data, 'ProductSchema');

    expect(result).toContain('export const ProductSchema = z.object({');
    expect(result).toContain('metadata: z.object({');
    expect(result).toContain('tags: z.array(z.string())');
    expect(result).toContain('pricing: z.object({');
    expect(result).toContain('amount: z.number()');
    expect(result).toContain('warehouses: z.array(z.object({');
  });

  test('generates correct type inference', () => {
    const data = {
      userId: 123,
      username: 'john_doe',
    };

    const result = jsonToZod(data, 'UserSchema');

    expect(result).toContain('export type User = z.infer<typeof UserSchema>');
  });

  test('handles special characters in property names', () => {
    const data = {
      'user-id': 123,
      'first_name': 'John',
    };

    const result = jsonToZod(data, 'SpecialSchema');

    expect(result).toContain('"user-id": z.number()');
    expect(result).toContain('first_name: z.string()');
  });
});
