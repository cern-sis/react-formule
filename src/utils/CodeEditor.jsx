import { EditorView, keymap } from "@codemirror/view";
import { linter, lintGutter } from "@codemirror/lint";
import { indentWithTab } from "@codemirror/commands";
import CodeViewer from "./CodeViewer";

const CodeEditor = ({
  value,
  lang,
  lint,
  isReadOnly = false,
  handleEdit,
  schema,
  height,
  extraExtensions,
  reset,
  minimal,
}) => {
  const editorExtensions = [
    keymap.of([indentWithTab]),
    lint ? [linter(lint()), lintGutter()] : [],
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        handleEdit(update.state.doc.toString());
      }
    }),
    ...extraExtensions,
  ];

  return (
    <CodeViewer
      value={value}
      lang={lang}
      isReadOnly={isReadOnly}
      extraExtensions={editorExtensions}
      schema={schema}
      height={height}
      listener={handleEdit}
      reset={reset}
      minimal={minimal}
    />
  );
};

export default CodeEditor;
