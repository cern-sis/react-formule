import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { basicSetup, minimalSetup } from "codemirror";
import { EditorState, Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { theme } from "antd";
import { updateSchema, jsonSchema } from "codemirror-json-schema";
import { CODEMIRROR_LANGUAGES } from ".";

type CodeViewerProps = {
  value: string;
  lang?: string;
  isEditable?: boolean;
  isReadOnly?: boolean;
  extraExtensions?: Extension[];
  height?: string;
  schema?: object;
  reset?: boolean;
  minimal?: boolean;
  validationSchema?: object;
};

const CodeViewer = ({
  value,
  lang,
  isEditable = false,
  isReadOnly,
  extraExtensions = [],
  height,
  schema,
  reset,
  minimal,
  validationSchema,
}: CodeViewerProps) => {
  const editorRef = useRef() as MutableRefObject<HTMLDivElement>;

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
      lang && lang in CODEMIRROR_LANGUAGES ? CODEMIRROR_LANGUAGES[lang] : [],
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
        scrollTo: EditorView.scrollIntoView(0),
      });
      updateSchema(editor, validationSchema);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, schema, reset, validationSchema]);

  return <div style={{ height }} ref={editorRef} />;
};

export default CodeViewer;
