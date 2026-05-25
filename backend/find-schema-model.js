const fs = require('fs');
const content = fs.readFileSync('c:/node-projects/opd-system/backend/prisma/schema.prisma', 'utf8');
const lines = content.split('\n');

let startIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('model ConsultationRecord')) {
    startIndex = i;
    break;
  }
}

if (startIndex !== -1) {
  console.log(`Found model ConsultationRecord at line ${startIndex + 1}:`);
  for (let j = Math.max(0, startIndex - 2); j < Math.min(lines.length, startIndex + 30); j++) {
    console.log(`${j + 1}: ${lines[j]}`);
  }
} else {
  console.log('model ConsultationRecord not found');
}
