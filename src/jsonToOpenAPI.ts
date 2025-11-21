/**
 * Convert JSON to OpenAPI 3.1 schema
 */

interface OpenAPISchema {
  type: string;
  properties?: Record<string, unknown>;
  items?: unknown;
  required?: string[];
  [key: string]: unknown;
}

function inferOpenAPIType(value: unknown, definitions: Map<string, OpenAPISchema>): OpenAPISchema {
  if (value === null || value === undefined) {
    return { type: 'null' };
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return {
        type: 'array',
        items: { type: 'object' }
      };
    }
    const firstItem = value[0];
    return {
      type: 'array',
      items: inferOpenAPIType(firstItem, definitions)
    };
  }

  if (typeof value === 'object') {
    return generateOpenAPISchema(value as Record<string, unknown>, definitions);
  }

  const typeMap: Record<string, string> = {
    'string': 'string',
    'number': 'number',
    'boolean': 'boolean',
  };

  return { type: typeMap[typeof value] || 'object' };
}

function generateOpenAPISchema(obj: Record<string, unknown>, definitions: Map<string, OpenAPISchema>): OpenAPISchema {
  const schema: OpenAPISchema = {
    type: 'object',
    properties: {},
    required: []
  };

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      schema.required!.push(key);
    }
    schema.properties![key] = inferOpenAPIType(value, definitions);
  }

  if (schema.required!.length === 0) {
    delete schema.required;
  }

  return schema;
}

export function jsonToOpenAPI(data: any, schemaName: string = 'GeneratedSchema'): string {
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    const definitions = new Map<string, OpenAPISchema>();

    let schema: OpenAPISchema;

    if (Array.isArray(parsed)) {
      schema = {
        type: 'array',
        items: parsed.length > 0 ? inferOpenAPIType(parsed[0], definitions) : { type: 'object' }
      };
    } else {
      schema = generateOpenAPISchema(parsed as Record<string, unknown>, definitions);
    }

    const openAPIDoc = {
      openapi: '3.1.0',
      components: {
        schemas: {
          [schemaName]: schema
        }
      }
    };

    return JSON.stringify(openAPIDoc, null, 2);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
