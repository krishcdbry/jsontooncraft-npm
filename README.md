# jsontooncraft

[![npm version](https://badge.fury.io/js/jsontooncraft.svg)](https://www.npmjs.com/package/jsontooncraft)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful TypeScript library that converts JSON data to multiple formats: TypeScript interfaces, Zod schemas, OpenAPI schemas, and TOON (Token-Optimized Object Notation) format. Perfect for developers working with APIs, data validation, and schema generation.

**🌐 Website:** [jsontooncraft.com](https://jsontooncraft.com)
**📦 npm:** [npmjs.com/package/jsontooncraft](https://www.npmjs.com/package/jsontooncraft)

## Features

- **TypeScript Interface Generation**: Convert JSON to TypeScript interfaces with proper type inference
- **Zod Schema Generation**: Create Zod validation schemas from JSON data
- **OpenAPI Schema Generation**: Generate OpenAPI 3.1 compatible schemas
- **TOON Format Conversion**: Convert between JSON and TOON (Token-Optimized Object Notation)
- **Token Usage Analysis**: Estimate and compare token usage across different formats
- **Convert All**: Generate all formats with a single function call

## Installation

```bash
npm install jsontooncraft
```

Or with yarn:

```bash
yarn add jsontooncraft
```

## Quick Start

```typescript
import { convertAll } from 'jsontooncraft';

const sampleData = {
  id: 123,
  name: "Alice",
  email: "alice@example.com",
  isActive: true,
  tags: ["developer", "typescript"],
  metadata: {
    role: "admin",
    lastLogin: "2024-01-15"
  }
};

// Convert to all formats at once
const result = convertAll(sampleData, 'User');

console.log(result.typescript);  // TypeScript interface
console.log(result.zod);         // Zod schema
console.log(result.openapi);     // OpenAPI schema
console.log(result.toon);        // TOON format
console.log(result.tokenStats);  // Token usage comparison
```

## API Reference

### convertAll(data, interfaceName?)

Converts JSON data to all supported formats in one call.

**Parameters:**
- `data: any` - The JSON data to convert
- `interfaceName?: string` - Optional name for the generated interface/schema (default: "GeneratedInterface")

**Returns:**
```typescript
{
  typescript: string;      // TypeScript interface
  zod: string;            // Zod schema
  openapi: string;        // OpenAPI schema (JSON string)
  toon: string;           // TOON format (JSON string)
  tokenStats: {
    json: number;         // Estimated tokens for JSON
    toon: number;         // Estimated tokens for TOON
    savings: number;      // Token savings (percentage)
  }
}
```

**Example:**
```typescript
import { convertAll } from 'jsontooncraft';

const user = {
  userId: 1,
  username: "john_doe",
  profile: {
    firstName: "John",
    lastName: "Doe",
    age: 30
  }
};

const result = convertAll(user, 'UserProfile');
```

### jsonToTypeScript(data, interfaceName?)

Generates a TypeScript interface from JSON data.

**Parameters:**
- `data: any` - The JSON data to convert
- `interfaceName?: string` - Name for the interface (default: "GeneratedInterface")

**Returns:** `string` - TypeScript interface definition

**Example:**
```typescript
import { jsonToTypeScript } from 'jsontooncraft';

const product = {
  productId: "ABC123",
  name: "Laptop",
  price: 999.99,
  inStock: true,
  specs: {
    cpu: "Intel i7",
    ram: 16
  }
};

const tsInterface = jsonToTypeScript(product, 'Product');
console.log(tsInterface);
```

**Output:**
```typescript
export interface Product {
  productId: string;
  name: string;
  price: number;
  inStock: boolean;
  specs: {
    cpu: string;
    ram: number;
  };
}
```

### jsonToZod(data, schemaName?)

Generates a Zod validation schema from JSON data.

**Parameters:**
- `data: any` - The JSON data to convert
- `schemaName?: string` - Name for the schema (default: "generatedSchema")

**Returns:** `string` - Zod schema definition

**Example:**
```typescript
import { jsonToZod } from 'jsontooncraft';

const config = {
  apiKey: "secret123",
  timeout: 5000,
  retryAttempts: 3,
  features: {
    logging: true,
    analytics: false
  }
};

const zodSchema = jsonToZod(config, 'ConfigSchema');
console.log(zodSchema);
```

**Output:**
```typescript
import { z } from 'zod';

export const ConfigSchema = z.object({
  apiKey: z.string(),
  timeout: z.number(),
  retryAttempts: z.number(),
  features: z.object({
    logging: z.boolean(),
    analytics: z.boolean(),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;
```

### jsonToOpenAPI(data, schemaName?)

Generates an OpenAPI 3.1 schema from JSON data.

**Parameters:**
- `data: any` - The JSON data to convert
- `schemaName?: string` - Name for the schema (default: "GeneratedSchema")

**Returns:** `string` - OpenAPI schema as JSON string

**Example:**
```typescript
import { jsonToOpenAPI } from 'jsontooncraft';

const apiResponse = {
  status: "success",
  data: {
    items: [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" }
    ],
    total: 2
  }
};

const openApiSchema = jsonToOpenAPI(apiResponse, 'ApiResponse');
const schema = JSON.parse(openApiSchema);
console.log(JSON.stringify(schema, null, 2));
```

**Output:**
```json
{
  "openapi": "3.1.0",
  "components": {
    "schemas": {
      "ApiResponse": {
        "type": "object",
        "properties": {
          "status": { "type": "string" },
          "data": {
            "type": "object",
            "properties": {
              "items": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "number" },
                    "name": { "type": "string" }
                  }
                }
              },
              "total": { "type": "number" }
            }
          }
        }
      }
    }
  }
}
```

### jsonToToon(data)

Converts JSON to TOON (Token-Optimized Object Notation) format.

**Parameters:**
- `data: any` - The JSON data to convert

**Returns:** `string` - TOON format as JSON string

**Example:**
```typescript
import { jsonToToon } from 'jsontooncraft';

const data = {
  userName: "alice",
  userEmail: "alice@example.com",
  userRole: "admin",
  userStatus: "active"
};

const toonFormat = jsonToToon(data);
console.log(JSON.parse(toonFormat));
```

**Output:**
```json
{
  "k": ["userName", "userEmail", "userRole", "userStatus"],
  "v": ["alice", "alice@example.com", "admin", "active"]
}
```

### toonToJson(toonData)

Converts TOON format back to standard JSON.

**Parameters:**
- `toonData: string | object` - TOON formatted data (string or parsed object)

**Returns:** `any` - Standard JSON object

**Example:**
```typescript
import { toonToJson } from 'jsontooncraft';

const toonData = {
  k: ["id", "name", "active"],
  v: [123, "Bob", true]
};

const json = toonToJson(toonData);
console.log(json);
// Output: { id: 123, name: "Bob", active: true }
```

### estimateTokens(data)

Estimates token usage for JSON data.

**Parameters:**
- `data: any` - The data to analyze

**Returns:** `number` - Estimated token count

**Example:**
```typescript
import { estimateTokens } from 'jsontooncraft';

const largeData = {
  // ... your data
};

const tokenCount = estimateTokens(largeData);
console.log(`Estimated tokens: ${tokenCount}`);
```

### compareTokens(jsonData, toonData)

Compares token usage between JSON and TOON formats.

**Parameters:**
- `jsonData: any` - Original JSON data
- `toonData: any` - TOON formatted data

**Returns:**
```typescript
{
  json: number;      // Tokens for JSON
  toon: number;      // Tokens for TOON
  savings: number;   // Percentage saved
}
```

**Example:**
```typescript
import { jsonToToon, compareTokens } from 'jsontooncraft';

const originalData = {
  customerName: "John Smith",
  customerEmail: "john@example.com",
  customerPhone: "555-1234"
};

const toonData = JSON.parse(jsonToToon(originalData));
const comparison = compareTokens(originalData, toonData);

console.log(`JSON tokens: ${comparison.json}`);
console.log(`TOON tokens: ${comparison.toon}`);
console.log(`Savings: ${comparison.savings.toFixed(2)}%`);
```

## Use Cases

### 1. API Response Validation

```typescript
import { jsonToZod } from 'jsontooncraft';

// Get sample API response
const apiResponse = await fetch('/api/users/1').then(r => r.json());

// Generate Zod schema
const schema = jsonToZod(apiResponse, 'UserResponse');

// Use in your validation logic
// Copy the generated schema to your codebase
```

### 2. TypeScript Type Generation

```typescript
import { jsonToTypeScript } from 'jsontooncraft';

// Load configuration JSON
const config = require('./config.json');

// Generate TypeScript interface
const types = jsonToTypeScript(config, 'AppConfig');

// Save to types file
fs.writeFileSync('src/types/config.d.ts', types);
```

### 3. OpenAPI Documentation

```typescript
import { jsonToOpenAPI } from 'jsontooncraft';

// Example request/response
const exampleData = {
  id: 1,
  title: "Example",
  tags: ["api", "docs"]
};

// Generate OpenAPI schema
const schema = jsonToOpenAPI(exampleData, 'ExampleModel');

// Add to your OpenAPI spec
```

### 4. Token Optimization for LLM APIs

```typescript
import { jsonToToon, compareTokens } from 'jsontooncraft';

// Large dataset for LLM context
const contextData = {
  documentTitle: "Annual Report",
  documentAuthor: "John Doe",
  documentDate: "2024-01-15",
  // ... more fields
};

// Convert to TOON to save tokens
const toonFormat = jsonToToon(contextData);
const stats = compareTokens(contextData, JSON.parse(toonFormat));

console.log(`Save ${stats.savings.toFixed(1)}% tokens using TOON!`);
```

### 5. Full Conversion Pipeline

```typescript
import { convertAll } from 'jsontooncraft';
import fs from 'fs';

// Sample data
const userData = {
  userId: 12345,
  profile: {
    name: "Jane Developer",
    email: "jane@dev.com",
    skills: ["TypeScript", "React", "Node.js"]
  },
  preferences: {
    theme: "dark",
    notifications: true
  }
};

// Convert to all formats
const result = convertAll(userData, 'UserData');

// Save each format
fs.writeFileSync('types/user.ts', result.typescript);
fs.writeFileSync('schemas/user.zod.ts', result.zod);
fs.writeFileSync('schemas/user.openapi.json', result.openapi);
fs.writeFileSync('data/user.toon.json', result.toon);

console.log('Token savings with TOON:', result.tokenStats.savings, '%');
```

## Advanced Examples

### Nested Object Handling

```typescript
import { jsonToTypeScript, jsonToZod } from 'jsontooncraft';

const complexData = {
  organization: {
    id: "org-123",
    name: "Acme Corp",
    departments: [
      {
        id: "dept-1",
        name: "Engineering",
        employees: [
          {
            id: "emp-1",
            name: "Alice",
            role: "Engineer"
          }
        ]
      }
    ]
  }
};

// Generate TypeScript interface
const tsInterface = jsonToTypeScript(complexData, 'Organization');

// Generate Zod schema
const zodSchema = jsonToZod(complexData, 'OrganizationSchema');

console.log(tsInterface);
console.log(zodSchema);
```

### Array Type Detection

```typescript
import { jsonToTypeScript } from 'jsontooncraft';

const arrayData = {
  numbers: [1, 2, 3],
  strings: ["a", "b", "c"],
  mixed: [1, "text", true],
  objects: [
    { id: 1, name: "One" },
    { id: 2, name: "Two" }
  ]
};

const types = jsonToTypeScript(arrayData, 'ArrayTypes');
console.log(types);
```

**Output:**
```typescript
export interface ArrayTypes {
  numbers: number[];
  strings: string[];
  mixed: any[];
  objects: {
    id: number;
    name: string;
  }[];
}
```

## TOON Format Explained

TOON (Token-Optimized Object Notation) is designed to reduce token usage when working with LLMs by separating keys and values:

**Standard JSON:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "isActive": true,
  "roles": ["admin", "user"]
}
```

**TOON Format:**
```
id: 1
name: John Doe
email: john@example.com
isActive: true
roles[2]: admin,user
```

**Benefits:**
- **YAML-like syntax**: Clean, human-readable format
- **Compact arrays**: `key[count]: val1,val2,val3` notation
- **Token efficient**: Reduces formatting overhead
- **Nested structure support**: Handles complex objects with indentation
- **Bidirectional**: Easy conversion between JSON and TOON

## TypeScript Support

This package is written in TypeScript and includes full type definitions. All functions are fully typed for the best development experience.

```typescript
import type { TokenStats } from 'jsontooncraft';

const stats: TokenStats = {
  json: 150,
  toon: 100,
  savings: 33.33
};
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Issues

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/krishcdbry/jsontooncraft-npm/issues).

## Author

Created by [Krish](https://github.com/krishcdbry)

## Links

- 🌐 **Website**: [jsontooncraft.com](https://jsontooncraft.com)
- 📦 **npm Package**: [npmjs.com/package/jsontooncraft](https://www.npmjs.com/package/jsontooncraft)
- 💻 **GitHub Repository**: [github.com/krishcdbry/jsontooncraft-npm](https://github.com/krishcdbry/jsontooncraft-npm)
- 📖 **Documentation**: [jsontooncraft.com/docs](https://jsontooncraft.com)
