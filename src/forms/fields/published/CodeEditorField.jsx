import CodeViewer from "../../../utils/CodeViewer";

const CodeEditorField = ({ uiSchema, formData }) => {
  const uiOptions = uiSchema["ui:options"];

  return (
    <CodeViewer value={formData} reset lang={uiOptions.language} isReadOnly />
  );
};

export default CodeEditorField;
