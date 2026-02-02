import {
  updateSchemaByPath,
  updateUiSchemaByPath,
} from "../../store/schemaWizard";
import { useDispatch } from "react-redux";
import CodeEditor from "../../utils/CodeEditor";

const SchemaCodeEditor = ({
  valueType = "json",
  value = "",
  height = "320px",
  lang = "json",
  isReadOnly = true,
}) => {
  const dispatch = useDispatch();

  const _onSchemaChange = (data) => {
    dispatch(updateSchemaByPath({ path: [], value: JSON.parse(data) }));
  };

  const _onUiSchemaChange = (data) => {
    dispatch(updateUiSchemaByPath({ path: [], value: JSON.parse(data) }));
  };

  const _handleEdit = (data) => {
    if (valueType == "schema") _onSchemaChange(data);
    else if (valueType == "uiSchema") _onUiSchemaChange(data);
  };

  return (
    <CodeEditor
      lint
      lang={lang}
      isEditable={!isReadOnly}
      initialValue={value}
      schema
      height={height}
      handleEdit={_handleEdit}
    />
  );
};

export default SchemaCodeEditor;
