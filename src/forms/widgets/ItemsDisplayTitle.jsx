import { StreamLanguage } from "@codemirror/language";
import CodeEditor from "../../utils/CodeEditor";
import { jinja2 } from "@codemirror/legacy-modes/mode/jinja2";
import { placeholder } from "@codemirror/view";

// TODO: Remove this component once https://github.com/cern-sis/react-formule/issues/21
// is implemented and use that general CodeEditor directly from fieldTypes.jsx
const ItemsDisplayTitle = ({ onChange, value }) => {
  return (
    <div style={{ height: "200px" }}>
      <CodeEditor
        height="100%"
        value={value}
        handleEdit={() => onChange(value)}
        extraExtensions={[
          StreamLanguage.define(jinja2),
          placeholder("Path: {{item_123}} - Type: {{item_456}}"),
        ]}
        minimal
      />
    </div>
  );
};

export default ItemsDisplayTitle;
