// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
  build: {
    rollupOptions: {
      external: ['sonner@2.0.3', 'next-themes@0.4.6', '@radix-ui/react-checkbox@1.1.4'],
    },
  },
  define: {
    'process.env': {},
    __dirname: JSON.stringify(''),
  },
})
