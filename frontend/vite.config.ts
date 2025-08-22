// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './components'),
      '@utils': resolve(__dirname, './utils'),
      '@types': resolve(__dirname, './types'),
      '@styles': resolve(__dirname, './styles')
    }
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          charts: ['chart.js', 'react-chartjs-2', 'recharts'],
          forms: ['react-hook-form', 'react-day-picker'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: 4173,
    host: true
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  }
})
