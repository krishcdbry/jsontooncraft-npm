const { jsonToToon, toonToJson } = require('./dist/index.js');

console.log('='.repeat(80));
console.log('TOON Format Demo - Real YAML-like Format');
console.log('='.repeat(80));

// Example from your specification
const example = {
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": true,
    "roles": ["admin", "user"],
    "metadata": {
      "lastLogin": "2024-01-15T10:30:00Z",
      "loginCount": 42
    }
  },
  "posts": [
    {
      "id": 101,
      "title": "Getting Started with TOON",
      "content": "TOON is a compact data format...",
      "tags": ["tutorial", "beginner"],
      "published": true
    }
  ]
};

console.log('\n📦 Original JSON:');
console.log(JSON.stringify(example, null, 2));

console.log('\n✨ TOON Format:');
const toon = jsonToToon(example);
console.log(toon);

console.log('\n🔄 Round-trip: TOON back to JSON:');
const backToJson = toonToJson(toon);
console.log(JSON.stringify(backToJson, null, 2));

console.log('\n✅ Round-trip successful?', JSON.stringify(example) === JSON.stringify(backToJson));

console.log('\n' + '='.repeat(80));
console.log('✨ TOON Format Benefits');
console.log('='.repeat(80));
console.log('✓ YAML-like syntax for readability');
console.log('✓ Compact array notation: roles[2]: admin,user');
console.log('✓ Nested objects with clean indentation');
console.log('✓ Perfect for LLM context windows');
console.log('='.repeat(80));
