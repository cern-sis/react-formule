import { json, jsonParseLinter } from "@codemirror/lang-json";
import { StreamLanguage } from "@codemirror/language";
import { jinja2 } from "@codemirror/legacy-modes/mode/jinja2";
import { stex } from "@codemirror/legacy-modes/mode/stex";

export const URL_REGEX =
  "https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)";

export const CODEMIRROR_LANGUAGES = {
  json: json(),
  jinja: StreamLanguage.define(jinja2),
  stex: StreamLanguage.define(stex),
};

export const CODEMIRROR_LINTERS = {
  json: jsonParseLinter(),
};

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
