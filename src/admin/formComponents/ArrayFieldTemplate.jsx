import { useContext, useState } from "react";
import PropTypes from "prop-types";
import SchemaTreeItem from "./SchemaTreeItem";
import Form from "../../forms/Form";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import FieldTemplate from "./FieldTemplate";
import { _validate } from "../utils";
import DropArea from "./DropArea";
import CustomizationContext from "../../contexts/CustomizationContext";

const ArrayFieldTemplate = (props) => {
  const [display, setDisplay] = useState(false);

  const customizationContext = useContext(CustomizationContext);

  let schemaPath = [];
  let uiSchemaPath = [];
  if (props.rawErrors) {
    let _rawErrors = props.rawErrors.filter((i) => (i.schema ? i : false));
    let { schema, uiSchema } = _rawErrors[0];
    schemaPath = schema;
    uiSchemaPath = uiSchema;
  }

  let _path = {
    schema: [...props.formContext.schema, ...schemaPath, "items"],
    uiSchema: [...props.formContext.uiSchema, ...uiSchemaPath, "items"],
  };

  let __path = {
    schema: [...props.formContext.schema, ...schemaPath],
    uiSchema: [...props.formContext.uiSchema, ...uiSchemaPath],
  };

  return (
    <div>
      <SchemaTreeItem
        type="array"
        {...props}
        path={__path}
        display={display}
        updateDisplay={() => setDisplay(!display)}
      />

      {display && (
        <div style={{ marginLeft: "10px" }}>
          {Object.keys(props.schema.items).length == 0 &&
          customizationContext.dnd ? (
            <DropArea />
          ) : (
            <Form
              schema={props.schema.items}
              uiSchema={props.uiSchema.items}
              formData={{}}
              tagName="div"
              showErrorList={false}
              FieldTemplate={FieldTemplate}
              ObjectFieldTemplate={ObjectFieldTemplate}
              ArrayFieldTemplate={ArrayFieldTemplate}
              liveValidate={true}
              validate={_validate}
              noHtml5Validate={true}
              onChange={() => {}}
              formContext={{ ..._path, nestedForm: true }}
            >
              <span />
            </Form>
          )}
        </div>
      )}
    </div>
  );
};

ArrayFieldTemplate.propTypes = {
  rawErrors: PropTypes.array,
  formContext: PropTypes.object,
  addProperty: PropTypes.func,
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  id: PropTypes.string,
};

export default ArrayFieldTemplate;
