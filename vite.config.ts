import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// BASE_PATH is set by the GitHub Pages workflow ("/<repo-name>/" for a project
// site, "/" when a custom domain / CNAME is in use). Local dev always uses "/".
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2019',
  },
  server: {
    host: true,
    port: 5173,
  },
});
