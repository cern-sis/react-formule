import { useEffect, useMemo, useRef } from "react";
import { basicSetup, minimalSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { theme } from "antd";
import { updateSchema, jsonSchema } from "codemirror-json-schema";
import { StreamLanguage } from "@codemirror/language";
import { jinja2 } from "@codemirror/legacy-modes/mode/jinja2";
import { json } from "@codemirror/lang-json";
import { stex } from "@codemirror/legacy-modes/mode/stex";

const LANGUAGES = {
  json: json(),
  jinja: StreamLanguage.define(jinja2),
  stex: StreamLanguage.define(stex),
};

const CodeViewer = ({
  value,
  lang,
  isEditable = true,
  isReadOnly,
  extraExtensions = [],
  height,
  schema,
  reset,
  minimal,
  validationSchema,
}) => {
  const editorRef = useRef(null);

  const { token } = theme.useToken();

  const extensions = useMemo(
    () => [
      minimal ? minimalSetup : basicSetup,
      // This looks bizarre but it makes sense
      EditorState.readOnly.of(!isEditable),
      EditorView.editable.of(!isReadOnly),
      EditorView.theme({
        "&": {
          width: "100%",
          height: "100%",
          border: `1px solid ${token.colorBorder}`,
          backgroundColor: "white",
        },
        "&.cm-focused": {
          outline: "none",
          borderColor: token.colorPrimary,
        },
      }),
      lang && lang in LANGUAGES ? LANGUAGES[lang] : [],
      ...extraExtensions,
      validationSchema ? jsonSchema() : [],
    ],
    [
      extraExtensions,
      isEditable,
      isReadOnly,
      lang,
      minimal,
      token,
      validationSchema,
    ],
  );

  useEffect(() => {
    if (reset) {
      // Needed for cap schema viewer
      editorRef.current.innerHTML = "";
    }
    if (editorRef.current && editorRef.current.children.length < 1) {
      const editor = new EditorView({
        state: EditorState.create({
          doc: value,
          extensions: extensions,
        }),
        parent: editorRef.current,
      });
      updateSchema(editor, validationSchema);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, schema, reset, validationSchema]);

  return <div style={{ height }} ref={editorRef} />;
};

export default CodeViewer;
