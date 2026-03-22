const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const prisma = new PrismaClient();

async function createAccount() {
  try {
    // Account details
    const accountData = {
      id: uuidv4(),
      companyName: 'DJ Trading Co.',
      contactName: 'DJ',
      email: 'dj@djtrading.com',
      password: 'dj123456',
      phone: '(555) 999-0000',
      addressLine1: '123 Business Ave',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'USA',
      viewPreset: 'full',
      active: true
    };

    // Check if email already exists
    const existing = await prisma.customer.findUnique({
      where: { email: accountData.email }
    });

    if (existing) {
      console.log('❌ Account already exists with this email');
      console.log('📧 Email:', accountData.email);
      console.log('🔑 Use password: dj123456');
      await prisma.$disconnect();
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(accountData.password, 10);

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        id: accountData.id,
        companyName: accountData.companyName,
        contactName: accountData.contactName,
        email: accountData.email,
        passwordHash,
        phone: accountData.phone,
        addressLine1: accountData.addressLine1,
        city: accountData.city,
        state: accountData.state,
        zip: accountData.zip,
        country: accountData.country,
        viewPreset: accountData.viewPreset,
        active: accountData.active
      }
    });

    console.log('✅ Account created successfully!');
    console.log('');
    console.log('📋 Account Details:');
    console.log('   Company:', customer.companyName);
    console.log('   Contact:', customer.contactName);
    console.log('   Email:', customer.email);
    console.log('   Password: dj123456');
    console.log('');
    console.log('🔗 Login at: http://localhost:5001');
    console.log('');

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error creating account:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

createAccount();
