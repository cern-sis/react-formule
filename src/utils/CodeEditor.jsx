import { EditorView, keymap } from "@codemirror/view";
import { linter, lintGutter } from "@codemirror/lint";
import { indentWithTab } from "@codemirror/commands";
import CodeViewer from "./CodeViewer";

const CodeEditor = ({
  initialValue,
  lang,
  lint,
  isEditable = true,
  isReadOnly,
  handleEdit,
  schema,
  height,
  extraExtensions = [],
  reset,
  minimal,
  validationSchema,
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
      value={initialValue}
      lang={lang}
      isEditable={isEditable}
      isReadOnly={isReadOnly}
      extraExtensions={editorExtensions}
      schema={schema}
      height={height}
      listener={handleEdit}
      reset={reset}
      minimal={minimal}
      validationSchema={validationSchema}
    />
  );
};

export default CodeEditor;
