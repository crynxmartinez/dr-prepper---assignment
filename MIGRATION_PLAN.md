# Vue 3 → React 18 Migration Plan

**Author:** Raphael Martinez
**Branch:** `raphael-martinez-branch`
**Base:** `master`
**Status:** Draft — Migration in Progress

---

## Overview

Full frontend migration of the DR Prepper B2B Wholesale Ordering Portal from **Vue 3 (Options API)** to **React 18**. The Express/Prisma backend, all API endpoints, database schema, and environment config remain completely untouched.

---

## Phase 1 — Project Setup

- Remove Vue devDependencies: `vue`, `@vitejs/plugin-vue`, `vue-draggable-next`
- Add React devDependencies: `react`, `react-dom`, `@vitejs/plugin-react`
- Add DnD dependencies: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- Update `vite.config.js`: swap `vue()` plugin → `react()` plugin
- Update `index.html` entry point: `main.js` → `main.jsx`

---

## Phase 2 — Global State (Context)

- Create `src/context/AppContext.jsx`
  - Houses all state from `App.vue`'s `data()`: `isLoggedIn`, `userRole`, `activePage`, `products`, `categories`, `cartItems`, `favorites`, `orders`, `selectedProduct`, `viewMode`, etc.
  - Uses `useReducer` for complex state transitions (cart add/remove, login/logout)
  - Exposes context via `useAppContext()` custom hook
- Extract `src/hooks/useAuth.js` — `handleLogin`, `signOut`, `loadProfile`
- Extract `src/hooks/useCart.js` — `addToCart`, `removeFromCart`, `clearCart`, `submitOrder`

---

## Phase 3 — Entry Point + App Shell

- Rewrite `src/main.jsx`: `ReactDOM.createRoot(...).render(<AppProvider><App /></AppProvider>)`
- Rewrite `src/App.jsx`:
  - Consumes `AppContext`
  - Renders `<Login>` or main layout (Nav + Pages + CartSidebar) based on `isLoggedIn`
  - Maps Vue's `v-if`/`v-show` → `{condition && <Component />}` or `className` toggling
  - Maps `v-for` → `.map()`
  - Maps `v-model` → `value` + `onChange`
  - Maps `@click` → `onClick`
  - Maps Vue `computed` → `useMemo`
  - `mounted()` lifecycle → `useEffect(() => {...}, [])`
  - Move `<style>` block → `src/index.css`

---

## Phase 4 — Customer-Facing Components

Migrate in dependency order (leaves first):

- `Login.jsx` — form state with `useState`, fetch call unchanged
- `ProductCard.jsx` — props-driven, no internal state
- `CartItem.jsx` — props-driven
- `ProductGrid.jsx` — receives `products` array, maps to `<ProductCard>`
- `CategoryList.jsx` — recursive category tree rendering
- `CategorySidebar.jsx` — wraps `CategoryList`
- `CategoryView.jsx` — grouped product display
- `CartOverlay.jsx` — modal with conditional render
- `OrderConfirmModal.jsx` — modal dialog

---

## Phase 5 — Admin Components

- `AdminDashboard.jsx` — stats/metrics display
- `BulkEditView.jsx` — table with inline editing via `useState`
- `AdminPortal.jsx` — replace `vue-draggable-next` with `@dnd-kit/sortable`; wrap draggable lists in `<DndContext>` + `<SortableContext>`

---

## Phase 6 — Cleanup & Validation

- Delete all `*.vue` files and `src/main.js`
- Run `npm run build` — verify Vite compiles cleanly
- Smoke-test: login, browse catalog, add to cart, place order, admin panel drag-and-drop
- Verify API proxy (`/api` → `localhost:5001`) still works identically

---

## What Does NOT Change

| Layer | Files |
|---|---|
| Backend | `server.js` |
| Database | `prisma/` schema and seed |
| API endpoints | All `/api/` routes |
| Environment | `.env` |
| Static assets | `public/` |

---

## Dependency Changes

| Action | Package |
|---|---|
| Remove | `vue`, `@vitejs/plugin-vue`, `vue-draggable-next` |
| Add | `react`, `react-dom`, `@vitejs/plugin-react` |
| Add | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |

---

## Component File Mapping

| Vue | React |
|---|---|
| `App.vue` | `App.jsx` |
| `Login.vue` | `Login.jsx` |
| `ProductCard.vue` | `ProductCard.jsx` |
| `ProductGrid.vue` | `ProductGrid.jsx` |
| `CategoryList.vue` | `CategoryList.jsx` |
| `CategorySidebar.vue` | `CategorySidebar.jsx` |
| `CategoryView.vue` | `CategoryView.jsx` |
| `CartItem.vue` | `CartItem.jsx` |
| `CartOverlay.vue` | `CartOverlay.jsx` |
| `OrderConfirmModal.vue` | `OrderConfirmModal.jsx` |
| `AdminPortal.vue` | `AdminPortal.jsx` |
| `AdminDashboard.vue` | `AdminDashboard.jsx` |
| `BulkEditView.vue` | `BulkEditView.jsx` |
| *(new)* | `src/context/AppContext.jsx` |
| *(new)* | `src/hooks/useAuth.js` |
| *(new)* | `src/hooks/useCart.js` |
