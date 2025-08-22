// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
// import { visualizer } from 'rollup-plugin-visualizer'
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [
      react(),
      splitVendorChunkPlugin(),
      // Bundle analyzer for production builds - disabled due to dependency issues
      // isProduction && visualizer({
      //   filename: 'dist/stats.html',
      //   open: false,
      //   gzipSize: true,
      //   brotliSize: true,
      // }),
      // PWA support disabled - install vite-plugin-pwa to enable
      // VitePWA({
      //   registerType: 'autoUpdate',
      //   workbox: {
      //     globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      //     runtimeCaching: [
      //       {
      //         urlPattern: /^https:\/\/api\./,
      //         handler: 'NetworkFirst',
      //         options: {
      //           cacheName: 'api-cache',
      //           expiration: {
      //             maxEntries: 100,
      //             maxAgeSeconds: 60 * 60 * 24, // 24 hours
      //           },
      //         },
      //       },
      //       {
      //         urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/,
      //         handler: 'CacheFirst',
      //         options: {
      //           cacheName: 'image-cache',
      //           expiration: {
      //             maxEntries: 200,
      //             maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      //           },
      //         },
      //       },
      //     ],
      //   },
      //   manifest: {
      //     name: 'Forestry Compliance Application',
      //     short_name: 'ForestryApp',
      //     description: 'Comprehensive forestry compliance and management application',
      //     theme_color: '#2D5016',
      //     background_color: '#ffffff',
      //     display: 'standalone',
      //     icons: [
      //       {
      //         src: '/icon-192.png',
      //         sizes: '192x192',
      //         type: 'image/png',
      //       },
      //       {
      //         src: '/icon-512.png',
      //         sizes: '512x512',
      //         type: 'image/png',
      //       },
      //     ],
      //   },
      // }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './'),
        '@components': resolve(__dirname, './components'),
        '@utils': resolve(__dirname, './utils'),
        '@styles': resolve(__dirname, './styles'),
        '@types': resolve(__dirname, './types'),
      },
    },
    build: {
      target: 'es2015', // Support older browsers
      outDir: 'dist',
      sourcemap: !isProduction, // Only generate sourcemaps in development
      minify: isProduction ? 'terser' : false,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          // Optimize chunk splitting
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              if (id.includes('@radix-ui')) {
                return 'radix-vendor';
              }
              if (id.includes('chart.js') || id.includes('react-chartjs-2') || id.includes('recharts')) {
                return 'chart-vendor';
              }
              if (id.includes('react-hook-form') || id.includes('zod')) {
                return 'form-vendor';
              }
              if (id.includes('class-variance-authority') || id.includes('clsx') || id.includes('tailwind-merge') || id.includes('lucide-react')) {
                return 'ui-vendor';
              }
              if (id.includes('cmdk') || id.includes('embla-carousel-react') || id.includes('vaul')) {
                return 'utils-vendor';
              }
              return 'vendor';
            }
          },
          // Optimize asset naming
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
              : 'chunk'
            return `js/[name]-[hash].js`
          },
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || []
            const ext = info[info.length - 1]
            if (/\.(css)$/.test(assetInfo.name || '')) {
              return `css/[name]-[hash].[ext]`
            }
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name || '')) {
              return `images/[name]-[hash].[ext]`
            }
            if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name || '')) {
              return `fonts/[name]-[hash].[ext]`
            }
            return `assets/[name]-[hash].[ext]`
          },
        },
        external: isProduction ? [] : ['sonner@2.0.3', 'next-themes@0.4.6'],
      },
      // Optimize terser configuration
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        mangle: {
          safari10: true,
        },
      } : undefined,
      // Optimize chunk size warnings
      chunkSizeWarningLimit: 1000,
    },
    // Optimize development server
    server: {
      port: 3000,
      host: true,
      open: true,
    },
    // Optimize preview server
    preview: {
      port: 4173,
      host: true,
    },
    // Optimize CSS
    css: {
      devSourcemap: !isProduction,
    },
    // Environment variables
    define: {
      'process.env': {},
      __dirname: JSON.stringify(''),
      // Add build-time constants
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __BUILD_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    },
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-hook-form',
        'zod',
        'lucide-react',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
      ],
      exclude: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
    },
    // Performance optimizations
    esbuild: {
      target: 'es2015',
      supported: {
        'top-level-await': true,
      },
    },
  }
})
