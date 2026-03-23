const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const prisma = new PrismaClient();

async function createAdmin() {
  console.log('🔧 Creating admin user...');
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@drprepper.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  // Check if admin already exists
  const existing = await prisma.user.findUnique({
    where: { email: adminEmail }
  });
  
  if (existing) {
    console.log('✅ Admin user already exists:', adminEmail);
    return;
  }
  
  // Create admin user
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  
  await prisma.user.create({
    data: {
      id: uuidv4(),
      email: adminEmail,
      passwordHash,
      role: 'admin',
      active: true
    }
  });
  
  console.log('✅ Admin user created successfully!');
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   Role: admin`);
}

createAdmin()
  .catch((e) => {
    console.error('❌ Failed to create admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
