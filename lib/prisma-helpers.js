const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Auth helpers
async function findUserByEmail(email) {
  return await prisma.customer.findUnique({
    where: { email }
  });
}

async function findCustomerById(id) {
  return await prisma.customer.findUnique({
    where: { id }
  });
}

async function updateCustomerLastLogin(id) {
  return await prisma.customer.update({
    where: { id },
    data: { lastLogin: new Date() }
  });
}

// Product helpers
async function getProducts(filters = {}) {
  const { page = 1, limit = 50, search, superCategory, visibility, stock, isAdmin } = filters;
  
  const where = {};
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  if (superCategory) {
    where.superCategoryId = parseInt(superCategory);
  }
  
  if (!isAdmin) {
    where.isHidden = false;
    where.category = { isHidden: false };
  } else if (visibility === 'hidden') {
    where.isHidden = true;
  } else if (visibility === 'visible') {
    where.isHidden = false;
  }
  
  if (stock === 'in-stock') {
    where.isOos = false;
  } else if (stock === 'oos') {
    where.isOos = true;
  }
  
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        superCategory: true
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    }),
    prisma.product.count({ where })
  ]);
  
  return { products, total };
}

async function createProduct(data) {
  return await prisma.product.create({
    data,
    include: {
      category: true,
      superCategory: true
    }
  });
}

async function updateProduct(id, data) {
  return await prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
      superCategory: true
    }
  });
}

async function deleteProduct(id) {
  return await prisma.product.delete({
    where: { id }
  });
}

// Order helpers
async function createOrder(customerId, items) {
  const orderId = require('uuid').v4();
  
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        id: orderId,
        customerId,
        status: 'Pending',
        totalCases: 0
      }
    });
    
    let totalCases = 0;
    
    for (const item of items) {
      await tx.orderItem.create({
        data: {
          orderId,
          productId: item.product_id,
          qty: item.qty,
          unit: item.unit
        }
      });
      
      if (item.unit === 'cases') {
        totalCases += item.qty;
      } else {
        const product = await tx.product.findUnique({
          where: { id: item.product_id }
        });
        totalCases += item.qty * product.casesPerPallet;
      }
    }
    
    await tx.order.update({
      where: { id: orderId },
      data: { totalCases }
    });
    
    return order;
  });
}

async function getOrders(customerId, isAdmin = false) {
  const where = isAdmin ? {} : { customerId };
  
  return await prisma.order.findMany({
    where,
    include: {
      customer: {
        select: {
          id: true,
          companyName: true,
          contactName: true,
          email: true
        }
      },
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

async function getOrderById(orderId, customerId, isAdmin = false) {
  const where = { id: orderId };
  if (!isAdmin) {
    where.customerId = customerId;
  }
  
  return await prisma.order.findFirst({
    where,
    include: {
      customer: true,
      items: {
        include: {
          product: true
        }
      }
    }
  });
}

async function updateOrderStatus(orderId, status) {
  return await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });
}

// Favorites helpers
async function addFavorite(customerId, productId) {
  return await prisma.favorite.create({
    data: {
      customerId,
      productId
    }
  });
}

async function removeFavorite(customerId, productId) {
  return await prisma.favorite.deleteMany({
    where: {
      customerId,
      productId
    }
  });
}

async function getFavorites(customerId) {
  return await prisma.favorite.findMany({
    where: { customerId },
    include: {
      product: {
        include: {
          category: true,
          superCategory: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

// Activity log
async function logActivity(customerId, type, detail) {
  return await prisma.activityLog.create({
    data: {
      customerId,
      type,
      detail
    }
  });
}

// Category helpers
async function getCategoryHierarchy(customerId = null, isAdmin = false) {
  const superCategories = await prisma.superCategory.findMany({
    include: {
      categories: {
        where: isAdmin ? {} : { isHidden: false },
        include: {
          _count: {
            select: {
              products: {
                where: isAdmin ? {} : { isHidden: false }
              }
            }
          }
        }
      }
    },
    orderBy: { sortOrder: 'asc' }
  });
  
  return superCategories.map(sc => ({
    id: sc.id,
    name: sc.name,
    totalProducts: sc.categories.reduce((sum, cat) => sum + cat._count.products, 0),
    categories: sc.categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      productCount: cat._count.products
    }))
  }));
}

// Customer helpers
async function getAllCustomers() {
  return await prisma.customer.findMany({
    select: {
      id: true,
      companyName: true,
      contactName: true,
      email: true,
      phone: true,
      active: true,
      createdAt: true,
      lastLogin: true
    },
    orderBy: { companyName: 'asc' }
  });
}

async function createCustomer(data) {
  return await prisma.customer.create({
    data
  });
}

async function updateCustomer(id, data) {
  return await prisma.customer.update({
    where: { id },
    data
  });
}

module.exports = {
  prisma,
  findUserByEmail,
  findCustomerById,
  updateCustomerLastLogin,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  addFavorite,
  removeFavorite,
  getFavorites,
  logActivity,
  getCategoryHierarchy,
  getAllCustomers,
  createCustomer,
  updateCustomer
};
