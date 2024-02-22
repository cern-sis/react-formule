import { resolve } from "path";
import viteConfig from "./vite.config.ts";

// Enables hmr in development without having to rebuild the library
viteConfig.resolve = {
  alias: {
    "react-formule": resolve(__dirname, "../src/index.ts"),
  },
};
viteConfig.base = undefined;

export default viteConfig;
