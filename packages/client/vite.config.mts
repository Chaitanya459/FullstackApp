import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
// @ts-expect-error There are issues with the types for this package
import eslint from 'vite-plugin-eslint';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';

const build_dir = process.env.BUILD_PATH || `build`;

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  build: {
    outDir: build_dir,
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      devOptions: {
        enabled: true,
        navigateFallback: `index.html`,
        suppressWarnings: true,
        type: `module`,
      },
      injectRegister: false,

      manifest: {
        description: `Your app description`,
        icons: [
          {
            sizes: `192x192`,
            src: `icon-192x192.png`,
            type: `image/png`,
          },
          {
            sizes: `512x512`,
            src: `icon-512x512.png`,
            type: `image/png`,
          },
        ],
        name: `Your App Name`,
        short_name: `App`,
        theme_color: `#ffffff`,
      },

      pwaAssets: {
        config: true,
        disabled: false,
      },
      registerType: `autoUpdate`,

      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        globPatterns: [ `**/*.{js,css,html,woff,woff2,eot,ttf,otf,svg,png,ico,webmanifest,json}` ],
        navigateFallback: `index.html`,
        navigateFallbackDenylist: [ /^\/api\// ],
        runtimeCaching: [
          // ✅ GET requests (normal caching)
          {
            handler: `NetworkFirst`,
            options: {
              cacheName: `api-cache`,
              expiration: {
                maxAgeSeconds: 24 * 60 * 60,
                maxEntries: 50,
              },
            },
            urlPattern: /^\/api\//,
          },
          // ✅ POST/PUT/DELETE with background sync
          {
            handler: `NetworkOnly`,
            method: `POST`,
            options: {
              backgroundSync: {
                name: `post-queue`,
                options: {
                  maxRetentionTime: 24 * 60, // Retry for up to 24 hours
                },
              },
            },
            urlPattern: /^\/api\//,
          },
          {
            handler: `NetworkOnly`,
            method: `PUT`,
            options: {
              backgroundSync: {
                name: `put-queue`,
                options: {
                  maxRetentionTime: 24 * 60,
                },
              },
            },
            urlPattern: /^\/api\//,
          },
          {
            handler: `NetworkOnly`,
            method: `DELETE`,
            options: {
              backgroundSync: {
                name: `delete-queue`,
                options: {
                  maxRetentionTime: 24 * 60,
                },
              },
            },
            urlPattern: /^\/api\//,
          },
        ],
      },
    }),
    viteTsconfigPaths(),
    svgrPlugin(),
    eslint({
      failOnError: command === `build`,
      failOnWarning: command === `build`,
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, `./src`),
    },
  },
  server: {
    open: true,
    port: 4003,
    proxy: {
      '/api': {
        changeOrigin: true,
        target: `http://localhost:28960`,
      },
    },
  },
}));
