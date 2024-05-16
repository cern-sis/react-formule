export default {
  extends: ["@commitlint/config-conventional"],
  // Skip for semantic-release automatic commits
  ignores: [(message) => /^chore\(release\):.*\[skip ci\]/.test(message)],
};
