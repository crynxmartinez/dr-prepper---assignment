const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
require('dotenv').config();

const prisma = new PrismaClient();
const PEXELS_API_KEY = 'UPJp8zwqFjKnUL2CUqxcn3U90JtMAhPWUB3ItNMHqu01Sf06gvl0qNVT';

// Map product names to better search terms
function getSearchTerm(productName) {
  const name = productName.toLowerCase();
  
  // Extract key product type
  if (name.includes('chips') || name.includes('potato')) return 'potato chips snack';
  if (name.includes('noodles') || name.includes('ramen')) return 'instant noodles';
  if (name.includes('cookie') || name.includes('biscuit')) return 'cookies biscuits';
  if (name.includes('candy') || name.includes('gummy')) return 'candy sweets';
  if (name.includes('chocolate')) return 'chocolate bar';
  if (name.includes('ice cream')) return 'ice cream';
  if (name.includes('beverage') || name.includes('drink') || name.includes('tea')) return 'beverage drink';
  if (name.includes('wafer')) return 'wafer cookies';
  if (name.includes('marshmallow')) return 'marshmallow candy';
  if (name.includes('jelly')) return 'jelly dessert';
  
  // Default: use first 2-3 words
  const words = productName.split(/[\s-]+/).slice(0, 3).join(' ');
  return words;
}

async function fetchPexelsImage(searchTerm, index = 0) {
  try {
    const response = await axios.get('https://api.pexels.com/v1/search', {
      headers: {
        'Authorization': PEXELS_API_KEY
      },
      params: {
        query: searchTerm,
        per_page: 5,
        orientation: 'square'
      }
    });

    if (response.data.photos && response.data.photos.length > 0) {
      // Use different photo for variety
      const photoIndex = index % response.data.photos.length;
      const photo = response.data.photos[photoIndex];
      return photo.src.medium; // 350x350 image
    }
    
    return null;
  } catch (error) {
    console.error(`   ❌ Error fetching image for "${searchTerm}":`, error.message);
    return null;
  }
}

async function updateProductImages() {
  console.log('🖼️  Starting Pexels image update...');
  console.log(`🔑 Using Pexels API Key: ${PEXELS_API_KEY.substring(0, 10)}...`);
  console.log('');

  // Get all products without images
  const products = await prisma.product.findMany({
    orderBy: { sortOrder: 'asc' }
  });

  console.log(`📦 Found ${products.length} products`);
  console.log('');

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    
    // Skip if already has image
    if (product.imageUrl && product.imageUrl.includes('http')) {
      console.log(`⏭️  [${i + 1}/${products.length}] Skipping "${product.name}" - already has image`);
      skipped++;
      continue;
    }

    const searchTerm = getSearchTerm(product.name);
    console.log(`🔍 [${i + 1}/${products.length}] Searching for "${product.name}" using term: "${searchTerm}"`);

    const imageUrl = await fetchPexelsImage(searchTerm, i);

    if (imageUrl) {
      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl }
      });
      console.log(`   ✅ Updated with image: ${imageUrl.substring(0, 60)}...`);
      updated++;
    } else {
      console.log(`   ⚠️  No image found`);
      failed++;
    }

    // Rate limiting - Pexels free tier: 200 requests/hour
    if ((i + 1) % 10 === 0) {
      console.log(`   ⏸️  Pausing for 3 seconds to respect rate limits...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    } else {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log('');
  console.log('📊 Summary:');
  console.log(`   ✅ Updated: ${updated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ⚠️  Failed: ${failed}`);
  console.log(`   📦 Total: ${products.length}`);
  console.log('');
  console.log('✅ Image update complete!');
}

async function main() {
  try {
    await updateProductImages();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
