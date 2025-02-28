import { diff } from "just-diff";

export const generatePatches = (currentSchema, suggestionSchema) => {
  if (currentSchema && suggestionSchema) {
    return diff(currentSchema, suggestionSchema);
  }
  return [];
};
