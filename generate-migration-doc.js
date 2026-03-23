const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, LevelFormat, PageBreak
} = require('docx');
const fs = require('fs');

const RED = 'C0392B';
const DARK = '1A1A18';
const GREY = '5A5750';
const LIGHT_GREY = 'F5F4F0';
const MID_GREY = 'E2DDD8';
const WHITE = 'FFFFFF';
const GREEN = '2D7A4F';
const GREEN_BG = 'EDF6F1';

const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: MID_GREY };
const allBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, font: 'Arial', size: 32, bold: true, color: RED })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, font: 'Arial', size: 26, bold: true, color: DARK })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 },
    children: [new TextRun({ text, font: 'Arial', size: 22, bold: true, color: GREY })],
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, font: 'Arial', size: 22, color: DARK, ...opts })],
  });
}

function bullet(text, boldPart = '') {
  const runs = [];
  if (boldPart) {
    runs.push(new TextRun({ text: boldPart + ' ', font: 'Arial', size: 22, bold: true, color: DARK }));
    runs.push(new TextRun({ text, font: 'Arial', size: 22, color: DARK }));
  } else {
    runs.push(new TextRun({ text, font: 'Arial', size: 22, color: DARK }));
  }
  return new Paragraph({
    numbering: { reference: 'bullet-list', level: 0 },
    spacing: { before: 40, after: 40 },
    children: runs,
  });
}

function subbullet(text) {
  return new Paragraph({
    numbering: { reference: 'bullet-list', level: 1 },
    spacing: { before: 20, after: 20 },
    children: [new TextRun({ text, font: 'Arial', size: 20, color: GREY })],
  });
}

function divider() {
  return new Paragraph({
    spacing: { before: 160, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: MID_GREY } },
    children: [],
  });
}

function spacer(size = 120) {
  return new Paragraph({ spacing: { before: size, after: 0 }, children: [] });
}

function makeTable(headers, rows, colWidths) {
  const headerCells = headers.map((h, i) =>
    new TableCell({
      borders: allBorders,
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { fill: RED, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: h, font: 'Arial', size: 20, bold: true, color: WHITE })] })],
    })
  );

  const dataRows = rows.map((row, ri) =>
    new TableRow({
      children: row.map((cell, ci) =>
        new TableCell({
          borders: allBorders,
          width: { size: colWidths[ci], type: WidthType.DXA },
          shading: { fill: ri % 2 === 0 ? WHITE : LIGHT_GREY, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: cell, font: 'Arial', size: 20, color: DARK })] })],
        })
      ),
    })
  );

  return new Table({
    width: { size: colWidths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [new TableRow({ children: headerCells, tableHeader: true }), ...dataRows],
  });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'bullet-list',
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: '\u2022',
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
          {
            level: 1,
            format: LevelFormat.BULLET,
            text: '\u25E6',
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } },
          },
        ],
      },
    ],
  },
  styles: {
    default: { document: { run: { font: 'Arial', size: 22, color: DARK } } },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: 'Arial', color: RED },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, font: 'Arial', color: DARK },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 },
      },
      {
        id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 22, bold: true, font: 'Arial', color: GREY },
        paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 2 },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'DR Prepper Wholesale Portal', font: 'Arial', size: 18, color: GREY }),
                new TextRun({ text: '   |   Vue 3 → React 18 Migration Plan', font: 'Arial', size: 18, color: MID_GREY }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'Confidential  |  Branch: raphael-martinez-branch  |  Page ', font: 'Arial', size: 16, color: GREY }),
                new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 16, color: GREY }),
                new TextRun({ text: ' of ', font: 'Arial', size: 16, color: GREY }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Arial', size: 16, color: GREY }),
              ],
            }),
          ],
        }),
      },
      children: [

        // ── COVER ──────────────────────────────────────────────────
        spacer(480),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 80 },
          children: [new TextRun({ text: 'DR Prepper', font: 'Arial', size: 64, bold: true, color: RED })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 80 },
          children: [new TextRun({ text: 'Wholesale Ordering Portal', font: 'Arial', size: 36, bold: false, color: DARK })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 80, after: 80 },
          children: [new TextRun({ text: 'Vue 3  →  React 18', font: 'Arial', size: 48, bold: true, color: DARK })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 20, after: 20 },
          children: [new TextRun({ text: 'Frontend Migration Plan', font: 'Arial', size: 28, color: GREY })],
        }),
        spacer(240),
        new Table({
          width: { size: 5040, type: WidthType.DXA },
          columnWidths: [2160, 2880],
          rows: [
            ...([
              ['Author', 'Raphael Martinez'],
              ['Branch', 'raphael-martinez-branch'],
              ['Base', 'master'],
              ['Repository', 'crynxmartinez/dr-prepper---assignment'],
              ['Date', 'March 23, 2026'],
              ['Status', 'Draft — Migration in Progress'],
            ].map(([label, value], i) => new TableRow({
              children: [
                new TableCell({
                  borders: allBorders,
                  width: { size: 2160, type: WidthType.DXA },
                  shading: { fill: LIGHT_GREY, type: ShadingType.CLEAR },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text: label, font: 'Arial', size: 20, bold: true, color: GREY })] })],
                }),
                new TableCell({
                  borders: allBorders,
                  width: { size: 2880, type: WidthType.DXA },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text: value, font: 'Arial', size: 20, color: DARK })] })],
                }),
              ],
            }))),
          ],
        }),

        // ── PAGE BREAK ─────────────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),

        // ── 1. OVERVIEW ────────────────────────────────────────────
        h1('1. Overview'),
        body('This document describes the complete plan for migrating the DR Prepper B2B Wholesale Ordering Portal frontend from Vue 3 (Options API) to React 18. The Express/Prisma backend, all API endpoints, database schema, and environment configuration remain completely untouched throughout this migration.'),
        spacer(),
        body('The portal is a B2B wholesale ordering system used by buyers to browse products, manage a cart, place orders, track order history, and manage their account. An admin panel provides product management, customer management, bulk editing, and activity logs.'),
        spacer(),

        h2('1.1 Scope'),
        bullet('Frontend source files: all src/**/*.vue → src/**/*.jsx'),
        bullet('Build configuration: vite.config.js plugin swap only'),
        bullet('Dependency changes: remove Vue packages, add React packages'),
        bullet('State management: App.vue God Component → React Context + useReducer'),
        bullet('Drag and drop: vue-draggable-next → @dnd-kit/sortable'),
        spacer(),

        h2('1.2 Out of Scope'),
        bullet('server.js — Express backend (no changes)'),
        bullet('prisma/ — database schema and seed scripts (no changes)'),
        bullet('All /api/ endpoints (no changes)'),
        bullet('.env configuration (no changes)'),
        bullet('public/ static assets and uploaded product images (no changes)'),
        bullet('SQL migration files in sql/ (no changes)'),

        divider(),

        // ── 2. CURRENT ARCHITECTURE ────────────────────────────────
        h1('2. Current Architecture (Vue 3)'),

        h2('2.1 Technology Stack'),
        makeTable(
          ['Layer', 'Technology', 'Version'],
          [
            ['Frontend Framework', 'Vue 3 (Options API)', '^3.3.0'],
            ['Build Tool', 'Vite', '^5.0.0'],
            ['Backend', 'Express.js', '^4.18.2'],
            ['Database ORM', 'Prisma', '^5.22.0'],
            ['Database', 'PostgreSQL', 'latest'],
            ['Auth', 'JWT (jsonwebtoken)', '^9.0.3'],
            ['File Uploads', 'Multer', '^2.1.1'],
            ['Drag & Drop', 'vue-draggable-next', '^2.3.0'],
          ],
          [3120, 3120, 3120]
        ),
        spacer(160),

        h2('2.2 Frontend Structure'),
        body('The frontend has no router and no state management library. All application state lives in a single App.vue "God Component" which passes data to child components via props and receives updates via custom events ($emit).'),
        spacer(),
        bullet('No vue-router — navigation uses an activePage state variable and conditional rendering'),
        bullet('No Vuex/Pinia — all state managed in App.vue data() and computed properties'),
        bullet('13 single-file components (.vue) with co-located template, script, and style'),
        bullet('All CSS is custom vanilla CSS (no Tailwind) — fully reusable in React'),

        h2('2.3 Component Inventory'),
        makeTable(
          ['Component', 'Role', 'Complexity'],
          [
            ['App.vue', 'Main shell, global state, nav, all page layout', 'High'],
            ['Login.vue', 'Auth form, password reset request', 'Medium'],
            ['AdminPortal.vue', 'Admin suite container with drag-and-drop', 'High'],
            ['AdminDashboard.vue', 'Stats, metrics, activity logs', 'Medium'],
            ['BulkEditView.vue', 'Rapid bulk inventory editor', 'Medium'],
            ['ProductGrid.vue', 'Product grid display with scale control', 'Medium'],
            ['ProductCard.vue', 'Single product card with cart/fav actions', 'Low'],
            ['CategoryList.vue', 'Hierarchical category tree sidebar', 'Medium'],
            ['CategorySidebar.vue', 'Sidebar wrapper for CategoryList', 'Low'],
            ['CategoryView.vue', 'Products grouped by category', 'Medium'],
            ['CartItem.vue', 'Individual cart line item', 'Low'],
            ['CartOverlay.vue', 'Mobile cart slide-up overlay', 'Low'],
            ['OrderConfirmModal.vue', 'Order placement confirmation dialog', 'Low'],
          ],
          [2880, 4320, 2160]
        ),

        divider(),

        // ── 3. TARGET ARCHITECTURE ─────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        h1('3. Target Architecture (React 18)'),

        h2('3.1 Technology Stack'),
        makeTable(
          ['Layer', 'Technology', 'Notes'],
          [
            ['Frontend Framework', 'React 18', 'Hooks-based, functional components'],
            ['Build Tool', 'Vite (unchanged)', 'Swap @vitejs/plugin-vue → @vitejs/plugin-react'],
            ['State Management', 'React Context + useReducer', 'No Redux — mirrors existing pattern'],
            ['Drag & Drop', '@dnd-kit/sortable', 'Replaces vue-draggable-next'],
            ['Component Format', '.jsx files', 'Plain JavaScript, no TypeScript'],
            ['CSS', 'src/index.css', 'All existing CSS reused as-is'],
          ],
          [3120, 3120, 3120]
        ),
        spacer(160),

        h2('3.2 State Architecture'),
        body('The centralized state from App.vue is preserved but restructured into React primitives:'),
        spacer(),
        bullet('AppContext.jsx — provides global state (auth, cart, products, favorites, orders, UI state)'),
        bullet('useReducer for complex state transitions (cart operations, auth, page navigation)'),
        bullet('Custom hooks extract domain logic: useAuth.js, useCart.js'),
        bullet('All fetch calls to /api/ remain identical — only the calling mechanism changes'),

        h2('3.3 File Mapping'),
        makeTable(
          ['Vue File', 'React File', 'Migration Type'],
          [
            ['src/main.js', 'src/main.jsx', 'createApp → createRoot'],
            ['src/App.vue', 'src/App.jsx', 'State → Context, template → JSX'],
            ['src/components/Login.vue', 'src/components/Login.jsx', 'Direct 1:1'],
            ['src/components/ProductCard.vue', 'src/components/ProductCard.jsx', 'Direct 1:1'],
            ['src/components/ProductGrid.vue', 'src/components/ProductGrid.jsx', 'Direct 1:1'],
            ['src/components/CategoryList.vue', 'src/components/CategoryList.jsx', 'Direct 1:1'],
            ['src/components/CategorySidebar.vue', 'src/components/CategorySidebar.jsx', 'Direct 1:1'],
            ['src/components/CategoryView.vue', 'src/components/CategoryView.jsx', 'Direct 1:1'],
            ['src/components/CartItem.vue', 'src/components/CartItem.jsx', 'Direct 1:1'],
            ['src/components/CartOverlay.vue', 'src/components/CartOverlay.jsx', 'Direct 1:1'],
            ['src/components/OrderConfirmModal.vue', 'src/components/OrderConfirmModal.jsx', 'Direct 1:1'],
            ['src/components/AdminPortal.vue', 'src/components/AdminPortal.jsx', 'Swap drag library'],
            ['src/components/AdminDashboard.vue', 'src/components/AdminDashboard.jsx', 'Direct 1:1'],
            ['src/components/BulkEditView.vue', 'src/components/BulkEditView.jsx', 'Direct 1:1'],
            ['(new)', 'src/context/AppContext.jsx', 'Global state provider'],
            ['(new)', 'src/hooks/useAuth.js', 'Auth logic extracted'],
            ['(new)', 'src/hooks/useCart.js', 'Cart logic extracted'],
          ],
          [3120, 3120, 3120]
        ),

        divider(),

        // ── 4. DEPENDENCY CHANGES ──────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        h1('4. Dependency Changes'),

        h2('4.1 Remove'),
        makeTable(
          ['Package', 'Reason'],
          [
            ['vue', 'Replaced by React'],
            ['@vitejs/plugin-vue', 'Replaced by @vitejs/plugin-react'],
            ['vue-draggable-next', 'Replaced by @dnd-kit/sortable'],
          ],
          [4680, 4680]
        ),
        spacer(160),

        h2('4.2 Add'),
        makeTable(
          ['Package', 'Purpose'],
          [
            ['react', 'Core React library'],
            ['react-dom', 'DOM rendering (createRoot)'],
            ['@vitejs/plugin-react', 'Vite plugin for JSX/React Fast Refresh'],
            ['@dnd-kit/core', 'Drag and drop core primitives'],
            ['@dnd-kit/sortable', 'Sortable list abstraction'],
            ['@dnd-kit/utilities', 'DnD utility helpers'],
          ],
          [4680, 4680]
        ),
        spacer(160),

        h2('4.3 Unchanged'),
        bullet('express, prisma, @prisma/client, pg — backend unchanged'),
        bullet('bcrypt, jsonwebtoken, multer, nodemailer — backend unchanged'),
        bullet('vite — only plugin config changes'),
        bullet('All devDependencies except the Vue plugin'),

        divider(),

        // ── 5. SYNTAX TRANSLATION ──────────────────────────────────
        h1('5. Vue → React Syntax Translation Reference'),

        makeTable(
          ['Vue 3 (Options API)', 'React 18 Equivalent'],
          [
            ['data() { return { x } }', 'const [x, setX] = useState(...)'],
            ['computed: { y() { ... } }', 'const y = useMemo(() => ..., [deps])'],
            ['methods: { fn() { ... } }', 'function fn() { ... }'],
            ['mounted() { ... }', "useEffect(() => { ... }, [])"],
            ['v-if="cond"', '{cond && <Component />}'],
            ['v-for="item in list"', '{list.map(item => <Comp key={item.id} />)}'],
            ['v-model="val"', 'value={val} onChange={e => setVal(e.target.value)}'],
            ['v-model.number="val"', 'value={val} onChange={e => setVal(Number(e.target.value))}'],
            ['@click="fn"', 'onClick={fn}'],
            [':class="[\'a\', { b: cond }]"', 'className={`a${cond ? \' b\' : \'\'}`}'],
            [':style="{ color: x }"', 'style={{ color: x }}'],
            ["$emit('event', data)", 'Pass onEvent={fn} as prop, call fn(data)'],
            ['@click.stop', 'onClick={e => { e.stopPropagation(); fn() }}'],
            ['v-if + v-else', 'cond ? <A /> : <B />'],
          ],
          [4680, 4680]
        ),

        divider(),

        // ── 6. MIGRATION PHASES ────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        h1('6. Migration Phases'),

        h2('Phase 1 — Project Setup'),
        bullet('Remove Vue devDependencies from package.json'),
        bullet('Add React and @dnd-kit dependencies'),
        bullet('Update vite.config.js: swap vue() plugin → react() plugin'),
        bullet('Update index.html entry point: main.js → main.jsx'),

        spacer(),
        h2('Phase 2 — Global State (Context)'),
        bullet('Create src/context/AppContext.jsx with all state from App.vue data()'),
        subbullet('isLoggedIn, userRole, activePage, products, categories'),
        subbullet('cartItems, favorites, orders, selectedProduct, viewMode'),
        subbullet('UI state: sidebarOpen, productSheetOpen, toastVisible, etc.'),
        bullet('Implement useReducer for cart and auth state transitions'),
        bullet('Create src/hooks/useAuth.js — handleLogin, signOut, loadProfile'),
        bullet('Create src/hooks/useCart.js — addToCart, removeFromCart, clearCart, submitOrder'),

        spacer(),
        h2('Phase 3 — Entry Point + App Shell'),
        bullet('Rewrite src/main.jsx — ReactDOM.createRoot with AppProvider wrapper'),
        bullet('Rewrite src/App.jsx — consume AppContext, JSX layout, conditional rendering'),
        bullet('Move <style> block from App.vue → src/index.css'),
        bullet('Translate all Vue template directives to JSX equivalents'),
        bullet('Translate computed properties → useMemo'),
        bullet('Translate mounted() → useEffect with empty dependency array'),

        spacer(),
        h2('Phase 4 — Customer-Facing Components'),
        body('Migrate in dependency order (leaf components first):'),
        bullet('Login.jsx — form state with useState, fetch calls unchanged'),
        bullet('ProductCard.jsx — props-driven, no internal state'),
        bullet('CartItem.jsx — props-driven display component'),
        bullet('ProductGrid.jsx — maps products array to ProductCard'),
        bullet('CategoryList.jsx — recursive category tree'),
        bullet('CategorySidebar.jsx — wraps CategoryList'),
        bullet('CategoryView.jsx — products grouped by category'),
        bullet('CartOverlay.jsx — mobile slide-up cart modal'),
        bullet('OrderConfirmModal.jsx — order confirmation dialog'),

        spacer(),
        h2('Phase 5 — Admin Components'),
        bullet('AdminDashboard.jsx — stats and metrics display'),
        bullet('BulkEditView.jsx — table with inline editing via useState'),
        bullet('AdminPortal.jsx — replace vue-draggable-next with @dnd-kit/sortable'),
        subbullet('Wrap sortable lists in <DndContext> + <SortableContext>'),
        subbullet('Use useSortable hook per item'),

        spacer(),
        h2('Phase 6 — Cleanup & Validation'),
        bullet('Delete all *.vue files from src/'),
        bullet('Delete src/main.js'),
        bullet('Run npm run build — verify Vite compiles with zero errors'),
        bullet('Smoke-test all user flows end-to-end'),

        divider(),

        // ── 7. DEFINITION OF DONE ──────────────────────────────────
        h1('7. Definition of Done'),

        makeTable(
          ['Checkpoint', 'Verification'],
          [
            ['npm run build succeeds', 'Zero errors, output in public/'],
            ['No .vue files remain in src/', 'Directory listing confirms'],
            ['Login / logout flow works', 'JWT stored in localStorage, role-based view'],
            ['Product catalog loads and filters', 'Category sidebar, search, grid/category view'],
            ['Cart add / remove / place order', 'End-to-end order creation via /api/orders'],
            ['Favorites toggle persists', 'POST/DELETE /api/favorites works'],
            ['Admin panel loads', 'AdminPortal renders for admin role'],
            ['Drag-and-drop reordering works', '@dnd-kit sortable list functional'],
            ['Mobile responsive layout unchanged', 'Bottom nav, cart overlay, sidebar on mobile'],
            ['Backend server.js unchanged', 'Git diff confirms zero backend changes'],
          ],
          [4680, 4680]
        ),

        divider(),

        // ── 8. BRANCH INFO ─────────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        h1('8. Branch Information'),

        makeTable(
          ['Field', 'Value'],
          [
            ['Branch Name', 'raphael-martinez-branch'],
            ['Author', 'Raphael Martinez'],
            ['Base Branch', 'master'],
            ['Repository', 'https://github.com/crynxmartinez/dr-prepper---assignment'],
            ['Organization Repo', 'https://github.com/drprepperusa-org/dpu-wholesale-prepper'],
            ['PR Status', 'Draft — migration in progress'],
            ['Migration Type', 'Frontend only (Vue 3 → React 18)'],
          ],
          [3120, 6240]
        ),
        spacer(160),

        body('This branch is a fork contribution targeting the drprepperusa-org organization repository. The branch will be submitted as a Draft Pull Request once the migration implementation is complete.'),

      ],
    },
  ],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('DR-Prepper-React-Migration-Plan.docx', buffer);
  console.log('Done: DR-Prepper-React-Migration-Plan.docx');
});
