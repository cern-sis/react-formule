import viteConfig from "./vite.config";

if (viteConfig.build) {
  viteConfig.build.emptyOutDir = false;

  if (viteConfig.build.lib) {
    // Build only the ES bundle to speed up development builds
    viteConfig.build.lib["formats"] = ["es"];
  }
}

export default viteConfig;
