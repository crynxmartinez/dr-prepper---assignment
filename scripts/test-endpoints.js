const axios = require('axios');

const BASE_URL = 'http://localhost:5001';
const TEST_EMAIL = 'dj@djtrading.com';
const TEST_PASSWORD = 'dj123456';

let authToken = null;

async function testLogin() {
  console.log('\n🔐 Testing Login...');
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    if (response.data.success && response.data.token) {
      authToken = response.data.token;
      console.log('✅ Login successful');
      console.log('   User:', response.data.vendor.companyName);
      console.log('   Role:', response.data.role);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return false;
  }
}

async function testProducts() {
  console.log('\n📦 Testing Products API...');
  try {
    const response = await axios.get(`${BASE_URL}/api/products?limit=10`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success && response.data.products) {
      console.log(`✅ Products API working - ${response.data.products.length} products returned`);
      console.log(`   Total products: ${response.data.pagination.total}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Products API failed:', error.response?.data || error.message);
    return false;
  }
}

async function testCategories() {
  console.log('\n📂 Testing Categories API...');
  try {
    const response = await axios.get(`${BASE_URL}/api/categories/hierarchy`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success && response.data.hierarchy) {
      console.log(`✅ Categories API working - ${response.data.hierarchy.length} super-categories`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Categories API failed:', error.response?.data || error.message);
    return false;
  }
}

async function testCart() {
  console.log('\n🛒 Testing Cart API...');
  try {
    const response = await axios.get(`${BASE_URL}/api/cart`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success) {
      console.log(`✅ Cart API working - ${response.data.total_items} items`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Cart API failed:', error.response?.data || error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Starting API Endpoint Tests...');
  console.log('================================');
  
  const results = {
    login: await testLogin(),
    products: authToken ? await testProducts() : false,
    categories: authToken ? await testCategories() : false,
    cart: authToken ? await testCart() : false
  };
  
  console.log('\n================================');
  console.log('📊 Test Results:');
  console.log(`   Login: ${results.login ? '✅' : '❌'}`);
  console.log(`   Products: ${results.products ? '✅' : '❌'}`);
  console.log(`   Categories: ${results.categories ? '✅' : '❌'}`);
  console.log(`   Cart: ${results.cart ? '✅' : '❌'}`);
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  console.log(`\n${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('✅ All tests passed!');
  } else {
    console.log('⚠️  Some tests failed');
  }
}

runTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
