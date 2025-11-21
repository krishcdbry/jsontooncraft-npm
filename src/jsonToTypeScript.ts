/**
 * Convert JSON to TypeScript interfaces
 */

interface TypeInfo {
  type: string;
  isArray: boolean;
  isOptional: boolean;
  nestedType?: string;
}

function inferType(value: unknown, key: string): TypeInfo {
  if (value === null || value === undefined) {
    return { type: 'any', isArray: false, isOptional: true };
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { type: 'any[]', isArray: true, isOptional: false };
    }
    const firstItem = value[0];
    const itemType = inferType(firstItem, key);
    return {
      type: itemType.type,
      isArray: true,
      isOptional: false,
      nestedType: typeof firstItem === 'object' && firstItem !== null ? capitalizeFirst(key) : undefined
    };
  }

  if (typeof value === 'object') {
    return {
      type: capitalizeFirst(key),
      isArray: false,
      isOptional: false
    };
  }

  return {
    type: typeof value,
    isArray: false,
    isOptional: false
  };
}

function capitalizeFirst(str: string): string {
  // Remove array indicators and clean up
  const cleaned = str.replace(/\[\d*\]/g, '').replace(/[^a-zA-Z0-9]/g, '');
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1) || 'Item';
}

function generateInterface(obj: Record<string, unknown>, interfaceName: string, interfaces: Map<string, string>): void {
  if (interfaces.has(interfaceName)) {
    return;
  }

  const lines: string[] = [`export interface ${interfaceName} {`];

  for (const [key, value] of Object.entries(obj)) {
    const typeInfo = inferType(value, key);
    let typeStr = typeInfo.type;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const nestedName = capitalizeFirst(key);
      generateInterface(value as Record<string, unknown>, nestedName, interfaces);
      typeStr = nestedName;
    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      const nestedName = capitalizeFirst(key.replace(/s$/, ''));
      generateInterface(value[0] as Record<string, unknown>, nestedName, interfaces);
      typeStr = `${nestedName}[]`;
    } else if (typeInfo.isArray) {
      typeStr = `${typeInfo.type}[]`;
    }

    const optional = typeInfo.isOptional ? '?' : '';
    lines.push(`  ${key}${optional}: ${typeStr};`);
  }

  lines.push('}');
  interfaces.set(interfaceName, lines.join('\n'));
}

export function jsonToTypeScript(data: any, rootName: string = 'GeneratedInterface'): string {
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    const interfaces = new Map<string, string>();

    if (Array.isArray(parsed)) {
      if (parsed.length === 0) {
        return `export type ${rootName} = any[];`;
      }
      const itemName = rootName.replace(/s$/, '') + 'Item';
      if (typeof parsed[0] === 'object' && parsed[0] !== null) {
        generateInterface(parsed[0] as Record<string, unknown>, itemName, interfaces);
        return Array.from(interfaces.values()).join('\n\n') + `\n\nexport type ${rootName} = ${itemName}[];`;
      }
      return `export type ${rootName} = ${typeof parsed[0]}[];`;
    }

    generateInterface(parsed as Record<string, unknown>, rootName, interfaces);
    return Array.from(interfaces.values()).join('\n\n');
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
