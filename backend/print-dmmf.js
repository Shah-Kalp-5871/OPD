const { Prisma } = require('@prisma/client');

const models = Prisma.dmmf?.datamodel?.models || [];
const model = models.find(m => m.name === 'ConsultationRecord');

if (model) {
  console.log('Fields for ConsultationRecord in DMMF:');
  model.fields.forEach(field => {
    console.log(`- name: ${field.name}`);
    console.log(`  kind: ${field.kind}`);
    console.log(`  type: ${field.type}`);
    if (field.relationName) {
      console.log(`  relationName: ${field.relationName}`);
    }
  });
} else {
  console.log('ConsultationRecord model not found in DMMF');
}
