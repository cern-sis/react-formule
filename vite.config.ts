import { defineConfig } from "vite";
import { defineConfig as defineTestConfig } from "vitest/config";
import { resolve } from "path";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
const config = defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
    cssInjectedByJsPlugin(),
    visualizer({
      filename: "bundle-stats.html",
      gzipSize: true,
    }),
  ],

  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Formule",
      fileName: "react-formule",
    },
    rollupOptions: {
      // externalize deps that shouldn't be bundled into the library
      external: ["react", "react-dom", "./docs"],
    },
  },
});

const testConfig = defineTestConfig({
  test: {
    globals: true,
    environment: "happy-dom",
  },
});

export default { ...config, ...testConfig };
