/**
 * JsonToonCraft - Convert between JSON, TOON, TypeScript, Zod, and OpenAPI schemas
 * @packageDocumentation
 */

export { jsonToTypeScript } from './jsonToTypeScript';
export { jsonToZod } from './jsonToZod';
export { jsonToOpenAPI } from './jsonToOpenAPI';
export { jsonToToon, toonToJson } from './toonConverter';
export { estimateTokens, compareTokens } from './tokenCounter';

/**
 * Convert data to all supported formats
 */
export function convertAll(data: any, interfaceName: string = 'GeneratedInterface') {
  const { jsonToTypeScript } = require('./jsonToTypeScript');
  const { jsonToZod } = require('./jsonToZod');
  const { jsonToOpenAPI } = require('./jsonToOpenAPI');
  const { jsonToToon } = require('./toonConverter');
  const { compareTokens } = require('./tokenCounter');

  try {
    const typescript = jsonToTypeScript(data, interfaceName);
    const zod = jsonToZod(data, interfaceName.endsWith('Schema') ? interfaceName : interfaceName + 'Schema');
    const openapi = jsonToOpenAPI(data, interfaceName);
    const toonStr = jsonToToon(data);
    const tokenStats = compareTokens(data, toonStr);

    return {
      typescript,
      zod,
      openapi,
      toon: toonStr,
      tokenStats
    };
  } catch (error) {
    throw new Error(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
