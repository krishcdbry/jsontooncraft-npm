/**
 * TOON format converter - Token-Optimized Object Notation
 * TOON is a YAML-like format optimized for LLM token usage
 */

/**
 * Convert JSON to TOON format
 */
export function jsonToToon(data: any): string {
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    return convertToToon(parsed, 0);
  } catch (error) {
    throw new Error(`Failed to convert JSON to TOON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function convertToToon(data: any, indent: number): string {
  const spaces = '  '.repeat(indent);

  if (data === null) {
    return 'null';
  }

  if (data === undefined) {
    return 'undefined';
  }

  if (typeof data === 'string') {
    // Check if string needs quotes
    if (data.includes(':') || data.includes('\n') || data.trim() !== data) {
      return `"${data.replace(/"/g, '\\"')}"`;
    }
    return data;
  }

  if (typeof data === 'number' || typeof data === 'boolean') {
    return String(data);
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return '[]';
    }

    // Check if array contains only primitives
    const allPrimitives = data.every(item =>
      typeof item !== 'object' || item === null
    );

    if (allPrimitives) {
      // Inline array format: key[count]: item1,item2,item3
      return data.map(item => convertToToon(item, 0)).join(',');
    }

    // Array of objects - each on new line with dash
    const items = data.map((item) => {
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        const lines = Object.entries(item).map(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
              const arrayStr = convertToToon(value, 0);
              return `${spaces}  ${key}[${value.length}]: ${arrayStr}`;
            } else {
              return `${spaces}  ${key}:\n${convertObjectToToon(value, indent + 2)}`;
            }
          }
          return `${spaces}  ${key}: ${convertToToon(value, 0)}`;
        }).join('\n');
        return `${spaces}- ${lines.split('\n').slice(1).join('\n')}`;
      }
      return `${spaces}- ${convertToToon(item, 0)}`;
    }).join('\n');

    return items;
  }

  if (typeof data === 'object') {
    return convertObjectToToon(data, indent);
  }

  return String(data);
}

function convertObjectToToon(obj: any, indent: number): string {
  const spaces = '  '.repeat(indent);

  return Object.entries(obj).map(([key, value]) => {
    if (value === null || value === undefined) {
      return `${spaces}${key}: ${value}`;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return `${spaces}${key}: []`;
      }

      // Check if array contains only primitives
      const allPrimitives = value.every(item =>
        typeof item !== 'object' || item === null
      );

      if (allPrimitives) {
        const arrayStr = value.map(item => convertToToon(item, 0)).join(',');
        return `${spaces}${key}[${value.length}]: ${arrayStr}`;
      }

      // Array of objects
      return `${spaces}${key}[${value.length}]:\n${convertToToon(value, indent + 1)}`;
    }

    if (typeof value === 'object') {
      return `${spaces}${key}:\n${convertObjectToToon(value, indent + 1)}`;
    }

    return `${spaces}${key}: ${convertToToon(value, 0)}`;
  }).join('\n');
}

/**
 * Convert TOON to JSON format
 */
export function toonToJson(toonString: string): any {
  try {
    const toon = typeof toonString === 'string' ? toonString : JSON.stringify(toonString);
    return parseToon(toon);
  } catch (error) {
    throw new Error(`Failed to convert TOON to JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function parseToon(toon: string): any {
  const lines = toon.split('\n').filter(line => line.trim().length > 0);

  function parseValue(value: string): any {
    value = value.trim();

    if (value === 'null') return null;
    if (value === 'undefined') return undefined;
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === '[]') return [];

    // Check for array format: item1,item2,item3
    if (value.includes(',') && !value.startsWith('"')) {
      return value.split(',').map(item => parseValue(item.trim()));
    }

    // Check for quoted string
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1).replace(/\\"/g, '"');
    }

    // Try parsing as number
    const num = Number(value);
    if (!isNaN(num) && value !== '') {
      return num;
    }

    return value;
  }

  function getIndentLevel(line: string): number {
    const match = line.match(/^(\s*)/);
    return match ? Math.floor(match[1].length / 2) : 0;
  }

  function parseObject(startIndex: number, minIndent: number): [any, number] {
    const obj: any = {};
    let index = startIndex;

    while (index < lines.length) {
      const line = lines[index];
      const indent = getIndentLevel(line);

      if (indent < minIndent) {
        break;
      }

      if (indent > minIndent) {
        index++;
        continue;
      }

      const trimmed = line.trim();

      // Check for array item
      if (trimmed.startsWith('-')) {
        index++;
        continue;
      }

      // Parse key-value pair
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex === -1) {
        index++;
        continue;
      }

      let key = trimmed.substring(0, colonIndex).trim();
      const valuePart = trimmed.substring(colonIndex + 1).trim();

      // Check for array notation: key[count]
      const arrayMatch = key.match(/^(.+)\[(\d+)\]$/);
      if (arrayMatch) {
        key = arrayMatch[1];

        if (valuePart) {
          // Inline array
          obj[key] = parseValue(valuePart);
        } else {
          // Multi-line array
          index++;
          const arr: any[] = [];
          while (index < lines.length && getIndentLevel(lines[index]) > indent) {
            const itemLine = lines[index].trim();
            if (itemLine.startsWith('-')) {
              const [item, newIndex] = parseArrayItem(index, indent + 1);
              arr.push(item);
              index = newIndex;
            } else {
              index++;
            }
          }
          obj[key] = arr;
          continue;
        }
      } else if (valuePart) {
        obj[key] = parseValue(valuePart);
      } else {
        // Nested object
        index++;
        const [nestedObj, newIndex] = parseObject(index, indent + 1);
        obj[key] = nestedObj;
        index = newIndex;
        continue;
      }

      index++;
    }

    return [obj, index];
  }

  function parseArrayItem(startIndex: number, minIndent: number): [any, number] {
    const line = lines[startIndex];
    const trimmed = line.trim();

    if (trimmed.startsWith('-')) {
      const itemContent = trimmed.substring(1).trim();

      if (itemContent.includes(':')) {
        // Object item
        const [obj, newIndex] = parseObject(startIndex + 1, minIndent);

        // Parse the first line's key-value
        const colonIndex = itemContent.indexOf(':');
        const key = itemContent.substring(0, colonIndex).trim();
        const value = itemContent.substring(colonIndex + 1).trim();

        if (value) {
          obj[key] = parseValue(value);
        }

        return [obj, newIndex];
      } else {
        // Primitive item
        return [parseValue(itemContent), startIndex + 1];
      }
    }

    return [null, startIndex + 1];
  }

  const [parsed] = parseObject(0, 0);
  return parsed;
}
