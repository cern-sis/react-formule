import viteConfig from "./vite.config"
import { spawn } from "child_process";

const postBuildCommandsPlugin = {
  name: "postbuild-commands",
  closeBundle: () => {
    // Call yalc push after a build finishes
    spawn("yalc", ["push"], { stdio: "inherit" })
  },
};

if (viteConfig.build?.lib) {
  // Build only the ES bundle to speed up development builds
  viteConfig.build.lib["formats"] = ["es"]
  viteConfig.plugins?.push(postBuildCommandsPlugin)
}

export default viteConfig
