const fs = require('fs');
const content = fs.readFileSync('c:/node-projects/opd-system/backend/prisma/schema.prisma', 'utf8');

const lines = content.split('\n');
let inside = false;
let linesToPrint = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.trim().toLowerCase().startsWith('model rpmreading ')) {
    inside = true;
    console.log(`Found rpmReading starting at line ${i + 1}`);
  }
  if (inside) {
    linesToPrint.push(`${i + 1}: ${line}`);
    if (line.trim() === '}') {
      inside = false;
      break;
    }
  }
}

console.log(linesToPrint.join('\n'));
