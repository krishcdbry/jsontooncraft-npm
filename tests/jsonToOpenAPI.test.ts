import { jsonToOpenAPI } from '../src/jsonToOpenAPI';

describe('jsonToOpenAPI', () => {
  test('converts simple object to OpenAPI schema', () => {
    const data = {
      name: 'John',
      age: 30,
      isActive: true,
    };

    const result = jsonToOpenAPI(data, 'User');
    const parsed = JSON.parse(result);

    expect(parsed.openapi).toBe('3.1.0');
    expect(parsed.components.schemas.User).toBeDefined();
    expect(parsed.components.schemas.User.type).toBe('object');
    expect(parsed.components.schemas.User.properties.name.type).toBe('string');
    expect(parsed.components.schemas.User.properties.age.type).toBe('number');
    expect(parsed.components.schemas.User.properties.isActive.type).toBe('boolean');
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

    const result = jsonToOpenAPI(data, 'Data');
    const parsed = JSON.parse(result);

    expect(parsed.components.schemas.Data.properties.user.type).toBe('object');
    expect(parsed.components.schemas.Data.properties.user.properties.profile.type).toBe('object');
    expect(parsed.components.schemas.Data.properties.user.properties.profile.properties.email.type).toBe('string');
  });

  test('handles arrays of primitives', () => {
    const data = {
      numbers: [1, 2, 3],
      strings: ['a', 'b', 'c'],
      booleans: [true, false],
    };

    const result = jsonToOpenAPI(data, 'Arrays');
    const parsed = JSON.parse(result);

    expect(parsed.components.schemas.Arrays.properties.numbers.type).toBe('array');
    expect(parsed.components.schemas.Arrays.properties.numbers.items.type).toBe('number');
    expect(parsed.components.schemas.Arrays.properties.strings.items.type).toBe('string');
    expect(parsed.components.schemas.Arrays.properties.booleans.items.type).toBe('boolean');
  });

  test('handles arrays of objects', () => {
    const data = {
      users: [
        { id: 1, name: 'User1' },
        { id: 2, name: 'User2' },
      ],
    };

    const result = jsonToOpenAPI(data, 'UserList');
    const parsed = JSON.parse(result);

    expect(parsed.components.schemas.UserList.properties.users.type).toBe('array');
    expect(parsed.components.schemas.UserList.properties.users.items.type).toBe('object');
    expect(parsed.components.schemas.UserList.properties.users.items.properties.id.type).toBe('number');
    expect(parsed.components.schemas.UserList.properties.users.items.properties.name.type).toBe('string');
  });

  test('handles mixed arrays', () => {
    const data = {
      mixed: [1, 'text', true],
    };

    const result = jsonToOpenAPI(data, 'Mixed');
    const parsed = JSON.parse(result);

    expect(parsed.components.schemas.Mixed.properties.mixed.type).toBe('array');
  });

  test('handles null values', () => {
    const data = {
      nullValue: null,
    };

    const result = jsonToOpenAPI(data, 'WithNull');
    const parsed = JSON.parse(result);

    expect(parsed.components.schemas.WithNull.properties.nullValue).toBeDefined();
  });

  test('handles empty objects', () => {
    const data = {
      emptyObj: {},
    };

    const result = jsonToOpenAPI(data, 'WithEmpty');
    const parsed = JSON.parse(result);

    expect(parsed.components.schemas.WithEmpty.properties.emptyObj).toBeDefined();
  });

  test('handles empty arrays', () => {
    const data = {
      emptyArray: [],
    };

    const result = jsonToOpenAPI(data, 'WithEmptyArray');
    const parsed = JSON.parse(result);

    expect(parsed.components.schemas.WithEmptyArray.properties.emptyArray.type).toBe('array');
  });

  test('uses default schema name when not provided', () => {
    const data = { key: 'value' };

    const result = jsonToOpenAPI(data);
    const parsed = JSON.parse(result);

    expect(parsed.components.schemas.GeneratedSchema).toBeDefined();
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

    const result = jsonToOpenAPI(data, 'Product');
    const parsed = JSON.parse(result);

    expect(parsed.components.schemas.Product.properties.metadata.type).toBe('object');
    expect(parsed.components.schemas.Product.properties.metadata.properties.tags.type).toBe('array');
    expect(parsed.components.schemas.Product.properties.metadata.properties.pricing.type).toBe('object');
    expect(parsed.components.schemas.Product.properties.metadata.properties.availability.properties.warehouses.type).toBe('array');
  });

  test('generates valid JSON output', () => {
    const data = { test: 'value' };
    const result = jsonToOpenAPI(data, 'Test');

    expect(() => JSON.parse(result)).not.toThrow();
  });

  test('includes openapi version', () => {
    const data = { test: 'value' };
    const result = jsonToOpenAPI(data, 'Test');
    const parsed = JSON.parse(result);

    expect(parsed.openapi).toBe('3.1.0');
  });

  test('includes components section', () => {
    const data = { test: 'value' };
    const result = jsonToOpenAPI(data, 'Test');
    const parsed = JSON.parse(result);

    expect(parsed.components).toBeDefined();
    expect(parsed.components.schemas).toBeDefined();
  });
});
