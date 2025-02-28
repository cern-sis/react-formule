import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { execSync } from "child_process";

const version = execSync("npm show react-formule version").toString().trim();

// https://vitejs.dev/config/
export default defineConfig({
  base: "/react-formule",
  plugins: [svgr(), react()],
  define: {
    "process.env": {},
    "import.meta.env.REACT_FORMULE_VERSION": JSON.stringify(version),
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
  optimizeDeps: {
    // Pre-bundle to avoid styling issues with native rjsf components
    include: ["@rjsf/antd"],
  },
});
