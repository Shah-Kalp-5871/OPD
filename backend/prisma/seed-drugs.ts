import { PrismaClient } from '@prisma/client';
import * as process from 'process';
const prisma = new PrismaClient();

const generateDrugs = () => {
  const categories = ['Antibiotic', 'Painkiller', 'Antacid', 'Vitamin', 'Antihistamine', 'Antidiabetic', 'Cardiovascular', 'Respiratory'];
  const formulations = ['TAB', 'CAP', 'SYR', 'INJ', 'OINT', 'DROP'];
  const genericNames = ['Paracetamol', 'Amoxicillin', 'Omeprazole', 'Ibuprofen', 'Cetirizine', 'Metformin', 'Amlodipine', 'Salbutamol', 'Azithromycin', 'Vitamin C', 'Aspirin'];
  
  const drugs: any[] = [];
  
  // Normal Drugs (70 items)
  for (let i = 1; i <= 70; i++) {
    const generic = genericNames[i % genericNames.length];
    const strength = (i % 5 + 1) * 100 + 'mg';
    drugs.push({
      drugName: `${generic} ${strength} Brand-${i}`,
      genericName: generic,
      formulation: formulations[i % formulations.length],
      drugCategory: categories[i % categories.length],
      unitOfMeasure: 'Tablet',
      unitPrice: Math.floor(Math.random() * 50) + 1,
      stockTracked: true,
      isActive: true,
    });
  }

  return drugs;
};

const generateConsumables = () => {
  const names = ['Cotton Roll', 'Bandage', 'Syringe 5ml', 'Syringe 10ml', 'Surgical Spirit', 'Betadine', 'Gauze Pad', 'Surgical Tape', 'Gloves Box', 'Face Mask', 'Thermometer', 'Tongue Depressor'];
  const simple: any[] = [];

  // Consumables (30 items)
  for (let i = 1; i <= 30; i++) {
    const baseName = names[i % names.length];
    simple.push({
      drugName: `${baseName} - Variant ${i}`,
      genericName: baseName,
      drugCategory: 'Consumable',
      formulation: 'OTHER',
      unitOfMeasure: 'Piece',
      unitPrice: Math.floor(Math.random() * 200) + 10,
      stockTracked: true,
      isActive: true,
    });
  }
  return simple;
};

async function main() {
  console.log('Starting Drugs Seeder...');
  
  const normalDrugs = generateDrugs();
  const consumables = generateConsumables();
  const allDrugs = [...normalDrugs, ...consumables];
  
  console.log(`Seeding ${allDrugs.length} Total Drugs (70 Normal + 30 Consumables)...`);
  await prisma.drug.createMany({
    data: allDrugs,
    skipDuplicates: true,
  });

  console.log('Drugs Seeded Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
