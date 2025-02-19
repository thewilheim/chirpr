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
    host: "0.0.0.0", // Listen on all network interfaces
  },
  server: {
    port: 5173,
    strictPort: true,
    host: "0.0.0.0", // Ensure it binds to all IPs
    cors: true, // Enable CORS to allow external domains
    origin: "https://www.chirpr.au", // Explicitly allow requests from your domain
  },
});
