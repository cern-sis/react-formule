import { EditorView, keymap } from "@codemirror/view";
import { linter, lintGutter } from "@codemirror/lint";
import { indentWithTab } from "@codemirror/commands";
import CodeViewer from "./CodeViewer";
import { CODEMIRROR_LINTERS } from ".";

type CodeEditorProps = {
  initialValue: string;
  lang?: string;
  lint?: string;
  isEditable?: boolean;
  isReadOnly?: boolean;
  handleEdit: (value: string) => void;
  schema?: object;
  height?: string;
  extraExtensions?: [];
  reset?: boolean;
  minimal?: boolean;
  validationSchema?: object;
};

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
}: CodeEditorProps) => {
  const editorExtensions = [
    keymap.of([indentWithTab]),
    lint && lint in CODEMIRROR_LINTERS
      ? [linter(CODEMIRROR_LINTERS[lint]), lintGutter()]
      : [],
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
      reset={reset}
      minimal={minimal}
      validationSchema={validationSchema}
    />
  );
};

export default CodeEditor;
