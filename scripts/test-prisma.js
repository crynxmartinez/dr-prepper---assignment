const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set ✓' : 'NOT SET ✗');

const prisma = new PrismaClient();

async function test() {
  try {
    const count = await prisma.product.count();
    console.log('✅ Prisma connection successful!');
    console.log(`📦 Products in database: ${count}`);
    
    const customers = await prisma.customer.count();
    console.log(`👥 Customers in database: ${customers}`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Prisma connection failed:', error.message);
    process.exit(1);
  }
}

test();
