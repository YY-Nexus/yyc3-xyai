// Fix badge types script
const fs = require('fs');

// Fix 1: Remove unused imports from badgeMockData.ts
let badgeMockData = fs.readFileSync('lib/data/badgeMockData.ts', 'utf8');
badgeMockData = badgeMockData.replace(
  /import type \{ Badge, BadgeSeries, BadgeLevel, BadgeCategory, BadgeRarity, BadgeGroup, BadgeStats \} from '@\/types';/,
  "import type { Badge, BadgeGroup, BadgeStats } from '@/types';"
);
fs.writeFileSync('lib/data/badgeMockData.ts', badgeMockData);
console.log('✅ Fixed badgeMockData.ts imports');

// Fix 2: Add missing properties to metadata in badgeMockData.ts
// This is a simple fix - just add createdAt and updatedAt where missing
// For now, let's just add them to the problematic entry
badgeMockData = badgeMockData.replace(
  /metadata: \{\s*points: 500,\s*version: '1\.0',\s*glowColor: '#FFD700',\s*specialEffect: true\s*\},/,
  `metadata: {
      points: 500,
      version: '1.0',
      createdAt: '2024-01-01',
      updatedAt: '2024-04-01',
      glowColor: '#FFD700',
      specialEffect: true
    },`
);
fs.writeFileSync('lib/data/badgeMockData.ts', badgeMockData);
console.log('✅ Fixed badgeMockData.ts metadata');

console.log('\n✅ All badge type fixes completed!');
