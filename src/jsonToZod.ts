/**
 * Convert JSON to Zod schemas
 */

function inferZodType(value: unknown, key: string, schemas: Map<string, string>): string {
  if (value === null || value === undefined) {
    return 'z.any().nullable()';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'z.array(z.any())';
    }
    const firstItem = value[0];
    if (typeof firstItem === 'object' && firstItem !== null) {
      const schemaName = capitalizeFirst(key.replace(/s$/, '')) + 'Schema';
      generateZodSchema(firstItem as Record<string, unknown>, schemaName, schemas);
      return `z.array(${schemaName})`;
    }
    return `z.array(z.${typeof firstItem}())`;
  }

  if (typeof value === 'object') {
    const schemaName = capitalizeFirst(key) + 'Schema';
    generateZodSchema(value as Record<string, unknown>, schemaName, schemas);
    return schemaName;
  }

  switch (typeof value) {
    case 'string':
      return 'z.string()';
    case 'number':
      return 'z.number()';
    case 'boolean':
      return 'z.boolean()';
    default:
      return 'z.any()';
  }
}

function capitalizeFirst(str: string): string {
  const cleaned = str.replace(/\[\d*\]/g, '').replace(/[^a-zA-Z0-9]/g, '');
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1) || 'Item';
}

function generateZodSchema(obj: Record<string, unknown>, schemaName: string, schemas: Map<string, string>): void {
  if (schemas.has(schemaName)) {
    return;
  }

  const lines: string[] = [`export const ${schemaName} = z.object({`];

  for (const [key, value] of Object.entries(obj)) {
    const zodType = inferZodType(value, key, schemas);
    lines.push(`  ${key}: ${zodType},`);
  }

  lines.push('});');
  schemas.set(schemaName, lines.join('\n'));
}

export function jsonToZod(data: any, schemaName: string = 'generatedSchema'): string {
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    const schemas = new Map<string, string>();

    const imports = "import { z } from 'zod';\n\n";

    if (Array.isArray(parsed)) {
      if (parsed.length === 0) {
        return `${imports}export const ${schemaName} = z.array(z.any());\n\nexport type ${capitalizeFirst(schemaName.replace('Schema', ''))} = z.infer<typeof ${schemaName}>;`;
      }
      const itemName = schemaName.replace('Schema', '').replace(/s$/, '') + 'Item';
      if (typeof parsed[0] === 'object' && parsed[0] !== null) {
        generateZodSchema(parsed[0] as Record<string, unknown>, itemName + 'Schema', schemas);
        const typeName = capitalizeFirst(schemaName.replace('Schema', ''));
        return `${imports}${Array.from(schemas.values()).join('\n\n')}\n\nexport const ${schemaName} = z.array(${itemName}Schema);\n\nexport type ${typeName} = z.infer<typeof ${schemaName}>;`;
      }
      const typeName = capitalizeFirst(schemaName.replace('Schema', ''));
      return `${imports}export const ${schemaName} = z.array(z.${typeof parsed[0]}());\n\nexport type ${typeName} = z.infer<typeof ${schemaName}>;`;
    }

    generateZodSchema(parsed as Record<string, unknown>, schemaName, schemas);
    const typeName = capitalizeFirst(schemaName.replace('Schema', ''));
    return imports + Array.from(schemas.values()).join('\n\n') + `\n\nexport type ${typeName} = z.infer<typeof ${schemaName}>;`;
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
