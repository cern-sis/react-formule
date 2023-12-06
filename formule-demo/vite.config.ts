import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {},
  },
  server: {
    // Needed for cypress to be able to access the dev server
    host: true,
    port: 3030,
  },
  // Enables hmr in development without having to rebuild the library
  resolve: {
    alias: {
      "react-formule": resolve(__dirname, '../src/index.ts'),
    }
  }
})
