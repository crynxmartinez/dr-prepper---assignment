# 🔄 Vue → React Migration Strategy Document

**Project:** DR Prepper Wholesale Portal  
**Current Stack:** Vue 3 + Vite + Express + Prisma  
**Target Stack:** React 18 + Vite + Express + Prisma  
**Date:** March 22, 2026

---

## 📊 Current Codebase Analysis

### **Component Inventory**
- **Total Components:** 12 Vue components
- **Main App:** `App.vue` (3,271 lines - monolithic)
- **Leaf Components:** ProductCard, CartItem, OrderConfirmModal
- **Container Components:** ProductGrid, CategoryView, CartOverlay
- **Complex Components:** AdminPortal (162KB), Login, CategoryList
- **Dependencies:** Vue 3.3.0, vue-draggable-next

### **State Management**
- **No Vuex/Pinia** - all state in App.vue
- **Props drilling** from App → child components
- **Event emitters** for child → parent communication
- **Local state** in each component (data(), computed)

### **Key Features**
- JWT authentication
- Real-time cart management
- Favorites system
- Product catalog with categories
- Admin portal (bulk edit, orders, analytics)
- Mobile responsive design

---

## 🎯 Migration Strategy: Bottom-Up Approach

### **Phase 1: Convert 2-3 Leaf Components First**

**Why bottom-up?**
- ✅ Leaf components have minimal dependencies
- ✅ Can test in isolation
- ✅ Learn React patterns before tackling complex state
- ✅ Prove interoperability (Vue parent → React child)
- ✅ Build confidence and momentum

---

## 🔧 Components to Convert First (Priority Order)

### **1. ProductCard.vue → ProductCard.jsx** ⭐ **FIRST**

**Why this component?**
- **Self-contained:** Minimal external dependencies
- **Pure presentation:** Receives props, emits events
- **Reusable:** Used in multiple places (grid, favorites, categories)
- **Good complexity:** Has local state (resize handle) but manageable
- **High visibility:** Users see it everywhere - good proof of concept

**Current Props:**
```javascript
props: {
  product: Object (required),
  isFavorited: Boolean,
  inCart: Boolean,
  isFirst: Boolean
}
```

**Current Events:**
```javascript
emits: [
  'product-selected',
  'add-to-cart',
  'toggle-favorite',
  'card-resize'
]
```

**Local State:**
- `isResizing`, `startX`, `startY`, `initialScale` (resize handle)

**Computed:**
- `isNewItem` (date calculation)

**Migration Complexity:** 🟢 **LOW**
- Simple props → React props (1:1 mapping)
- Events → callback props
- Local state → useState hooks
- Computed → useMemo hook
- No external dependencies

---

### **2. CartItem.vue → CartItem.jsx** ⭐ **SECOND**

**Why this component?**
- **Similar to ProductCard:** Same patterns, reinforces learning
- **Quantity management:** Good example of controlled inputs in React
- **Watchers:** Learn how to replace Vue watchers with useEffect
- **Form handling:** Input binding, validation

**Current Props:**
```javascript
props: {
  item: Object (required),
  isLoading: Boolean
}
```

**Current Events:**
```javascript
emits: [
  'remove',
  'update-quantity'
]
```

**Local State:**
- `quantity` (synced with item.quantity via watcher)

**Watchers:**
- `item.quantity` → updates local quantity

**Migration Complexity:** 🟢 **LOW-MEDIUM**
- Props → React props
- Events → callbacks
- Watcher → useEffect with dependency array
- v-model → controlled input pattern
- Disabled state management

---

### **3. OrderConfirmModal.vue → OrderConfirmModal.jsx** ⭐ **THIRD**

**Why this component?**
- **Modal pattern:** Learn React portal/modal patterns
- **Form submission:** Practice form handling in React
- **Conditional rendering:** v-if → conditional JSX
- **Event handling:** Form validation, submit

**Current Props:**
```javascript
props: {
  open: Boolean,
  cartItems: Array,
  total: Number
}
```

**Current Events:**
```javascript
emits: [
  'close',
  'submit'
]
```

**Local State:**
- `notes` (textarea value)

**Migration Complexity:** 🟡 **MEDIUM**
- Modal overlay → React Portal or library (Radix UI, Headless UI)
- Form state → useState or react-hook-form
- Conditional rendering → JSX conditionals
- Click outside to close → useEffect + ref

---

## 🔄 State & Props Migration Strategy

### **Vue → React Mapping**

#### **Props (Parent → Child)**
```javascript
// VUE
props: {
  product: { type: Object, required: true },
  isFavorited: { type: Boolean, default: false }
}

// REACT
interface ProductCardProps {
  product: Product;
  isFavorited?: boolean;
}

function ProductCard({ product, isFavorited = false }: ProductCardProps) {
  // ...
}
```

#### **Events (Child → Parent)**
```javascript
// VUE
this.$emit('add-to-cart', product)

// REACT
props.onAddToCart(product)
```

#### **Local State**
```javascript
// VUE
data() {
  return {
    quantity: 1,
    isLoading: false
  }
}

// REACT
const [quantity, setQuantity] = useState(1);
const [isLoading, setIsLoading] = useState(false);
```

#### **Computed Properties**
```javascript
// VUE
computed: {
  isNewItem() {
    const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }
}

// REACT
const isNewItem = useMemo(() => {
  const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
}, [product.created_at]);
```

#### **Watchers**
```javascript
// VUE
watch: {
  'item.quantity'(newVal) {
    this.quantity = newVal;
  }
}

// REACT
useEffect(() => {
  setQuantity(item.quantity);
}, [item.quantity]);
```

#### **Lifecycle Hooks**
```javascript
// VUE
mounted() {
  this.loadData();
}

// REACT
useEffect(() => {
  loadData();
}, []); // Empty array = mount only
```

---

## ⚠️ Risky Dependencies & Mitigation

### **1. vue-draggable-next** 🔴 **HIGH RISK**

**Used in:** AdminPortal (category reordering, product sorting)

**Problem:**
- Vue-specific library
- No direct React equivalent with same API

**Mitigation:**
- **Option A:** Use `@dnd-kit/core` (modern, accessible, TypeScript)
- **Option B:** Use `react-beautiful-dnd` (popular, battle-tested)
- **Option C:** Use `react-dnd` (flexible, lower-level)
- **Recommendation:** `@dnd-kit/core` - best for new projects

**Migration Plan:**
- Convert AdminPortal LAST (Phase 3)
- Build drag-drop proof of concept separately
- Test thoroughly before integrating

---

### **2. Scoped CSS** 🟡 **MEDIUM RISK**

**Problem:**
- Vue's `<style scoped>` auto-generates unique class names
- React has no built-in equivalent

**Mitigation:**
- **Option A:** CSS Modules (`.module.css` files)
- **Option B:** Styled Components (CSS-in-JS)
- **Option C:** Tailwind CSS (utility-first)
- **Option D:** Vanilla CSS with BEM naming
- **Recommendation:** CSS Modules (minimal change, Vite supports out of box)

**Migration Plan:**
```javascript
// VUE
<style scoped>
.product-card { ... }
</style>

// REACT with CSS Modules
import styles from './ProductCard.module.css';
<div className={styles.productCard}>
```

---

### **3. v-model Two-Way Binding** 🟡 **MEDIUM RISK**

**Problem:**
- Vue's `v-model` is syntactic sugar for `:value` + `@input`
- React requires explicit controlled component pattern

**Mitigation:**
- Use controlled inputs with `value` + `onChange`
- Consider `react-hook-form` for complex forms

**Migration Plan:**
```javascript
// VUE
<input v-model="quantity" type="number">

// REACT
<input 
  value={quantity} 
  onChange={(e) => setQuantity(Number(e.target.value))}
  type="number"
/>
```

---

### **4. Global State Management** 🔴 **HIGH RISK**

**Problem:**
- All state currently in App.vue (3,271 lines)
- Props drilling through 3-4 levels
- No state management library

**Mitigation:**
- **Phase 1-2:** Keep state in App, use props (prove interop)
- **Phase 3:** Introduce Zustand or Context API
- **Phase 4:** Refactor to proper state management

**Recommendation:** Zustand
- Simple API (like Vue's reactivity)
- No boilerplate (unlike Redux)
- TypeScript support
- Devtools available

**Migration Plan:**
```javascript
// ZUSTAND STORE
import create from 'zustand';

const useStore = create((set) => ({
  cartItems: [],
  favorites: [],
  addToCart: (product) => set((state) => ({
    cartItems: [...state.cartItems, product]
  })),
  toggleFavorite: (productId) => set((state) => ({
    favorites: state.favorites.includes(productId)
      ? state.favorites.filter(id => id !== productId)
      : [...state.favorites, productId]
  }))
}));

// USAGE IN COMPONENT
function ProductCard({ product }) {
  const { favorites, toggleFavorite } = useStore();
  const isFavorited = favorites.includes(product.id);
  
  return (
    <button onClick={() => toggleFavorite(product.id)}>
      {isFavorited ? '♥' : '♡'}
    </button>
  );
}
```

---

### **5. Vite + Vue Plugin** 🟢 **LOW RISK**

**Problem:**
- Current build uses `@vitejs/plugin-vue`
- Need to support both Vue and React during migration

**Mitigation:**
- Vite supports multiple frameworks simultaneously
- Add `@vitejs/plugin-react` alongside Vue plugin
- Both can coexist during migration

**Migration Plan:**
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    vue(),
    react() // Add React support
  ]
});
```

---

## 📋 Detailed Migration Phases

### **Phase 1: Foundation (Week 1)**
- ✅ Set up React in existing Vite project
- ✅ Configure TypeScript (optional but recommended)
- ✅ Set up CSS Modules
- ✅ Create React component folder structure
- ✅ Convert ProductCard.vue → ProductCard.jsx
- ✅ Test ProductCard in isolation (Storybook or test page)
- ✅ Integrate ProductCard into Vue parent (prove interop)

**Success Criteria:**
- ProductCard renders correctly
- Props work from Vue parent
- Events/callbacks work to Vue parent
- Styling matches original
- No console errors

---

### **Phase 2: Expand Component Library (Week 2)**
- ✅ Convert CartItem.vue → CartItem.jsx
- ✅ Convert OrderConfirmModal.vue → OrderConfirmModal.jsx
- ✅ Test all 3 components together
- ✅ Document patterns and gotchas
- ✅ Create reusable hooks (useToggle, useLocalStorage, etc.)

**Success Criteria:**
- All 3 components working in production
- Consistent patterns across components
- Performance matches or exceeds Vue versions
- Mobile responsive working

---

### **Phase 3: Container Components (Week 3-4)**
- ✅ Convert ProductGrid.vue → ProductGrid.jsx
- ✅ Convert CategoryView.vue → CategoryView.jsx
- ✅ Convert CartOverlay.vue → CartOverlay.jsx
- ✅ Introduce Zustand for shared state
- ✅ Refactor prop drilling to use store

**Success Criteria:**
- Container components managing child components
- State management working smoothly
- No prop drilling beyond 2 levels
- Cart operations working end-to-end

---

### **Phase 4: Complex Components (Week 5-6)**
- ✅ Convert Login.vue → Login.jsx
- ✅ Convert CategoryList.vue → CategoryList.jsx
- ✅ Set up drag-and-drop library
- ✅ Start AdminPortal conversion (largest component)

**Success Criteria:**
- Authentication flow working
- Admin features functional
- Drag-and-drop working
- No regressions in existing features

---

### **Phase 5: Main App & Cleanup (Week 7-8)**
- ✅ Convert App.vue → App.jsx (final boss)
- ✅ Remove Vue dependencies
- ✅ Remove @vitejs/plugin-vue
- ✅ Full regression testing
- ✅ Performance optimization
- ✅ Documentation updates

**Success Criteria:**
- 100% React codebase
- All features working
- Performance benchmarks met
- Mobile responsive verified
- Production deployment successful

---

## 🧪 Testing Strategy

### **Unit Tests**
- Use Vitest (already in ecosystem, works with Vite)
- Test components in isolation
- Test custom hooks
- Aim for 80%+ coverage on new React components

### **Integration Tests**
- Use React Testing Library
- Test user interactions
- Test form submissions
- Test API calls (mock with MSW)

### **E2E Tests**
- Use existing Playwright tests
- Update selectors as components migrate
- Keep tests green throughout migration

---

## 📦 New Dependencies to Add

### **Core**
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@vitejs/plugin-react": "^4.2.0"
}
```

### **State Management**
```json
{
  "zustand": "^4.5.0"
}
```

### **Drag & Drop**
```json
{
  "@dnd-kit/core": "^6.1.0",
  "@dnd-kit/sortable": "^8.0.0",
  "@dnd-kit/utilities": "^3.2.2"
}
```

### **Forms (Optional)**
```json
{
  "react-hook-form": "^7.50.0",
  "zod": "^3.22.0"
}
```

### **Testing**
```json
{
  "@testing-library/react": "^14.1.0",
  "@testing-library/jest-dom": "^6.1.0",
  "@testing-library/user-event": "^14.5.0",
  "vitest": "^1.2.0"
}
```

### **TypeScript (Recommended)**
```json
{
  "typescript": "^5.3.0",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0"
}
```

---

## ⚡ Performance Considerations

### **Bundle Size**
- **Vue 3:** ~34KB (runtime + compiler)
- **React 18:** ~42KB (react + react-dom)
- **Net change:** +8KB (acceptable)

### **Optimization Strategies**
- Use React.memo for expensive components
- Use useMemo/useCallback to prevent re-renders
- Code splitting with React.lazy + Suspense
- Keep Vite's tree-shaking and minification

---

## 🎓 Learning Resources for Team

### **Official Docs**
- React Docs (new beta docs): react.dev
- Zustand: docs.pmnd.rs/zustand
- React Testing Library: testing-library.com/react

### **Migration Guides**
- Vue to React Cheatsheet
- Thinking in React (official guide)
- Common Vue patterns in React

### **Video Courses**
- Epic React by Kent C. Dodds
- React for Vue Developers

---

## 🚨 Risks & Mitigation Summary

| Risk | Severity | Mitigation |
|------|----------|------------|
| Breaking production | 🔴 HIGH | Incremental migration, feature flags, rollback plan |
| State management complexity | 🔴 HIGH | Start simple (props), introduce Zustand gradually |
| Drag-and-drop library | 🔴 HIGH | POC early, allocate extra time for AdminPortal |
| Team learning curve | 🟡 MEDIUM | Training sessions, pair programming, code reviews |
| CSS scoping issues | 🟡 MEDIUM | CSS Modules, strict naming conventions |
| Performance regression | 🟡 MEDIUM | Benchmark before/after, use React DevTools Profiler |
| Timeline overrun | 🟡 MEDIUM | Buffer time in each phase, prioritize ruthlessly |

---

## ✅ Success Metrics

### **Technical**
- [ ] All 12 components converted to React
- [ ] Zero Vue dependencies remaining
- [ ] Test coverage ≥80%
- [ ] Bundle size increase <15%
- [ ] Lighthouse score maintained (90+)
- [ ] No console errors/warnings

### **Business**
- [ ] Zero downtime during migration
- [ ] No feature regressions
- [ ] Mobile experience unchanged
- [ ] Admin portal fully functional
- [ ] User feedback positive

### **Team**
- [ ] All developers comfortable with React
- [ ] Documentation complete
- [ ] Code review process established
- [ ] CI/CD pipeline updated

---

## 🎯 Why This Strategy Works

### **Bottom-Up Benefits**
1. **Low Risk:** Start with simple, isolated components
2. **Quick Wins:** See results in Week 1
3. **Learning Curve:** Master patterns before complexity
4. **Interoperability:** Prove Vue ↔ React works early
5. **Rollback:** Easy to revert if issues arise

### **Incremental Benefits**
1. **No Big Bang:** Continuous delivery, no freeze
2. **User Impact:** Zero disruption to end users
3. **Testing:** Each component tested thoroughly
4. **Confidence:** Build momentum with each success
5. **Flexibility:** Adjust strategy based on learnings

---

## 📝 Next Steps (Immediate Actions)

1. **Get approval** for migration strategy
2. **Set up React** in Vite config (30 min)
3. **Create React folder** structure (15 min)
4. **Convert ProductCard** as POC (4 hours)
5. **Demo to team** and gather feedback (1 hour)
6. **Refine strategy** based on learnings
7. **Proceed to Phase 1** full execution

---

**Document Owner:** DJ  
**Last Updated:** March 22, 2026  
**Status:** Draft - Awaiting Approval  
**Estimated Timeline:** 8 weeks (2 months)  
**Estimated Effort:** 1 developer full-time or 2 developers part-time
