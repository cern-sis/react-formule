import { useEffect, useMemo, useRef } from "react";
import { basicSetup, minimalSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { theme } from "antd";

const CodeViewer = ({
  value,
  lang,
  isReadOnly = true,
  extraExtensions = [],
  height,
  schema,
  reset,
  minimal,
}) => {
  const editorRef = useRef(null);

  const { token } = theme.useToken();

  const extensions = useMemo(
    () => [
      minimal ? minimalSetup : basicSetup,
      EditorState.readOnly.of(isReadOnly),
      EditorView.theme({
        "&": {
          width: "100%",
          height: "100%",
          border: `1px solid ${token.colorBorder}`,
        },
        "&.cm-focused": {
          outline: "none",
          borderColor: token.colorPrimary,
        },
      }),
      lang ? lang() : [],
      ...extraExtensions,
    ],
    [extraExtensions, isReadOnly, lang, minimal, token],
  );

  useEffect(() => {
    if (reset) {
      // Needed for cap schema viewer
      editorRef.current.innerHTML = "";
    }
    if (editorRef.current && editorRef.current.children.length < 1) {
      new EditorView({
        state: EditorState.create({
          doc: value,
          extensions: extensions,
        }),
        parent: editorRef.current,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, schema, reset]);

  return <div style={{ height }} ref={editorRef} />;
};

export default CodeViewer;
