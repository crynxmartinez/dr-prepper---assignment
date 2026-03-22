const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function checkImages() {
  const withImages = await prisma.product.count({
    where: { imageUrl: { not: null } }
  });
  
  const total = await prisma.product.count();
  
  console.log(`✅ Products with images: ${withImages}/${total}`);
  
  await prisma.$disconnect();
}

checkImages();
