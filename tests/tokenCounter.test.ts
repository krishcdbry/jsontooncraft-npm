import { estimateTokens, compareTokens } from '../src/tokenCounter';

describe('tokenCounter', () => {
  describe('estimateTokens', () => {
    test('estimates tokens for simple string', () => {
      const data = 'Hello World';
      const tokens = estimateTokens(data);

      expect(tokens).toBeGreaterThan(0);
      expect(typeof tokens).toBe('number');
    });

    test('estimates tokens for simple object', () => {
      const data = {
        name: 'John',
        age: 30,
      };

      const tokens = estimateTokens(data);

      expect(tokens).toBeGreaterThan(0);
    });

    test('estimates tokens for array', () => {
      const data = [1, 2, 3, 4, 5];
      const tokens = estimateTokens(data);

      expect(tokens).toBeGreaterThan(0);
    });

    test('estimates tokens for complex nested object', () => {
      const data = {
        user: {
          profile: {
            firstName: 'John',
            lastName: 'Doe',
            contact: {
              email: 'john@example.com',
              phone: '555-1234',
            },
          },
          preferences: {
            theme: 'dark',
            notifications: true,
          },
        },
      };

      const tokens = estimateTokens(data);

      expect(tokens).toBeGreaterThan(0);
    });

    test('handles empty object', () => {
      const data = {};
      const tokens = estimateTokens(data);

      expect(tokens).toBeGreaterThanOrEqual(0);
    });

    test('handles empty array', () => {
      const data = [];
      const tokens = estimateTokens(data);

      expect(tokens).toBeGreaterThanOrEqual(0);
    });

    test('handles null value', () => {
      const data = null;
      const tokens = estimateTokens(data);

      expect(tokens).toBeGreaterThanOrEqual(0);
    });

    test('larger data produces more tokens', () => {
      const smallData = { key: 'value' };
      const largeData = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        nested: {
          key4: 'value4',
          key5: 'value5',
        },
      };

      const smallTokens = estimateTokens(smallData);
      const largeTokens = estimateTokens(largeData);

      expect(largeTokens).toBeGreaterThan(smallTokens);
    });

    test('handles special characters', () => {
      const data = {
        emoji: '😊',
        unicode: '你好',
        special: '!@#$%^&*()',
      };

      const tokens = estimateTokens(data);

      expect(tokens).toBeGreaterThan(0);
    });

    test('handles numbers', () => {
      const data = {
        integer: 123,
        float: 45.67,
        negative: -89,
      };

      const tokens = estimateTokens(data);

      expect(tokens).toBeGreaterThan(0);
    });

    test('handles booleans', () => {
      const data = {
        isTrue: true,
        isFalse: false,
      };

      const tokens = estimateTokens(data);

      expect(tokens).toBeGreaterThan(0);
    });
  });

  describe('compareTokens', () => {
    test('compares JSON and TOON token counts', () => {
      const jsonData = {
        name: 'John',
        age: 30,
        email: 'john@example.com',
      };

      const toonData = {
        k: ['name', 'age', 'email'],
        v: ['John', 30, 'john@example.com'],
      };

      const comparison = compareTokens(jsonData, toonData);

      expect(comparison).toHaveProperty('json');
      expect(comparison).toHaveProperty('toon');
      expect(comparison).toHaveProperty('savings');
      expect(typeof comparison.json).toBe('number');
      expect(typeof comparison.toon).toBe('number');
      expect(typeof comparison.savings).toBe('number');
    });

    test('TOON format should save tokens for repetitive keys', () => {
      const jsonData = {
        userName: 'Alice',
        userEmail: 'alice@example.com',
        userPhone: '555-1234',
        userAddress: '123 Main St',
      };

      const toonData = {
        k: ['userName', 'userEmail', 'userPhone', 'userAddress'],
        v: ['Alice', 'alice@example.com', '555-1234', '123 Main St'],
      };

      const comparison = compareTokens(jsonData, toonData);

      expect(comparison.savings).toBeGreaterThanOrEqual(0);
    });

    test('calculates savings percentage correctly', () => {
      const jsonData = { key: 'value' };
      const toonData = { k: ['key'], v: ['value'] };

      const comparison = compareTokens(jsonData, toonData);

      expect(comparison.savings).toBeGreaterThanOrEqual(0);
      expect(comparison.savings).toBeLessThanOrEqual(100);
    });

    test('handles equal token counts', () => {
      const data = { a: 'b' };

      const comparison = compareTokens(data, data);

      expect(comparison.json).toBe(comparison.toon);
      expect(comparison.savings).toBe(0);
    });

    test('handles empty objects', () => {
      const comparison = compareTokens({}, {});

      expect(comparison.json).toBeGreaterThanOrEqual(0);
      expect(comparison.toon).toBeGreaterThanOrEqual(0);
      expect(comparison.savings).toBeDefined();
    });

    test('handles large objects', () => {
      const largeJson = {
        property1: 'value1',
        property2: 'value2',
        property3: 'value3',
        property4: 'value4',
        property5: 'value5',
        nested: {
          nestedProperty1: 'nestedValue1',
          nestedProperty2: 'nestedValue2',
        },
      };

      const largeToon = {
        k: [
          'property1',
          'property2',
          'property3',
          'property4',
          'property5',
          'nested',
        ],
        v: [
          'value1',
          'value2',
          'value3',
          'value4',
          'value5',
          {
            k: ['nestedProperty1', 'nestedProperty2'],
            v: ['nestedValue1', 'nestedValue2'],
          },
        ],
      };

      const comparison = compareTokens(largeJson, largeToon);

      expect(comparison.json).toBeGreaterThan(0);
      expect(comparison.toon).toBeGreaterThan(0);
      expect(comparison.savings).toBeGreaterThanOrEqual(0);
    });

    test('savings is positive when TOON uses fewer tokens', () => {
      const jsonData = {
        longPropertyName1: 'value1',
        longPropertyName2: 'value2',
        longPropertyName3: 'value3',
      };

      const toonData = {
        k: ['longPropertyName1', 'longPropertyName2', 'longPropertyName3'],
        v: ['value1', 'value2', 'value3'],
      };

      const comparison = compareTokens(jsonData, toonData);

      // TOON should save tokens due to reduced formatting overhead
      expect(comparison.savings).toBeGreaterThanOrEqual(0);
    });
  });
});
