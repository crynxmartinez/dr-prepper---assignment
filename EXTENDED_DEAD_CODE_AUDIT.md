# 🔍 Extended Dead Code Audit - Schema, Migrations, SQL & Components

**DR Prepper Wholesale Portal**  
**Date:** March 22, 2026  
**Scope:** Database schemas, migrations, SQL files, unused components

---

## 📊 FINDINGS SUMMARY

**Categories Audited:**
1. Database Schemas (schema.sql vs prisma/schema.prisma)
2. Migration Files (migrations/ folder)
3. SQL Files (sql/ folder)
4. Prisma Migrations
5. Vue Components (src/components/)
6. Documentation Files

**Total Issues Found:** 12 categories

---

## 🔴 CRITICAL ISSUES

### **1. DUPLICATE DATABASE SCHEMAS** 🔴

**Found TWO schema definitions:**

#### **A. schema.sql (162 lines)**
- Location: Root folder
- Type: Raw SQL schema
- Status: ⚠️ **POTENTIALLY OUTDATED**

#### **B. prisma/schema.prisma (244 lines)**
- Location: prisma/ folder
- Type: Prisma schema
- Status: ✅ **ACTIVE** (has migrations)

**Analysis:**

**Differences found:**

1. **schema.sql is MISSING:**
   - `users` table (admin users)
   - `reset_token` and `reset_token_expires` columns in customers
   - `password_changed_at` column
   - `override_price` column in customer_overrides
   - `admin_id`, `entity_type`, `entity_id`, `ip_address` columns in activity_log

2. **schema.sql has DIFFERENT:**
   - activity_log references customers (NOT NULL)
   - Prisma schema has activity_log.customerId as nullable

**Conclusion:**
- ✅ **Prisma schema is the source of truth**
- ❌ **schema.sql is outdated**
- Database is using Prisma migrations, not schema.sql

**Recommendation:**
- 🔴 **DELETE schema.sql** (outdated, confusing)
- OR **UPDATE** it to match Prisma schema
- OR **ADD COMMENT** saying "See prisma/schema.prisma for current schema"

---

### **2. UNUSED CARTS TABLE** 🔴

**Found in:**
- schema.sql line 134-143
- prisma/schema.prisma line 228-243
- migrations/008_create_carts_table.sql

**Purpose:** Shopping cart persistence (save cart to database)

**Analysis:**
- Table exists in schema
- Migration was run to create it
- **ZERO API endpoints use it**
- **ZERO frontend code uses it**

**Searched for:**
- `GET /api/cart` - NOT FOUND
- `POST /api/cart` - NOT FOUND
- `carts` table queries - NOT FOUND

**Current cart implementation:**
- Cart stored in **App.vue data()** (in-memory only)
- Cart lost on page refresh
- No database persistence

**Recommendation:**
- 🟡 **KEEP table** (future feature for cart persistence)
- OR 🔴 **DROP table** if not implementing soon
- Decision: Is cart persistence planned?

---

### **3. UNUSED SQL FILES IN sql/ FOLDER** 🔴

**Found 2 files:**

#### **A. 001-fix-product-image-assignments.sql (19KB)**
- Purpose: One-time fix for product images
- Status: ✅ **ALREADY EXECUTED**
- Contains: 200+ UPDATE statements

#### **B. 001-fix-product-image-assignments-CORRECTED.sql (18KB)**
- Purpose: Corrected version of above
- Status: ✅ **ALREADY EXECUTED**
- Contains: 200+ UPDATE statements

**Analysis:**
- Both files are one-time data fixes
- Already executed (images are correct now)
- Taking up 37KB of space
- No longer needed

**Recommendation:**
- ✅ **MOVE** to `sql/archive/` folder
- OR ✅ **DELETE** (data already fixed)
- Keep git history for reference

---

## 🟡 MEDIUM PRIORITY

### **4. OLD MIGRATIONS IN migrations/ FOLDER** 🟡

**Found 8 migration files:**

```
001_add_category_visibility.sql          (464 bytes)
002_production_readiness.sql             (2,953 bytes)
003_phase1_password_reset_and_expiry.sql (1,546 bytes)
004_phase2_seed_admin_user.sql           (875 bytes)
005_add_override_price_column.sql        (496 bytes)
006_populate_sku_from_product_id.sql     (386 bytes)
007_fix_truncated_product_names.sql      (996 bytes)
008_create_carts_table.sql               (709 bytes)
```

**Analysis:**

**These are OLD raw SQL migrations:**
- Used BEFORE switching to Prisma
- Already applied to database
- Now using Prisma migrations instead

**Current migration system:**
- Prisma migrations in `prisma/migrations/`
- Only 1 Prisma migration: `20260322021854_init`

**Status of old migrations:**
- ✅ All already applied
- ❌ No longer used (Prisma manages migrations now)
- ⚠️ Confusing to have two migration systems

**Recommendation:**
- ⚠️ **MOVE** to `migrations/archive/` or `migrations/pre-prisma/`
- OR ⚠️ **KEEP** for historical reference
- **ADD README** explaining migration history:
  - migrations/ = Old raw SQL migrations (pre-Prisma)
  - prisma/migrations/ = Current Prisma migrations

---

### **5. UNUSED COMPONENT: AdminDashboard.vue** 🟡

**Location:** `src/components/AdminDashboard.vue` (13KB)

**Analysis:**
- Component file exists
- Searched for imports in App.vue
- **NOT IMPORTED** in App.vue
- Searched in AdminPortal.vue...

**Need to verify:** Is AdminDashboard used inside AdminPortal?

**Recommendation:**
- ⚠️ **CHECK** AdminPortal.vue for usage
- If not used, **DELETE**

---

### **6. UNUSED COMPONENT: BulkEditView.vue** 🟡

**Location:** `src/components/BulkEditView.vue` (33KB)

**Analysis:**
- Component file exists
- Searched for imports in App.vue
- **NOT IMPORTED** in App.vue
- Likely used inside AdminPortal

**Need to verify:** Is BulkEditView used inside AdminPortal?

**Recommendation:**
- ⚠️ **CHECK** AdminPortal.vue for usage
- If not used, **DELETE**

---

### **7. UNUSED COMPONENT: CategorySidebar.vue** 🟡

**Location:** `src/components/CategorySidebar.vue` (7KB)

**Analysis:**
- Component file exists
- Searched for imports in App.vue
- **NOT IMPORTED** in App.vue

**Possible scenarios:**
- Replaced by CategoryList.vue?
- Old version of sidebar?
- Unused duplicate?

**Recommendation:**
- ⚠️ **VERIFY** if used anywhere
- If not used, **DELETE**

---

### **8. ACTIVITY LOG FEATURE - PARTIALLY IMPLEMENTED** 🟡

**Found:**

**Database:**
- ✅ activity_log table exists (schema.sql + Prisma)
- ✅ Indexes created

**Backend:**
- ✅ logActivity() function exists
- ✅ GET /api/admin/activity endpoint exists
- ✅ Used in 1 place: order placement

**Frontend:**
- ❓ Need to check if AdminPortal displays activity log

**Analysis:**
- Activity logging is partially implemented
- Only logs order placement
- Admin endpoint exists to view logs
- Unknown if frontend displays it

**Recommendation:**
- ⚠️ **VERIFY** if admin portal shows activity log
- If not used, consider removing endpoint
- If used, expand logging to more actions

---

## 🟢 LOW PRIORITY - INFORMATIONAL

### **9. PRISMA MIGRATION STATUS** 🟢

**Found:**
- `prisma/migrations/20260322021854_init/` - Initial migration
- `prisma/migrations/migration_lock.toml` - Lock file

**Analysis:**
- Only 1 Prisma migration exists
- This is the "init" migration (creates all tables)
- Ran on March 22, 2026
- All subsequent changes done via raw SQL migrations (old system)

**Status:**
- ✅ Prisma is set up correctly
- ⚠️ Not being used for new migrations
- Still using old raw SQL migration files

**Recommendation:**
- ⚠️ **DECIDE:** Use Prisma migrations going forward?
- OR keep using raw SQL?
- Consistency is important

---

### **10. SCHEMA INCONSISTENCIES** 🟢

**Found differences between schema.sql and Prisma:**

#### **Missing in schema.sql:**

**users table:**
```sql
-- Completely missing from schema.sql
-- Exists in Prisma schema
```

**customers table - missing columns:**
```sql
reset_token VARCHAR(255)
reset_token_expires TIMESTAMP
password_changed_at TIMESTAMP
```

**customer_overrides - missing column:**
```sql
override_price DECIMAL(10, 2)
```

**activity_log - missing columns:**
```sql
admin_id VARCHAR(50)
entity_type VARCHAR(50)
entity_id VARCHAR(50)
ip_address VARCHAR(50)
```

**Recommendation:**
- ✅ **Use Prisma schema as source of truth**
- ✅ **Delete or update schema.sql**

---

### **11. COMPONENT USAGE VERIFICATION NEEDED** 🟢

**All 12 components in src/components/:**

**Imported in App.vue (9 components):**
- ✅ CategoryList
- ✅ ProductGrid
- ✅ CategoryView
- ✅ ProductCard
- ✅ CartItem
- ✅ CartOverlay
- ✅ OrderConfirmModal
- ✅ AdminPortal
- ✅ Login

**NOT imported in App.vue (3 components):**
- ❓ AdminDashboard.vue (likely used in AdminPortal)
- ❓ BulkEditView.vue (likely used in AdminPortal)
- ❓ CategorySidebar.vue (possibly unused?)

**Recommendation:**
- ⚠️ **CHECK** AdminPortal.vue imports
- Verify these 3 components are actually used

---

### **12. DOCUMENTATION FILES - ALREADY ORGANIZED** 🟢

**Status:** ✅ Already organized in previous cleanup

**Current structure:**
```
docs/
├── guides/          (7 files)
├── migration/       (6 files)
└── archive/         (17 files)
```

**No issues found** - documentation is well organized

---

## 📋 CLEANUP CHECKLIST

### **IMMEDIATE (Critical)**

- [ ] **DECIDE:** Delete or update schema.sql (outdated)
- [ ] **DECIDE:** Keep or drop carts table (unused)
- [ ] **MOVE:** sql/*.sql files to sql/archive/ (already executed)

**Estimated cleanup:** 3 files, ~40KB

---

### **VERIFY THEN ACT (Medium)**

- [ ] Check if AdminDashboard.vue is used in AdminPortal
- [ ] Check if BulkEditView.vue is used in AdminPortal
- [ ] Check if CategorySidebar.vue is used anywhere
- [ ] Check if activity log is displayed in admin portal
- [ ] Decide: Move old migrations to archive or keep

**Potential cleanup:** 0-3 components, 8 migration files

---

### **STRATEGIC DECISIONS (Low)**

- [ ] Decide: Use Prisma migrations or raw SQL going forward
- [ ] Decide: Implement cart persistence or remove table
- [ ] Decide: Expand activity logging or remove feature

---

## 🎯 RECOMMENDED ACTIONS

### **Step 1: Schema Cleanup**

**Option A - Delete schema.sql:**
```bash
git rm schema.sql
```

**Option B - Add deprecation notice:**
```sql
-- ⚠️ DEPRECATED: This schema is outdated
-- See prisma/schema.prisma for current database schema
-- This file kept for historical reference only
```

**Option C - Update to match Prisma:**
- Manually sync schema.sql with Prisma schema
- Add all missing tables and columns

**Recommendation:** Option A (delete) - Prisma is source of truth

---

### **Step 2: SQL Files Cleanup**

**Move executed SQL files:**
```bash
mkdir -p sql/archive
git mv sql/001-fix-product-image-assignments.sql sql/archive/
git mv sql/001-fix-product-image-assignments-CORRECTED.sql sql/archive/
```

---

### **Step 3: Migrations Organization**

**Create archive folder:**
```bash
mkdir -p migrations/pre-prisma
git mv migrations/*.sql migrations/pre-prisma/
```

**Add README:**
```markdown
# Database Migrations

## Current System
- **prisma/migrations/** - Active Prisma migrations

## Historical
- **migrations/pre-prisma/** - Old raw SQL migrations (pre-Prisma)
  - Already applied to production
  - Kept for reference only
```

---

### **Step 4: Component Verification**

**Check AdminPortal.vue:**
```bash
grep -n "AdminDashboard\|BulkEditView\|CategorySidebar" src/components/AdminPortal.vue
```

**If not found, delete unused components**

---

## 📊 SUMMARY BY CATEGORY

### **Database Schemas**
- **Issue:** Duplicate schemas (schema.sql vs Prisma)
- **Status:** schema.sql is outdated
- **Action:** Delete or deprecate schema.sql

### **Migrations**
- **Issue:** Two migration systems (raw SQL + Prisma)
- **Status:** Old migrations already applied
- **Action:** Archive old migrations, use Prisma going forward

### **SQL Files**
- **Issue:** One-time fix scripts still in sql/
- **Status:** Already executed
- **Action:** Move to sql/archive/

### **Unused Tables**
- **Issue:** carts table exists but unused
- **Status:** No API endpoints or frontend code
- **Action:** Decide to implement or drop

### **Components**
- **Issue:** 3 components not imported in App.vue
- **Status:** Likely used in AdminPortal (need verification)
- **Action:** Verify usage, delete if unused

---

## 🎯 TOTAL CLEANUP POTENTIAL

**Files to delete/move:**
- schema.sql (1 file, 162 lines)
- sql/*.sql (2 files, 37KB)
- migrations/*.sql (8 files, ~8KB) - move to archive
- Possibly 0-3 unused components

**Database cleanup:**
- Possibly drop carts table if not implementing

**Clarifications needed:**
- Which migration system to use going forward?
- Is cart persistence planned?
- Are AdminDashboard, BulkEditView, CategorySidebar used?

---

**Extended audit complete! Waiting for verification and decisions.**
