import federation from "@originjs/vite-plugin-federation";
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

import path from 'path'; // Import path module

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    base: '/',
    plugins: [
      react(),
      cssInjectedByJsPlugin(),
      federation({
        name: "root",
        filename: "remoteEntry.js",
        exposes: {
          "./App": "./src/App.tsx",
        },
        shared: ["react", "react-dom", "react-router-dom"],
      }),
    ],
    build: {
      modulePreload: false,
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
    },
    server: {
      cors: true,
    },
    preview: {
      cors: true,
    },
    resolve: {
      alias: {
      },
    },
  };
});
