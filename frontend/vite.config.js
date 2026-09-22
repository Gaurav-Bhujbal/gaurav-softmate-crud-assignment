import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Pin PostCSS to this project so Vite doesn't walk up and pick up an
  // unrelated postcss.config.js from a parent folder. This app uses plain CSS.
  css: { postcss: { plugins: [] } },
})
