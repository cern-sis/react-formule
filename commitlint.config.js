import * as rules from "@commitlint/rules";

export default {
  extends: ["@commitlint/config-conventional"],
  plugins: [
    {
      rules: {
        // Excludes markdown links from body max length calculation
        // (needed for semantic-release automatic commits)
        "body-max-length": (parsed, _when, _value) => {
          parsed.header = parsed.header.replace(/\[([^[\]]+)\]\(([^)]+)\)/, "");
          return rules.default["body-max-length"](parsed, _when, _value);
        },
      },
    },
  ],
};
