import { resolve } from "path";
import viteConfig from "./vite.config.ts";

// Enables hmr in development without having to rebuild the library
// and without having to yarn link anything
viteConfig.resolve = {
  alias: {
    "react-formule": resolve(__dirname, "../src/index.ts"),
  },
  dedupe: ["react", "react-dom"],
};
viteConfig.base = undefined;

export default viteConfig;
