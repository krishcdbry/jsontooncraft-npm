/**
 * TOON format converter - simplified implementation
 */

interface ToonFormat {
  k: string[];
  v: any[];
}

/**
 * Convert JSON to TOON format
 */
export function jsonToToon(data: any): string {
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;

    if (typeof parsed !== 'object' || parsed === null) {
      return JSON.stringify(parsed);
    }

    if (Array.isArray(parsed)) {
      return JSON.stringify(parsed);
    }

    const keys = Object.keys(parsed);
    const values = keys.map(key => parsed[key]);

    const toon: ToonFormat = {
      k: keys,
      v: values
    };

    return JSON.stringify(toon, null, 2);
  } catch (error) {
    throw new Error(`Failed to convert JSON to TOON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convert TOON to JSON format
 */
export function toonToJson(data: any): any {
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;

    if (!parsed || typeof parsed !== 'object') {
      return parsed;
    }

    if (!parsed.k || !parsed.v) {
      throw new Error('Invalid TOON format: missing "k" or "v" properties');
    }

    if (!Array.isArray(parsed.k) || !Array.isArray(parsed.v)) {
      throw new Error('Invalid TOON format: "k" and "v" must be arrays');
    }

    if (parsed.k.length !== parsed.v.length) {
      throw new Error('Invalid TOON format: "k" and "v" arrays must have the same length');
    }

    const result: any = {};
    for (let i = 0; i < parsed.k.length; i++) {
      result[parsed.k[i]] = parsed.v[i];
    }

    return result;
  } catch (error) {
    throw new Error(`Failed to convert TOON to JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
