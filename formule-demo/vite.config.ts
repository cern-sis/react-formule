import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/react-formule",
  plugins: [react()],
  define: {
    "process.env": {},
  },
  server: {
    // Needed for cypress to be able to access the dev server
    host: true,
    port: 3030,
  },
  // FIXME: remove after we change the squirrelly import
  // see https://github.com/squirrellyjs/squirrelly/issues/240#issuecomment-1816104837
  build: {
    commonjsOptions: { transformMixedEsModules: true },
  },
});
