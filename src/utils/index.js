export const stringToHslColor = (str, s, l) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let h = hash % 360;
  return "hsl(" + h + ", " + s + "%, " + l + "%)";
};

export const findParentPath = (schemaPath) => {
  let isObj;
  for (let i = schemaPath.length - 1; i >= 0; i--) {
    // If we find a properties, it means we're inside an object (and not an array)
    if (schemaPath[i] === "properties") {
      isObj = true;
    } else if (isObj) {
      return schemaPath.slice(0, i + 1);
    } else {
      isObj = false;
    }
  }
  return [];
};
