import { MutableRefObject, useEffect, useRef } from "react";
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { MergeView } from "@codemirror/merge";
import { CODEMIRROR_LANGUAGES } from ".";

type CodeDiffViewerProps = {
  left: string;
  right: string;
  lang?: string;
  height?: string;
};

const CodeDiffViewer = ({ left, right, lang, height }: CodeDiffViewerProps) => {
  const editorRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    editorRef.current.innerHTML = "";

    const extensions = [
      basicSetup,
      EditorState.readOnly.of(true),
      EditorView.theme({
        "&": {
          width: "100%",
          height: "100%",
        },
      }),
      lang && lang in CODEMIRROR_LANGUAGES ? CODEMIRROR_LANGUAGES[lang] : [],
    ];

    const leftExtensions = [
      EditorView.theme({
        ".cm-changedLine": {
          "background-color": "#ffeded !important",
        },
        ".cm-changedText": {
          "background-color": "#ffbaba !important",
        },
      }),
    ];

    const rightExtensions = [
      EditorView.theme({
        ".cm-changedLine": {
          "background-color": "#e8fbe8 !important",
        },
        ".cm-changedText": {
          "background-color": "#a6f1a6 !important",
        },
      }),
    ];

    new MergeView({
      a: {
        doc: left,
        extensions: [...extensions, ...leftExtensions],
      },
      b: {
        doc: right,
        extensions: [...extensions, ...rightExtensions],
      },
      parent: editorRef.current,
      collapseUnchanged: {},
    });
  }, [lang, left, right]);

  return <div style={{ height }} ref={editorRef} />;
};

export default CodeDiffViewer;
