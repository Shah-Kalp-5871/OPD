const fs = require('fs');
const content = fs.readFileSync('c:/node-projects/opd-system/backend/prisma/schema.prisma', 'utf8');

// Parse models and their fields
const models = [];
let currentModel = null;

content.split('\n').forEach(line => {
  const modelMatch = line.match(/^model\s+(\w+)\s+\{/);
  if (modelMatch) {
    currentModel = { name: modelMatch[1], fields: [] };
    models.push(currentModel);
  } else if (line.trim() === '}' && currentModel) {
    currentModel = null;
  } else if (currentModel) {
    const fieldMatch = line.trim().match(/^(\w+)\s+([\w\?\[\]]+)/);
    if (fieldMatch) {
      currentModel.fields.push({
        name: fieldMatch[1],
        type: fieldMatch[2],
        line: line.trim()
      });
    }
  }
});

// Find models with branchId
console.log('Models with branchId and their relations:');
models.forEach(model => {
  const hasBranchId = model.fields.some(f => f.name === 'branchId');
  if (hasBranchId) {
    const branchRelation = model.fields.find(f => f.type === 'Branch' || f.name === 'branch');
    console.log(`- ${model.name}:`);
    console.log(`  - branchId field: ${model.fields.find(f => f.name === 'branchId').line}`);
    if (branchRelation) {
      console.log(`  - branch relation: ${branchRelation.line}`);
    } else {
      console.log('  - NO branch relation found!');
    }
  }
});
