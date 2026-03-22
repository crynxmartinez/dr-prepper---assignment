# DR Prepper Wholesale Portal

**Modern B2B wholesale ordering platform** with real-time product catalog, shopping cart, favorites, order management, and comprehensive admin dashboard.

## 🚀 Tech Stack

**Frontend:**
- Vue 3 (Composition API)
- Vite 5 (Build tool & dev server)
- Native CSS (no framework)
- Single Page Application (SPA)

**Backend:**
- Node.js + Express 4
- PostgreSQL database
- Prisma ORM 5.22
- JWT authentication
- bcrypt password hashing

**Features:**
- 📦 205+ products across multiple categories
- 🛒 Real-time shopping cart
- ⭐ Customer favorites
- 📊 Order tracking & management
- 👥 Customer portal with personalized visibility
- 🔧 Admin dashboard for full control
- 🔐 Secure authentication & authorization
- 📧 Email notifications (password reset)

## 📁 Project Structure

```
dpu-wholesale-prepper/
├── server.js                      # Express API server (3,200+ lines, 30+ endpoints)
├── prisma/
│   ├── schema.prisma             # Database schema (source of truth)
│   ├── migrations/               # Prisma migrations
│   └── seed.js                   # Database seeding script
├── src/
│   ├── App.vue                   # Main Vue 3 SPA (3,200+ lines)
│   ├── main.js                   # Vue app entry point
│   └── components/
│       ├── AdminPortal.vue       # Admin dashboard (5,800+ lines)
│       ├── Login.vue             # Authentication UI
│       ├── ProductCard.vue       # Product display component
│       ├── CartOverlay.vue       # Shopping cart UI
│       ├── CategoryList.vue      # Category navigation
│       ├── OrderConfirmModal.vue # Order confirmation
│       └── ... (12 components total)
├── public/                        # Static assets & built files
├── lib/
│   └── validation.js             # Input validation utilities
├── migrations/pre-prisma/         # Archived raw SQL migrations
├── sql/archive/                   # Historical schema & data fixes
├── docs/                          # Documentation
├── package.json                   # Dependencies & scripts
├── vite.config.js                 # Vite configuration
└── .env                           # Environment variables (not in git)
```

## ⚡ Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### 1. Clone & Install

```bash
git clone <repository-url>
cd dpu-wholesale-prepper
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/drprepper_wholesale"

# JWT Secret (change in production!)
JWT_SECRET="your-super-secret-jwt-key-change-this"

# Email (for password reset)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
SMTP_FROM="noreply@drprepperusa.com"

# Frontend URL
FRONTEND_URL="http://localhost:5173"

# Server
PORT=5000
```

### 3. Database Setup

**⚠️ Important:** Cloning this repo only gives you the **Prisma schema** (`prisma/schema.prisma`), not the actual database or data. You must create your own PostgreSQL database.

**Step 1: Create a new PostgreSQL database**
```bash
# Using createdb command
createdb drprepper_wholesale

# Or using psql
psql -U postgres
CREATE DATABASE drprepper_wholesale;
\q
```

**Step 2: Run Prisma migrations to create tables**
```bash
npx prisma migrate deploy
```

This reads the Prisma schema and creates all tables in your empty database:
- `products` - Product catalog
- `customers` - Customer accounts  
- `users` - Admin users
- `orders` & `order_items` - Order management
- `favorites` - Customer favorites
- `activity_log` - Audit trail
- `customer_overrides` - Per-customer visibility
- `customer_cat_hidden` - Category visibility
- `carts` - Shopping cart persistence
- `pending_registrations` - Registration approvals
- `settings` - System settings

**Step 3: Generate Prisma Client**
```bash
npx prisma generate
```

This generates the Prisma Client based on your schema (required for the app to run).

### 4. Seed Database (Required for First Run)

**⚠️ Your database is now empty!** You need to seed it with initial data:

```bash
npm run seed
```

This populates your database with:
- **Demo admin user** (`admin@drprepperusa.com`)
- **Sample customers** (3 demo accounts)
- **Product categories** (Super categories + categories)
- **205+ products** with images and pricing

**Without seeding, you'll have an empty catalog and won't be able to log in.**

### 5. Start Development

**Backend server:**
```bash
npm start
# or with auto-reload:
npm run dev
```
API runs on `http://localhost:5000`

**Frontend dev server:**
```bash
npm run dev
```
Vite dev server runs on `http://localhost:5173`

**Open in browser:**
```
http://localhost:5173
```

### 6. Default Login Credentials

**Admin User:**
- Email: `admin@drprepperusa.com`
- Password: (set during seed)

**Demo Customers** (if seeded):
- `buyer@happysnacks.com` / `demo1234`
- `sarah@pacificrimports.com` / `demo1234`
- `min@seoulgardens.com` / `demo1234`

## 🎨 Frontend Architecture

**Vue 3 SPA** with component-based architecture:

### Main Application (`App.vue`)
- **Customer Portal:**
  - Product catalog with search & filters
  - Shopping cart with real-time updates
  - Favorites management
  - Order history & tracking
  - Profile management
  
- **Admin Portal:**
  - Product CRUD operations
  - Customer management
  - Per-customer visibility controls
  - Order management & status updates
  - Activity log & analytics
  - System settings

- **Authentication:**
  - Login/logout flows
  - Registration with approval workflow
  - Password reset via email

### Components

| Component | Purpose | Lines |
|-----------|---------|-------|
| `AdminPortal.vue` | Full admin dashboard | 5,800+ |
| `Login.vue` | Authentication UI | 500+ |
| `ProductCard.vue` | Product display | 250+ |
| `CartOverlay.vue` | Shopping cart | 300+ |
| `CategoryList.vue` | Category navigation | 150+ |
| `OrderConfirmModal.vue` | Order confirmation | 150+ |
| `BulkEditView.vue` | Bulk product editing | 1,000+ |
| `AdminDashboard.vue` | Dashboard widgets | 400+ |

### Build Commands

```bash
npm run dev      # Vite dev server (hot reload)
npm run build    # Production build
npm run preview  # Preview production build
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/login` | Customer/admin login | Public |
| `POST` | `/api/auth/register` | Register new customer | Public |
| `POST` | `/api/auth/admin/login` | Admin login | Public |
| `POST` | `/api/auth/forgot-password` | Request password reset | Public |
| `POST` | `/api/auth/reset-password` | Reset password with token | Public |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/products` | Get all products (filtered by visibility) | Customer |
| `GET` | `/api/products/search` | Search products | Customer |
| `POST` | `/api/products` | Create product | Admin |
| `PUT` | `/api/products/:id` | Update product | Admin |
| `DELETE` | `/api/products/:id` | Delete product | Admin |
| `PUT` | `/api/products/reorder` | Bulk reorder products | Admin |
| `POST` | `/api/products/:id/upload-image` | Upload product image | Admin |

### Categories
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/categories` | Get all categories | Customer |
| `GET` | `/api/super-categories` | Get super categories | Customer |
| `POST` | `/api/categories` | Create category | Admin |
| `PUT` | `/api/categories/:id` | Update category | Admin |
| `DELETE` | `/api/categories/:id` | Delete category | Admin |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/orders` | Place new order | Customer |
| `GET` | `/api/orders` | Get customer's orders | Customer |
| `GET` | `/api/orders/:id` | Get order details | Customer |
| `PUT` | `/api/orders/:id/status` | Update order status | Admin |
| `GET` | `/api/admin/orders` | Get all orders | Admin |

### Favorites
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/favorites` | Get customer's favorites | Customer |
| `POST` | `/api/favorites` | Add product to favorites | Customer |
| `DELETE` | `/api/favorites/:productId` | Remove from favorites | Customer |

### Customer Profile
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/customers/profile` | Get customer profile | Customer |
| `PUT` | `/api/customers/profile` | Update profile | Customer |
| `POST` | `/api/customers/change-password` | Change password | Customer |

### Admin - Customers
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/admin/customers` | List all customers | Admin |
| `GET` | `/api/admin/customers/:id` | Get customer details | Admin |
| `PUT` | `/api/admin/customers/:id` | Update customer | Admin |
| `DELETE` | `/api/admin/customers/:id` | Delete customer | Admin |
| `GET` | `/api/admin/customers/:id/view` | Get visibility overrides | Admin |
| `PUT` | `/api/admin/customers/:id/view` | Update visibility overrides | Admin |

### Admin - System
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/admin/activity` | Get activity log | Admin |
| `GET` | `/api/admin/stats` | Get system statistics | Admin |
| `GET` | `/api/settings` | Get all settings | Admin |
| `PUT` | `/api/settings/:key` | Update setting | Admin |
| `GET` | `/api/admin/pending-registrations` | Get pending registrations | Admin |
| `PUT` | `/api/admin/pending-registrations/:id/approve` | Approve registration | Admin |
| `DELETE` | `/api/admin/pending-registrations/:id` | Reject registration | Admin |

## 🔐 Authentication & Authorization

**JWT-based authentication** with role-based access control.

### Token Flow
1. User logs in via `/api/auth/login`
2. Server validates credentials (bcrypt password check)
3. Server generates JWT token with user payload
4. Client stores token in localStorage
5. Client sends token in Authorization header: `Authorization: Bearer <token>`
6. Server validates token on protected routes

### User Roles
- **Customer** - Access to catalog, cart, orders, favorites
- **Admin** - Full access to admin dashboard
- **Sales** - Limited admin access (view-only)
- **View-Only** - Read-only admin access

### Protected Routes
- Customer routes: Require valid customer token
- Admin routes: Require admin/sales/view-only role
- Public routes: Login, register, password reset

## 🗄️ Database Schema

**Managed by Prisma ORM** - See `prisma/schema.prisma` for full schema.

### Core Tables

**Products**
```sql
products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255),
  weight VARCHAR(50),
  bags_per_case VARCHAR(50),
  cases_per_pallet INT DEFAULT 60,
  price DECIMAL(10,2) DEFAULT 25.00,
  category_id INT,
  super_category_id INT,
  image_url VARCHAR(512),
  sku VARCHAR(100),
  sort_order INT DEFAULT 0,
  is_hidden BOOLEAN DEFAULT false,
  is_oos BOOLEAN DEFAULT false,
  show_price BOOLEAN DEFAULT true,
  created_at TIMESTAMP
)
```

**Customers**
```sql
customers (
  id VARCHAR(50) PRIMARY KEY,
  company_name VARCHAR(255),
  contact_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  phone VARCHAR(20),
  address_line1, address_line2, city, state, zip, country,
  view_preset VARCHAR(50) DEFAULT 'full',
  active BOOLEAN DEFAULT true,
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP,
  password_changed_at TIMESTAMP,
  created_at TIMESTAMP,
  last_login TIMESTAMP
)
```

**Orders**
```sql
orders (
  id VARCHAR(50) PRIMARY KEY,
  customer_id VARCHAR(50) REFERENCES customers(id),
  status VARCHAR(50) DEFAULT 'Pending',
  total_cases INT DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

order_items (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) REFERENCES orders(id),
  product_id VARCHAR(50) REFERENCES products(id),
  qty INT,
  unit VARCHAR(20),  -- 'cases' or 'pallets'
  created_at TIMESTAMP
)
```

**Admin Users**
```sql
users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(50) DEFAULT 'view-only',  -- 'admin', 'sales', 'view-only'
  active BOOLEAN DEFAULT true,
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP,
  created_at TIMESTAMP,
  last_login TIMESTAMP
)
```

### Visibility System

**Per-Customer Product Overrides**
```sql
customer_overrides (
  id SERIAL PRIMARY KEY,
  customer_id VARCHAR(50) REFERENCES customers(id),
  product_id VARCHAR(50) REFERENCES products(id),
  override_price DECIMAL(10,2),
  is_hidden BOOLEAN DEFAULT false,
  is_oos BOOLEAN DEFAULT false,
  UNIQUE(customer_id, product_id)
)
```

**Per-Customer Category Hiding**
```sql
customer_cat_hidden (
  id SERIAL PRIMARY KEY,
  customer_id VARCHAR(50) REFERENCES customers(id),
  super_category_id INT REFERENCES super_categories(id),
  UNIQUE(customer_id, super_category_id)
)
```

### Supporting Tables
- `favorites` - Customer favorite products
- `activity_log` - Audit trail with admin_id, entity tracking
- `carts` - Shopping cart persistence
- `pending_registrations` - Registration approval queue
- `settings` - System-wide key-value settings
- `categories` - Product categories
- `super_categories` - Top-level categories

## 🚀 Deployment

### Production Build

```bash
# Build frontend
npm run build

# Start production server
NODE_ENV=production npm start
```

### Environment Variables (Production)

```env
NODE_ENV=production
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
JWT_SECRET="<strong-random-secret>"
PORT=5000
FRONTEND_URL="https://wholesale.drprepperusa.com"
EMAIL_HOST="smtp.gmail.com"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="<app-password>"
```

### Deployment Options

**Option 1: Traditional Server (PM2)**
```bash
npm install -g pm2
pm2 start server.js --name drprepper-wholesale
pm2 save
pm2 startup
```

**Option 2: Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

**Option 3: Vercel/Netlify**
- Connect GitHub repo
- Set environment variables
- Deploy automatically on push

### Database Migration (Production)

```bash
# Apply migrations
npx prisma migrate deploy

# Verify schema
npx prisma db pull
```

## 🛠️ Development Workflow

### Available Scripts

```bash
npm start              # Start Express server
npm run dev            # Start with nodemon (auto-reload)
npm run build          # Build Vue frontend for production
npm run preview        # Preview production build
npm run seed           # Seed database with demo data
npm run migrate        # Run Prisma migrations (dev)
npm run prisma:generate # Generate Prisma Client
npm run prisma:studio  # Open Prisma Studio (DB GUI)
```

### Database Management

**Prisma Studio** - Visual database browser:
```bash
npm run prisma:studio
# Opens at http://localhost:5555
```

**Create Migration:**
```bash
npx prisma migrate dev --name add_new_feature
```

**Reset Database:**
```bash
npx prisma migrate reset
```

## 📝 Features & Roadmap

### ✅ Implemented
- [x] Product catalog with categories
- [x] Shopping cart with real-time updates
- [x] Customer favorites
- [x] Order placement & tracking
- [x] Admin dashboard
- [x] Per-customer product visibility
- [x] JWT authentication
- [x] Password reset via email
- [x] Activity logging
- [x] Prisma ORM integration
- [x] Vue 3 SPA frontend

### 🔄 In Progress
- [ ] React 18 migration (from Vue 3)
- [ ] Cart persistence (table exists, not implemented)
- [ ] Email notifications on order placement
- [ ] Registration approval workflow UI

### 📋 Planned
- [ ] Image upload to S3/R2
- [ ] Export orders as CSV/PDF
- [ ] Mobile responsive improvements
- [ ] Real-time order updates (WebSocket)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

## 📚 Additional Documentation

- **API Documentation**: See API endpoints section above
- **Database Schema**: `prisma/schema.prisma`
- **Migration History**: `migrations/pre-prisma/` (archived)
- **Code Cleanup Audit**: `DEAD_CODE_AUDIT_REPORT.md`
- **Extended Audit**: `EXTENDED_DEAD_CODE_AUDIT.md`

## 🔧 Troubleshooting

**Database connection issues:**
```bash
# Test connection
npx prisma db pull

# Check DATABASE_URL format
echo $DATABASE_URL
```

**Prisma Client not found:**
```bash
npm run prisma:generate
```

**Port already in use:**
```bash
# Change PORT in .env or:
PORT=3000 npm start
```

**Frontend not loading:**
```bash
# Rebuild frontend
npm run build

# Check Vite dev server
npm run dev
```

## 📜 Changelog

### March 2026 - Code Cleanup & Modernization
- ✅ Removed 30+ debug console.logs from production code
- ✅ Removed unused dependencies (axios)
- ✅ Removed dead code (calculateTotalCases function, helmet/morgan imports)
- ✅ Archived old schema.sql to `sql/archive/`
- ✅ Archived pre-Prisma migrations to `migrations/pre-prisma/`
- ✅ Added migration documentation (`migrations/README.md`)
- ✅ Updated README to reflect current architecture

### Database Migration
- ✅ Migrated from raw SQL to Prisma ORM
- ✅ All tables managed by Prisma schema
- ⚠️ Queries still use raw SQL via `pool.query()` (Prisma Client available but not used)

### Frontend Evolution
- ✅ Vue 3 SPA with Vite
- 🔄 React 18 migration planned

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Make changes and test thoroughly
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 👤 Author

**DJ** - DR Prepper USA

---

**Built with ❤️ for B2B wholesale excellence**
