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

      expect(result).toContain('name: John');
      expect(result).toContain('age: 30');
      expect(result).toContain('isActive: true');
    });

    test('handles nested objects', () => {
      const data = {
        user: {
          name: 'Alice',
          age: 25,
        },
      };

      const result = jsonToToon(data);

      expect(result).toContain('user:');
      expect(result).toContain('name: Alice');
      expect(result).toContain('age: 25');
    });

    test('handles arrays', () => {
      const data = {
        items: [1, 2, 3],
        tags: ['a', 'b', 'c'],
      };

      const result = jsonToToon(data);

      expect(result).toContain('items[3]: 1,2,3');
      expect(result).toContain('tags[3]: a,b,c');
    });

    test('handles empty object', () => {
      const data = {};

      const result = jsonToToon(data);

      expect(result).toBe('');
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

      expect(result).toContain('id: 1');
      expect(result).toContain('profile:');
      expect(result).toContain('firstName: John');
      expect(result).toContain('tags[2]: developer,typescript');
    });

    test('preserves data types', () => {
      const data = {
        string: 'text',
        number: 42,
        boolean: true,
        nullValue: null,
      };

      const result = jsonToToon(data);

      expect(result).toContain('string: text');
      expect(result).toContain('number: 42');
      expect(result).toContain('boolean: true');
      expect(result).toContain('nullValue: null');
    });
  });

  describe('toonToJson', () => {
    test('converts TOON format back to JSON', () => {
      const toonString = 'name: John\nage: 30\nisActive: true';

      const result = toonToJson(toonString);

      expect(result).toEqual({
        name: 'John',
        age: 30,
        isActive: true,
      });
    });

    test('handles arrays in TOON format', () => {
      const toonString = 'items[3]: 1,2,3\ntags[3]: a,b,c';

      const result = toonToJson(toonString);

      expect(result.items).toEqual([1, 2, 3]);
      expect(result.tags).toEqual(['a', 'b', 'c']);
    });

    test('handles nested objects', () => {
      const toonString = 'user:\n  name: Alice\n  age: 25';

      const result = toonToJson(toonString);

      expect(result.user).toBeDefined();
      expect(result.user.name).toBe('Alice');
      expect(result.user.age).toBe(25);
    });

    test('preserves data types', () => {
      const toonString = 'string: text\nnumber: 42\nboolean: true\nnullValue: null';

      const result = toonToJson(toonString);

      expect(result.string).toBe('text');
      expect(result.number).toBe(42);
      expect(result.boolean).toBe(true);
      expect(result.nullValue).toBe(null);
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

      expect(result.name).toBe(original.name);
      expect(result.value).toBe(original.value);
      expect(result.active).toBe(original.active);
    });

    test('JSON -> TOON -> JSON preserves arrays', () => {
      const original = {
        numbers: [1, 2, 3],
        strings: ['a', 'b', 'c'],
      };

      const toon = jsonToToon(original);
      const result = toonToJson(toon);

      expect(result.numbers).toEqual(original.numbers);
      expect(result.strings).toEqual(original.strings);
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

      expect(result.user.name).toBe(original.user.name);
      expect(result.user.age).toBe(original.user.age);
    });
  });
});
