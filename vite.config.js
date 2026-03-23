import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  publicDir: false, // Don't copy public folder during build (Express already serves it)
  build: {
    outDir: 'public',
    emptyOutDir: false, // Don't delete existing files in public/
    rollupOptions: {
      input: './index.html'
    }
  },
  server: {
    middlewareMode: false,
    proxy: {
      '/api': 'http://localhost:5001'
    }
  }
})
