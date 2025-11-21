/**
 * Demo script showcasing all features of jsontooncraft
 */

const {
  convertAll,
  jsonToTypeScript,
  jsonToZod,
  jsonToOpenAPI,
  jsonToToon,
  toonToJson,
  compareTokens
} = require('./dist/index.js');

console.log('='.repeat(80));
console.log('JsonToonCraft Demo');
console.log('='.repeat(80));

// Sample data
const userData = {
  id: 123,
  name: 'Alice Developer',
  email: 'alice@example.com',
  isActive: true,
  roles: ['admin', 'developer'],
  profile: {
    age: 28,
    location: 'San Francisco',
    skills: ['TypeScript', 'React', 'Node.js']
  }
};

console.log('\n📦 Original Data:');
console.log(JSON.stringify(userData, null, 2));

// Demo 1: Convert All
console.log('\n' + '='.repeat(80));
console.log('🔄 Convert All Formats');
console.log('='.repeat(80));

const allFormats = convertAll(userData, 'User');

console.log('\n✅ TypeScript Interface:');
console.log(allFormats.typescript);

console.log('\n✅ Zod Schema:');
console.log(allFormats.zod);

console.log('\n✅ OpenAPI Schema:');
console.log(allFormats.openapi);

console.log('\n✅ TOON Format:');
console.log(allFormats.toon);

console.log('\n📊 Token Statistics:');
console.log(`  JSON tokens: ${allFormats.tokenStats.json}`);
console.log(`  TOON tokens: ${allFormats.tokenStats.toon}`);
console.log(`  Savings: ${allFormats.tokenStats.savings.toFixed(2)}%`);

// Demo 2: Individual conversions
console.log('\n' + '='.repeat(80));
console.log('🔧 Individual Conversions');
console.log('='.repeat(80));

console.log('\n1️⃣  TypeScript Only:');
const tsInterface = jsonToTypeScript(userData, 'UserData');
console.log(tsInterface);

console.log('\n2️⃣  Zod Only:');
const zodSchema = jsonToZod(userData, 'UserDataSchema');
console.log(zodSchema);

console.log('\n3️⃣  OpenAPI Only:');
const openApiSchema = jsonToOpenAPI(userData, 'UserData');
console.log(openApiSchema);

// Demo 3: TOON conversion
console.log('\n' + '='.repeat(80));
console.log('🎯 TOON Format Demo');
console.log('='.repeat(80));

const toonFormat = jsonToToon(userData);
console.log('\nOriginal → TOON:');
console.log(toonFormat);

const backToJson = toonToJson(toonFormat);
console.log('\nTOON → JSON:');
console.log(JSON.stringify(backToJson, null, 2));

console.log('\nRound-trip successful?', JSON.stringify(userData) === JSON.stringify(backToJson));

// Demo 4: Token comparison
console.log('\n' + '='.repeat(80));
console.log('💾 Token Usage Comparison');
console.log('='.repeat(80));

const tokenComparison = compareTokens(userData, JSON.parse(toonFormat));
console.log(`\nJSON format tokens: ${tokenComparison.json}`);
console.log(`TOON format tokens: ${tokenComparison.toon}`);
console.log(`Token savings: ${tokenComparison.savings.toFixed(2)}%`);

// Demo 5: Large dataset example
console.log('\n' + '='.repeat(80));
console.log('📈 Large Dataset Example');
console.log('='.repeat(80));

const largeDataset = {
  users: Array.from({ length: 5 }, (_, i) => ({
    userId: i + 1,
    userName: `user${i + 1}`,
    userEmail: `user${i + 1}@example.com`,
    userStatus: 'active',
    userRole: 'member'
  }))
};

console.log('\nLarge dataset (5 users with repetitive keys):');
const largeToon = jsonToToon(largeDataset);
const largeComparison = compareTokens(largeDataset, JSON.parse(largeToon));

console.log(`JSON tokens: ${largeComparison.json}`);
console.log(`TOON tokens: ${largeComparison.toon}`);
console.log(`Savings: ${largeComparison.savings.toFixed(2)}%`);

console.log('\n' + '='.repeat(80));
console.log('✨ Demo Complete!');
console.log('='.repeat(80));
