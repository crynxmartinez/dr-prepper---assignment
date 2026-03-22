const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const prisma = new PrismaClient();

// Super categories with emoji
const superCategories = [
  { id: 1, name: 'Chips & Savory Snacks', emoji: '🥔', sortOrder: 1 },
  { id: 2, name: 'Noodles & Rice', emoji: '🍜', sortOrder: 2 },
  { id: 3, name: 'Cookies & Wafers', emoji: '🍪', sortOrder: 3 },
  { id: 4, name: 'Candy & Jelly', emoji: '🍬', sortOrder: 4 },
  { id: 5, name: 'Ice Cream', emoji: '🍦', sortOrder: 5 },
  { id: 6, name: 'Beverages', emoji: '🥤', sortOrder: 6 },
  { id: 7, name: 'Korean Snacks', emoji: '🇰🇷', sortOrder: 7 }
];

// Categories (sub-categories)
const categories = [
  // Chips & Savory Snacks (1)
  { id: 1, name: "Lay's Potato Chips", superCategoryId: 1, sortOrder: 1 },
  { id: 2, name: "Lay's Wave Chips", superCategoryId: 1, sortOrder: 2 },
  { id: 3, name: "Lay's Yam Chips", superCategoryId: 1, sortOrder: 3 },
  { id: 4, name: "Cheetos & Corn Sticks", superCategoryId: 1, sortOrder: 4 },
  { id: 5, name: "Weilong Crispy Fire Snacks", superCategoryId: 1, sortOrder: 5 },
  { id: 6, name: "LYFEN Rice Chips", superCategoryId: 1, sortOrder: 6 },
  
  // Noodles & Rice (2)
  { id: 7, name: "XWX Snack Noodles", superCategoryId: 2, sortOrder: 1 },
  { id: 8, name: "Buldak Chips & Snacks", superCategoryId: 2, sortOrder: 2 },
  { id: 9, name: "Buldak Big Bowls", superCategoryId: 2, sortOrder: 3 },
  { id: 10, name: "Buldak Cups", superCategoryId: 2, sortOrder: 4 },
  { id: 11, name: "Buldak Spicy Dumplings & Rice", superCategoryId: 2, sortOrder: 5 },
  { id: 12, name: "Buldak Multi-Packs", superCategoryId: 2, sortOrder: 6 },
  
  // Cookies & Wafers (3)
  { id: 13, name: "ZX Crackers & Biscuits", superCategoryId: 3, sortOrder: 1 },
  { id: 14, name: "Nestle Cuicuisha Wafers", superCategoryId: 3, sortOrder: 2 },
  { id: 15, name: "KitKat Chocolate", superCategoryId: 3, sortOrder: 3 },
  { id: 16, name: "MILO Cookies", superCategoryId: 3, sortOrder: 4 },
  { id: 17, name: "Japanese & Korean Cookies", superCategoryId: 3, sortOrder: 5 },
  
  // Candy & Jelly (4)
  { id: 18, name: "XFJ Marshmallows & Candy", superCategoryId: 4, sortOrder: 1 },
  { id: 19, name: "HSU FU CHI Snacks", superCategoryId: 4, sortOrder: 2 },
  { id: 20, name: "XFJ Gummy & Fruit Snacks", superCategoryId: 4, sortOrder: 3 },
  { id: 21, name: "EC Herbal Jelly", superCategoryId: 4, sortOrder: 4 },
  
  // Ice Cream (5)
  { id: 22, name: "Ice Cream", superCategoryId: 5, sortOrder: 1 },
  
  // Beverages (6)
  { id: 23, name: "KSF Beverages", superCategoryId: 6, sortOrder: 1 },
  { id: 24, name: "BBY Beverages", superCategoryId: 6, sortOrder: 2 },
  { id: 25, name: "WY & YS Beverages", superCategoryId: 6, sortOrder: 3 },
  { id: 26, name: "GF Tea & Sparkling", superCategoryId: 6, sortOrder: 4 },
  { id: 27, name: "MD Vitamin Drinks", superCategoryId: 6, sortOrder: 5 },
  { id: 28, name: "ChaPai & TY Tea", superCategoryId: 6, sortOrder: 6 },
  { id: 29, name: "HCT Yogurt", superCategoryId: 6, sortOrder: 7 },
  { id: 30, name: "Sangaria Beverages", superCategoryId: 6, sortOrder: 8 },
  { id: 31, name: "Kimura Sparkling Water", superCategoryId: 6, sortOrder: 9 },
  { id: 32, name: "Hata Ramune Soda", superCategoryId: 6, sortOrder: 10 },
  
  // Korean Snacks (7)
  { id: 33, name: "Orion Snacks", superCategoryId: 7, sortOrder: 1 },
  { id: 34, name: "NS Korean Snacks", superCategoryId: 7, sortOrder: 2 }
];

// Demo customers
const demoCustomers = [
  {
    id: 'c1',
    companyName: 'Happy Snacks Co.',
    contactName: 'John Buyer',
    email: 'buyer@happysnacks.com',
    password: 'demo1234',
    phone: '(555) 123-4567',
    addressLine1: '123 Main St',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90001',
    country: 'USA',
    viewPreset: 'full',
    active: true
  },
  {
    id: 'c2',
    companyName: 'Pacific Rim Imports',
    contactName: 'Sarah Chen',
    email: 'sarah@pacificrimports.com',
    password: 'demo1234',
    phone: '(555) 234-5678',
    addressLine1: '456 Ocean Ave',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'USA',
    viewPreset: 'chips',
    active: true
  },
  {
    id: 'c3',
    companyName: 'Seoul Gardens Market',
    contactName: 'Min Park',
    email: 'min@seoulgardens.com',
    password: 'demo1234',
    phone: '(555) 345-6789',
    addressLine1: '789 Korea Town Blvd',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90020',
    country: 'USA',
    viewPreset: 'korean',
    active: true
  }
];

async function main() {
  console.log('🌱 Starting Prisma seed...');
  
  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.activityLog.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.customerOverride.deleteMany();
  await prisma.customerCatHidden.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.superCategory.deleteMany();
  
  // Seed super categories
  console.log('📦 Seeding super categories...');
  for (const sc of superCategories) {
    await prisma.superCategory.create({
      data: {
        id: sc.id,
        name: sc.name,
        sortOrder: sc.sortOrder
      }
    });
  }
  
  // Seed categories
  console.log('📂 Seeding categories...');
  for (const cat of categories) {
    await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        superCategoryId: cat.superCategoryId,
        sortOrder: cat.sortOrder
      }
    });
  }
  
  // Seed customers
  console.log('👥 Seeding demo customers...');
  for (const customer of demoCustomers) {
    const passwordHash = await bcrypt.hash(customer.password, 10);
    await prisma.customer.create({
      data: {
        id: customer.id,
        companyName: customer.companyName,
        contactName: customer.contactName,
        email: customer.email,
        passwordHash,
        phone: customer.phone,
        addressLine1: customer.addressLine1,
        city: customer.city,
        state: customer.state,
        zip: customer.zip,
        country: customer.country,
        viewPreset: customer.viewPreset,
        active: customer.active
      }
    });
  }
  
  // Load and seed products from existing data
  console.log('🛍️  Seeding products...');
  try {
    const productsData = require('../scripts/products.json');
    let productCount = 0;
    
    for (const product of productsData) {
      const bagsPerCase = product.bags_per_case || product.bagsPerCase;
      await prisma.product.create({
        data: {
          id: product.id || product.sku || `PROD-${productCount}`,
          name: product.name,
          weight: product.weight ? String(product.weight) : null,
          bagsPerCase: bagsPerCase ? String(bagsPerCase) : null,
          casesPerPallet: parseInt(product.cases_per_pallet || product.casesPerPallet || 60),
          price: parseFloat(product.price || 25.00),
          categoryId: parseInt(product.category_id || product.categoryId || 1),
          superCategoryId: parseInt(product.super_category_id || product.superCategoryId || 1),
          imageUrl: product.image_url || product.imageUrl || null,
          sku: product.sku || product.id,
          sortOrder: parseInt(product.sort_order || product.sortOrder || productCount),
          isHidden: Boolean(product.is_hidden || product.isHidden || false),
          isOos: Boolean(product.is_oos || product.isOos || false),
          showPrice: product.show_price !== undefined ? Boolean(product.show_price) : true
        }
      });
      productCount++;
    }
    
    console.log(`✅ Seeded ${productCount} products`);
  } catch (error) {
    console.warn('⚠️  Could not load products.json, skipping product seeding');
    console.warn('   Error:', error.message);
  }
  
  console.log('✅ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Super Categories: ${superCategories.length}`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Customers: ${demoCustomers.length}`);
  console.log('\n🔑 Demo Login Credentials:');
  console.log('   - buyer@happysnacks.com / demo1234');
  console.log('   - sarah@pacificrimports.com / demo1234');
  console.log('   - min@seoulgardens.com / demo1234');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
