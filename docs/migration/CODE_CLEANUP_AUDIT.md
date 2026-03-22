# 🧹 Code Cleanup Audit Report

**DR Prepper Wholesale Portal**  
**Date:** March 22, 2026  
**Purpose:** Identify dead code, unused functions, and cleanup opportunities before React migration

---

## ⚠️ SAFETY RULES REMINDER

**From your global rules - CRITICAL:**

```
## CRITICAL: File System Safety Rules

**⚠️ ON JANUARY 5, 2026, A DANGEROUS COMMAND DESTROYED THE USER'S ENTIRE D:\ DRIVE**

**NEVER use dangerous delete commands:**
- NEVER use `rmdir /s /q` 
- NEVER use `rm -rf`
- NEVER use `Remove-Item -Recurse -Force` on directories
- NEVER use `del /f /q` on directories

**For deleting files/folders, ALWAYS:**
1. Use `git rm` if in a git repository
2. Or ask the user to delete manually
3. Or use single-file deletion only (no recursive)
4. NEVER delete directories with special characters like `[id]` via command line

**Before ANY delete command:**
1. Confirm the exact path is correct
2. Use non-recursive, non-force methods
3. If unsure, ASK the user to do it manually
```

**When cleaning up, we will:**
- ✅ List what to delete
- ✅ Ask user to confirm
- ✅ Use `git rm` for tracked files
- ✅ Let user delete manually for safety
- ❌ NEVER use recursive delete commands

---

## 📊 AUDIT FINDINGS

### **1. OLD BUILD FILES** 🔴 **HIGH PRIORITY**

**Location:** `public-old/` folder

**What's inside:**
- 23 old JavaScript build files
- Old CSS files
- Old HTML files (index-old.html, index-new.html)
- Old images folder (empty)
- Total: ~28 files

**Why it exists:**
- Leftover from previous builds
- You kept old builds as backup during development
- No longer needed - current build is in `public/`

**Recommendation:**
- ✅ **DELETE entire `public-old/` folder**
- Current build files are in `public/` and working fine
- These are just taking up space

**Safety:**
- Use `git rm -r public-old/` (if tracked)
- Or ask user to delete folder manually

---

### **2. OLD SCRIPT FILES** 🟡 **MEDIUM PRIORITY**

**Location:** `scripts/` folder

**Files that might be unused:**

#### **A. Old Migration Scripts**
```
scripts/migrate.js              ← Old migration (now using Prisma)
scripts/migrate-add-price.js    ← One-time migration (already done)
```

**Status:** 
- `migrate.js` referenced in `package.json` as `migrate:old`
- Probably not used anymore (using Prisma migrations now)
- `migrate-add-price.js` was a one-time fix

**Recommendation:**
- ⚠️ **KEEP for now** (might need for reference)
- Can delete after confirming Prisma migrations working

#### **B. Old Seed Scripts**
```
scripts/seed.js                 ← Old seeding (now using prisma/seed.js)
scripts/seed-categories.js      ← Old category seeding
scripts/seed-products.js        ← Old product seeding
```

**Status:**
- `seed.js` referenced in `package.json` as `seed:old`
- Now using `prisma/seed.js` instead
- Old scripts use raw SQL, new one uses Prisma

**Recommendation:**
- ⚠️ **KEEP for now** (might need for data recovery)
- Can delete after confirming Prisma seed works

#### **C. Image Processing Scripts**
```
scripts/extract-images.js
scripts/fetch-pexels-images.js
scripts/fix-images-correct.js
scripts/fix-product-images.js
scripts/populate-image-urls.js
scripts/execute-image-reassignment.js
```

**Status:**
- These were used to fix product images
- One-time scripts, already executed
- Images are now correctly assigned

**Recommendation:**
- ⚠️ **KEEP for reference** (in case images break again)
- Or move to `scripts/archive/` folder

#### **D. Data Transformation Scripts**
```
scripts/transform-products.js
scripts/prods-data.js           ← 35KB of product data
scripts/products.json           ← 57KB
scripts/products_raw.json       ← 35KB
scripts/products_transformed.json ← 57KB
```

**Status:**
- Used during initial data import
- Data now in database
- JSON files are duplicates

**Recommendation:**
- ✅ **DELETE JSON files** (data in database)
- ⚠️ **KEEP transform script** (might need again)

#### **E. Utility Scripts**
```
scripts/cleanup-logs.js         ← Cleans old logs
```

**Status:**
- Utility script, might be useful
- Not currently used

**Recommendation:**
- ✅ **KEEP** (useful utility)

---

### **3. PACKAGE.JSON CLEANUP** 🟡 **MEDIUM PRIORITY**

**Unused/Old Script References:**

```json
"seed:old": "node scripts/seed.js",      ← Not used (using prisma seed)
"migrate:old": "node scripts/migrate.js" ← Not used (using prisma migrate)
```

**Recommendation:**
- ✅ **REMOVE** these script entries
- Keep only active scripts

**Deprecated Dependencies (from package-lock.json):**
```
- are-we-there-yet (deprecated)
- gauge (deprecated)
- glob v7.2.3 (deprecated - security issues!)
- inflight (deprecated - memory leak!)
- npmlog (deprecated)
- rimraf v3.0.2 (deprecated)
- tar v6.2.1 (deprecated - security issues!)
```

**Status:**
- These are sub-dependencies (not directly installed)
- Installed by other packages
- Can't remove directly

**Recommendation:**
- ⚠️ **UPDATE parent packages** to get newer versions
- Run `npm audit fix` to update
- Check if any packages need major version updates

---

### **4. SERVER.JS DEAD CODE** 🟢 **LOW PRIORITY**

**TODO Comments:**

```javascript
Line 375: // TODO: Email admin about pending registration
Line 1369: // TODO: Email order to admin (DJ)
```

**Status:**
- Email functionality not implemented yet
- Marked as TODO for future

**Recommendation:**
- ⚠️ **KEEP** (future feature)
- Or implement email sending

**Dual Database Setup:**

```javascript
// Prisma Client (for new code)
const prisma = new PrismaClient({ ... });

// Legacy pg Pool (for existing queries)
const pool = new pg.Pool({ ... });
```

**Status:**
- Using BOTH Prisma and raw pg queries
- Most code still uses `pool.query()` (raw SQL)
- Prisma barely used

**Recommendation:**
- ⚠️ **KEEP BOTH for now**
- After React migration, consider migrating all queries to Prisma
- This is a separate cleanup task

---

### **5. UNUSED DEPENDENCIES** 🟡 **MEDIUM PRIORITY**

**Checking package.json dependencies:**

```json
"axios": "^1.13.6"              ← Used in frontend? Check
"nodemailer": "^6.9.3"          ← Not used (TODO emails)
"vue-draggable-next": "^2.3.0"  ← Used in AdminPortal
```

**Axios:**
- Need to check if frontend uses it
- Might be unused (using fetch API instead)

**Nodemailer:**
- Imported in server.js
- Transporter created but never used
- Waiting for email feature implementation

**Recommendation:**
- ⚠️ **KEEP axios** (check frontend first)
- ⚠️ **KEEP nodemailer** (future feature)
- ✅ **KEEP vue-draggable-next** (used in admin)

---

### **6. UNUSED FILES IN ROOT** 🟢 **LOW PRIORITY**

**Files that might be unused:**

```
index.html                      ← Root index (not used, using public/index.html)
test-endpoints.js               ← Testing script
test-prisma.js                  ← Testing script
create-account.js               ← Utility script
check-images.js                 ← Utility script
backup.sh                       ← Backup script
pg_password.txt                 ← Password file (⚠️ security risk!)
```

**Recommendations:**

**index.html:**
- ✅ **DELETE** (using public/index.html)

**test-*.js:**
- ⚠️ **KEEP** (useful for testing)
- Or move to `scripts/` folder

**create-account.js:**
- ⚠️ **KEEP** (utility for creating accounts)

**check-images.js:**
- ⚠️ **KEEP** (utility for checking images)

**backup.sh:**
- ✅ **KEEP** (important for backups!)

**pg_password.txt:**
- 🔴 **SECURITY RISK!**
- ✅ **DELETE** and add to .gitignore
- Use environment variables instead

---

### **7. DOCUMENTATION FILES** 🟢 **LOW PRIORITY**

**You have 27 markdown files in root:**

```
API_DOCUMENTATION.md
BUG_REPORT.md
CATEGORY_REBUILD.md
COMPLETE_SYSTEM_BREAKDOWN.md
CRYNXMARTINEZ_QUICK_START.md
DEPLOYMENT.md
DEPLOYMENT_GUIDE.md
FAVORITES_COMPLETE_REPORT.md
FAVORITES_DEBUG_PLAN.md
... (18 more)
```

**Status:**
- Many are completion reports from past tasks
- Some are duplicates (DEPLOYMENT.md vs DEPLOYMENT_GUIDE.md)
- Taking up space but useful for reference

**Recommendation:**
- ⚠️ **ORGANIZE** into folders:
  - `docs/` - Active documentation
  - `docs/archive/` - Completed task reports
  - `docs/guides/` - Setup and deployment guides

**Suggested organization:**

```
docs/
├── guides/
│   ├── API_DOCUMENTATION.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── LOCAL_SETUP.md
│   └── PRODUCTION_RUNBOOK.md
├── migration/
│   ├── REACT_MIGRATION_ANALYSIS.md
│   ├── VUE_TO_REACT_MIGRATION_STRATEGY.md
│   ├── SIMPLE_MIGRATION_PLAN.md
│   └── COMPLETE_SYSTEM_BREAKDOWN.md
└── archive/
    ├── FAVORITES_COMPLETE_REPORT.md
    ├── PHASE1_COMPLETION_REPORT.md
    ├── TASK_COMPLETION_REPORT.md
    └── ... (other completed reports)
```

---

### **8. APP.VUE UNUSED CODE** 🟡 **MEDIUM PRIORITY**

**Need to audit for:**
- Unused methods
- Unused computed properties
- Unused data variables
- Dead event handlers

**Status:**
- App.vue is 3,271 lines
- Too large to audit in this pass
- Need dedicated audit

**Recommendation:**
- ⚠️ **SEPARATE TASK** - Audit App.vue methods
- Do this AFTER React migration planning
- Or during migration (will see what's used)

---

### **9. COMPONENT UNUSED CODE** 🟡 **MEDIUM PRIORITY**

**Components to audit:**
- AdminPortal.vue (5,894 lines - HUGE!)
- All other components

**Status:**
- Need to check each component
- Look for unused props, methods, computed

**Recommendation:**
- ⚠️ **SEPARATE TASK** - Component-by-component audit
- Do during React migration (will refactor anyway)

---

## 📋 CLEANUP CHECKLIST

### **IMMEDIATE (Safe to delete now)**

- [ ] Delete `public-old/` folder (old build files)
- [ ] Delete `pg_password.txt` (security risk)
- [ ] Delete root `index.html` (using public/index.html)
- [ ] Delete `scripts/products.json` (data in DB)
- [ ] Delete `scripts/products_raw.json` (data in DB)
- [ ] Delete `scripts/products_transformed.json` (data in DB)
- [ ] Remove `seed:old` from package.json scripts
- [ ] Remove `migrate:old` from package.json scripts

**Estimated space saved:** ~150MB

---

### **AFTER CONFIRMATION (Check first)**

- [ ] Check if frontend uses `axios` (grep for axios in src/)
- [ ] Confirm Prisma migrations working, then delete old migrate scripts
- [ ] Confirm Prisma seed working, then delete old seed scripts
- [ ] Move image scripts to `scripts/archive/`
- [ ] Run `npm audit fix` to update deprecated dependencies

---

### **ORGANIZE (Improve structure)**

- [ ] Create `docs/` folder structure
- [ ] Move documentation files to appropriate folders
- [ ] Move test scripts to `scripts/` folder
- [ ] Add `pg_password.txt` to .gitignore

---

### **LATER (During React migration)**

- [ ] Audit App.vue for unused methods
- [ ] Audit all components for unused code
- [ ] Consider migrating all SQL queries to Prisma
- [ ] Remove Vue dependencies after migration complete

---

## 🎯 RECOMMENDED CLEANUP ORDER

### **Step 1: Safe Deletions (Now)**
1. Delete `public-old/` folder
2. Delete `pg_password.txt`
3. Delete root `index.html`
4. Delete JSON files in scripts/

**How to delete safely:**
```bash
# Use git rm for tracked files
git rm -r public-old/
git rm pg_password.txt
git rm index.html
git rm scripts/products*.json

# Commit
git commit -m "chore: remove old build files and unused data"
```

---

### **Step 2: Package.json Cleanup (Now)**
1. Remove `seed:old` script
2. Remove `migrate:old` script
3. Run `npm audit fix`

**Changes:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node prisma/seed.js",
    "migrate": "npx prisma migrate dev",
    "prisma:generate": "npx prisma generate",
    "prisma:studio": "npx prisma studio",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

### **Step 3: Organize Documentation (Later)**
1. Create docs/ folder structure
2. Move files to appropriate locations
3. Update README with new structure

---

### **Step 4: Code Audit (During React Migration)**
1. Audit components as you convert them
2. Remove unused code during conversion
3. Cleaner React code from the start

---

## 📊 SUMMARY

### **Files to Delete:**
- `public-old/` folder (~28 files, ~100MB)
- `pg_password.txt` (security risk)
- Root `index.html` (duplicate)
- 3 JSON files in scripts/ (~150KB)

### **Scripts to Remove:**
- `seed:old` in package.json
- `migrate:old` in package.json

### **To Organize:**
- 27 markdown files → docs/ folder structure
- Test scripts → scripts/ folder

### **To Audit Later:**
- App.vue methods (3,271 lines)
- Component code (12 components)
- SQL → Prisma migration

### **Total Space to Save:**
- ~150MB of old files
- Cleaner project structure
- Easier to navigate

---

## ⚠️ IMPORTANT NOTES

**Before deleting anything:**
1. ✅ Commit current work to git
2. ✅ Confirm files are tracked in git (can recover if needed)
3. ✅ Use `git rm` for tracked files
4. ✅ Ask user to confirm deletions
5. ❌ NEVER use `rmdir /s /q` or similar dangerous commands

**After cleanup:**
1. ✅ Test that app still works
2. ✅ Test that build still works
3. ✅ Commit cleanup changes
4. ✅ Push to GitHub

---

**Ready to proceed with cleanup? User needs to confirm which items to delete.**
