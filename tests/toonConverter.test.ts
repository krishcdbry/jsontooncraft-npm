import { jsonToToon, toonToJson } from '../src/toonConverter';

describe('toonConverter', () => {
  describe('jsonToToon', () => {
    test('converts simple object to TOON format', () => {
      const data = {
        name: 'John',
        age: 30,
        isActive: true,
      };

      const result = jsonToToon(data);
      const parsed = JSON.parse(result);

      expect(parsed.k).toEqual(['name', 'age', 'isActive']);
      expect(parsed.v).toEqual(['John', 30, true]);
    });

    test('handles nested objects', () => {
      const data = {
        user: {
          name: 'Alice',
          age: 25,
        },
      };

      const result = jsonToToon(data);
      const parsed = JSON.parse(result);

      expect(parsed.k).toContain('user');
      expect(parsed.v).toBeDefined();
    });

    test('handles arrays', () => {
      const data = {
        items: [1, 2, 3],
        tags: ['a', 'b', 'c'],
      };

      const result = jsonToToon(data);
      const parsed = JSON.parse(result);

      expect(parsed.k).toEqual(['items', 'tags']);
      expect(parsed.v[0]).toEqual([1, 2, 3]);
      expect(parsed.v[1]).toEqual(['a', 'b', 'c']);
    });

    test('handles empty object', () => {
      const data = {};

      const result = jsonToToon(data);
      const parsed = JSON.parse(result);

      expect(parsed.k).toEqual([]);
      expect(parsed.v).toEqual([]);
    });

    test('handles complex nested structure', () => {
      const data = {
        id: 1,
        profile: {
          firstName: 'John',
          lastName: 'Doe',
        },
        tags: ['developer', 'typescript'],
      };

      const result = jsonToToon(data);
      expect(() => JSON.parse(result)).not.toThrow();
    });

    test('preserves data types', () => {
      const data = {
        string: 'text',
        number: 42,
        boolean: true,
        null: null,
      };

      const result = jsonToToon(data);
      const parsed = JSON.parse(result);

      expect(parsed.v).toContain('text');
      expect(parsed.v).toContain(42);
      expect(parsed.v).toContain(true);
      expect(parsed.v).toContain(null);
    });
  });

  describe('toonToJson', () => {
    test('converts TOON format back to JSON', () => {
      const toonData = {
        k: ['name', 'age', 'isActive'],
        v: ['John', 30, true],
      };

      const result = toonToJson(toonData);

      expect(result).toEqual({
        name: 'John',
        age: 30,
        isActive: true,
      });
    });

    test('handles TOON format as string input', () => {
      const toonString = JSON.stringify({
        k: ['name', 'age'],
        v: ['Alice', 25],
      });

      const result = toonToJson(toonString);

      expect(result).toEqual({
        name: 'Alice',
        age: 25,
      });
    });

    test('handles empty TOON data', () => {
      const toonData = {
        k: [],
        v: [],
      };

      const result = toonToJson(toonData);

      expect(result).toEqual({});
    });

    test('handles arrays in TOON format', () => {
      const toonData = {
        k: ['items', 'tags'],
        v: [[1, 2, 3], ['a', 'b', 'c']],
      };

      const result = toonToJson(toonData);

      expect(result).toEqual({
        items: [1, 2, 3],
        tags: ['a', 'b', 'c'],
      });
    });

    test('preserves data types', () => {
      const toonData = {
        k: ['string', 'number', 'boolean', 'null'],
        v: ['text', 42, true, null],
      };

      const result = toonToJson(toonData);

      expect(result.string).toBe('text');
      expect(result.number).toBe(42);
      expect(result.boolean).toBe(true);
      expect(result.null).toBe(null);
    });

    test('throws error for invalid TOON format', () => {
      const invalidData = {
        k: ['key1', 'key2'],
        v: ['value1'], // Mismatched lengths
      };

      expect(() => toonToJson(invalidData)).toThrow();
    });

    test('throws error for missing keys or values', () => {
      const invalidData = {
        k: ['key1'],
      };

      expect(() => toonToJson(invalidData)).toThrow();
    });
  });

  describe('round-trip conversion', () => {
    test('JSON -> TOON -> JSON preserves simple data', () => {
      const original = {
        name: 'Test',
        value: 123,
        active: true,
      };

      const toon = jsonToToon(original);
      const result = toonToJson(toon);

      expect(result).toEqual(original);
    });

    test('JSON -> TOON -> JSON preserves arrays', () => {
      const original = {
        numbers: [1, 2, 3],
        strings: ['a', 'b', 'c'],
      };

      const toon = jsonToToon(original);
      const result = toonToJson(toon);

      expect(result).toEqual(original);
    });

    test('JSON -> TOON -> JSON preserves nested objects', () => {
      const original = {
        user: {
          name: 'John',
          age: 30,
        },
      };

      const toon = jsonToToon(original);
      const result = toonToJson(toon);

      expect(result).toEqual(original);
    });

    test('JSON -> TOON -> JSON preserves complex structure', () => {
      const original = {
        id: 1,
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          contact: {
            email: 'john@example.com',
            phone: '555-1234',
          },
        },
        tags: ['developer', 'typescript'],
        metadata: {
          created: '2024-01-01',
          modified: '2024-01-15',
        },
      };

      const toon = jsonToToon(original);
      const result = toonToJson(toon);

      expect(result).toEqual(original);
    });
  });
});
