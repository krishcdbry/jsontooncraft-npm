import { convertAll } from '../src/index';

describe('index (convertAll)', () => {
  test('converts data to all formats', () => {
    const data = {
      name: 'John',
      age: 30,
      isActive: true,
    };

    const result = convertAll(data, 'User');

    expect(result).toHaveProperty('typescript');
    expect(result).toHaveProperty('zod');
    expect(result).toHaveProperty('openapi');
    expect(result).toHaveProperty('toon');
    expect(result).toHaveProperty('tokenStats');
  });

  test('generates valid TypeScript interface', () => {
    const data = { id: 1, name: 'Test' };
    const result = convertAll(data, 'TestInterface');

    expect(result.typescript).toContain('export interface TestInterface');
    expect(result.typescript).toContain('id: number');
    expect(result.typescript).toContain('name: string');
  });

  test('generates valid Zod schema', () => {
    const data = { id: 1, name: 'Test' };
    const result = convertAll(data, 'TestSchema');

    expect(result.zod).toContain("import { z } from 'zod'");
    expect(result.zod).toContain('export const TestSchema');
    expect(result.zod).toContain('z.object({');
  });

  test('generates valid OpenAPI schema', () => {
    const data = { id: 1, name: 'Test' };
    const result = convertAll(data, 'TestAPI');

    const parsed = JSON.parse(result.openapi);
    expect(parsed.openapi).toBe('3.1.0');
    expect(parsed.components.schemas.TestAPI).toBeDefined();
  });

  test('generates valid TOON format', () => {
    const data = { id: 1, name: 'Test' };
    const result = convertAll(data, 'TestTOON');

    const parsed = JSON.parse(result.toon);
    expect(parsed).toHaveProperty('k');
    expect(parsed).toHaveProperty('v');
    expect(parsed.k).toContain('id');
    expect(parsed.k).toContain('name');
  });

  test('generates token statistics', () => {
    const data = { id: 1, name: 'Test' };
    const result = convertAll(data, 'TestStats');

    expect(result.tokenStats).toHaveProperty('json');
    expect(result.tokenStats).toHaveProperty('toon');
    expect(result.tokenStats).toHaveProperty('savings');
    expect(typeof result.tokenStats.json).toBe('number');
    expect(typeof result.tokenStats.toon).toBe('number');
    expect(typeof result.tokenStats.savings).toBe('number');
  });

  test('uses default interface name when not provided', () => {
    const data = { key: 'value' };
    const result = convertAll(data);

    expect(result.typescript).toContain('export interface GeneratedInterface');
    expect(result.zod).toContain('export const generatedSchema');
  });

  test('handles complex nested data', () => {
    const data = {
      id: 123,
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        contact: {
          email: 'john@example.com',
          phone: '555-1234',
        },
      },
      tags: ['developer', 'typescript'],
    };

    const result = convertAll(data, 'ComplexData');

    expect(result.typescript).toContain('export interface ComplexData');
    expect(result.zod).toContain('export const ComplexDataSchema');
    expect(() => JSON.parse(result.openapi)).not.toThrow();
    expect(() => JSON.parse(result.toon)).not.toThrow();
    expect(result.tokenStats.json).toBeGreaterThan(0);
    expect(result.tokenStats.toon).toBeGreaterThan(0);
  });

  test('handles arrays', () => {
    const data = {
      numbers: [1, 2, 3],
      users: [
        { id: 1, name: 'User1' },
        { id: 2, name: 'User2' },
      ],
    };

    const result = convertAll(data, 'ArrayData');

    expect(result.typescript).toContain('numbers: number[]');
    expect(result.zod).toContain('z.array(');
    expect(() => JSON.parse(result.openapi)).not.toThrow();
  });

  test('handles empty object', () => {
    const data = {};
    const result = convertAll(data, 'EmptyData');

    expect(result.typescript).toBeDefined();
    expect(result.zod).toBeDefined();
    expect(result.openapi).toBeDefined();
    expect(result.toon).toBeDefined();
    expect(result.tokenStats).toBeDefined();
  });

  test('handles various data types', () => {
    const data = {
      string: 'text',
      number: 42,
      boolean: true,
      null: null,
      array: [1, 2, 3],
      object: { nested: 'value' },
    };

    const result = convertAll(data, 'MixedTypes');

    expect(result.typescript).toContain('string: string');
    expect(result.typescript).toContain('number: number');
    expect(result.typescript).toContain('boolean: boolean');
    expect(result.zod).toContain('z.string()');
    expect(result.zod).toContain('z.number()');
    expect(result.zod).toContain('z.boolean()');
  });

  test('all outputs are non-empty strings', () => {
    const data = { test: 'value' };
    const result = convertAll(data, 'Test');

    expect(typeof result.typescript).toBe('string');
    expect(typeof result.zod).toBe('string');
    expect(typeof result.openapi).toBe('string');
    expect(typeof result.toon).toBe('string');
    expect(result.typescript.length).toBeGreaterThan(0);
    expect(result.zod.length).toBeGreaterThan(0);
    expect(result.openapi.length).toBeGreaterThan(0);
    expect(result.toon.length).toBeGreaterThan(0);
  });

  test('OpenAPI output is valid JSON', () => {
    const data = { test: 'value' };
    const result = convertAll(data, 'Test');

    expect(() => JSON.parse(result.openapi)).not.toThrow();
  });

  test('TOON output is valid JSON', () => {
    const data = { test: 'value' };
    const result = convertAll(data, 'Test');

    expect(() => JSON.parse(result.toon)).not.toThrow();
  });

  test('token savings is within valid range', () => {
    const data = { test: 'value' };
    const result = convertAll(data, 'Test');

    expect(result.tokenStats.savings).toBeGreaterThanOrEqual(0);
    expect(result.tokenStats.savings).toBeLessThanOrEqual(100);
  });

  test('handles large dataset', () => {
    const data = {
      users: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `User${i + 1}`,
        email: `user${i + 1}@example.com`,
        profile: {
          age: 20 + i,
          role: 'user',
        },
      })),
    };

    const result = convertAll(data, 'LargeData');

    expect(result.typescript).toBeDefined();
    expect(result.zod).toBeDefined();
    expect(result.openapi).toBeDefined();
    expect(result.toon).toBeDefined();
    expect(result.tokenStats.json).toBeGreaterThan(0);
  });
});
