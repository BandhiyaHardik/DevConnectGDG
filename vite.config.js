import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Load environment variables with React's naming convention
// This makes process.env.REACT_APP_* work in Vite
function reactEnvPlugin() {
  return {
    name: 'react-env',
    config(_, { command }) {
      const env = {};
      
      // Read all environment variables and filter for REACT_APP_ prefix
      Object.keys(process.env).forEach(key => {
        if (key.startsWith('REACT_APP_')) {
          env[`process.env.${key}`] = JSON.stringify(process.env[key]);
        }
      });
      
      return {
        define: env
      };
    }
  };
}

export default defineConfig({
  plugins: [react(), reactEnvPlugin()],
  server: {
    port: 3000,
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  },
  cacheDir: 'D:/vite-cache',
  esbuild: {
    jsx: 'automatic'
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    },
    include: ['prop-types'],
    exclude: [
      'firebase',
      'firebase/app', 
      'firebase/auth',
      'firebase/firestore',
      'firebase/storage',
      'react-router-dom',
      'hoist-non-react-statics'
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      'prop-types': 'prop-types/index.js'
    }
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
      defaultIsModuleExports: true
    }
  }
})