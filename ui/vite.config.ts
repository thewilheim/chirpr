/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
  },
  base: "/",
  preview: {
    port: 5173,
    strictPort: true,
    host: true
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true
   },
})
