import { Renderer, parseInline } from "marked";
import sanitize from "sanitize-html";

let renderer = new Renderer();
renderer.link = function (href, title, text) {
  return (
    '<a target="_blank" href="' +
    href +
    '" title="' +
    title +
    '">' +
    text +
    "</a>"
  );
};
renderer.heading = function (text) {
  return text;
};

export const markedInput = (title) =>
  parseInline(title, {
    renderer: renderer,
  });

export const sanitizedInput = (input) =>
  sanitize(input, {
    allowedTags: ["b", "em", "strong", "a", "span", "code"],
    allowedAttributes: {
      a: ["href", "target", "title"],
    },
  });
