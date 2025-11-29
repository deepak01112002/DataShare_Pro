import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Plugin to ignore API folder
const ignoreApiPlugin = (): Plugin => {
  return {
    name: 'ignore-api',
    enforce: 'pre',
    resolveId(id, importer) {
      // Ignore any imports from API folder
      if (id.includes('/api/') || id.startsWith('api/') || (importer && importer.includes('/api/'))) {
        return { id: 'virtual:api-ignore', external: true };
      }
      return null;
    },
    load(id) {
      // Don't load API files
      if (id.includes('/api/') || id.startsWith('api/')) {
        return 'export {}';
      }
      return null;
    },
    buildStart() {
      // Explicitly ignore API folder during build
      this.addWatchFile = () => {};
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      // Deny access to API folder
      deny: [path.resolve(__dirname, 'api')],
    },
    // Proxy API requests to Vercel dev server (if running)
    // For full API functionality, use: npm run dev:full
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // If Vercel dev server is not running, return 404
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            console.warn('API proxy error - make sure to run "npm run dev:full" for full functionality');
            if (res && !res.headersSent) {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'API server not running. Use "npm run dev:full" to start Vercel dev server.' }));
            }
          });
        },
      },
    },
  },
  plugins: [
    react(), 
    ignoreApiPlugin(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Exclude API files and server-side dependencies from Vite bundling
        if (id.includes('/api/') || id.startsWith('api/') || id.includes('\\api\\')) {
          return true;
        }
        // Exclude server-side packages that shouldn't be bundled
        if (['mongodb', '@vercel/node'].includes(id)) {
          return true;
        }
        return false;
      },
    },
  },
  optimizeDeps: {
    exclude: ['mongodb', '@vercel/node'],
  },
}));
