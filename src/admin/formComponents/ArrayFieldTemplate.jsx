import { useState } from "react";
import PropTypes from "prop-types";
import SchemaTreeItem from "./SchemaTreeItem";
import Form from "../../forms/Form";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import FieldTemplate from "./FieldTemplate";
import { _validate } from "../utils";
import DropArea from "./DropArea";

const ArrayFieldTemplate = (props) => {
  const { rawErrors, registry, schema, uiSchema } = props;
  const { formContext } = registry;

  const [display, setDisplay] = useState(false);

  let schemaPath = [];
  let uiSchemaPath = [];
  if (rawErrors) {
    let _rawErrors = rawErrors.filter((i) => (i.schema ? i : false));
    let { schema, uiSchema } = _rawErrors[0];
    schemaPath = schema;
    uiSchemaPath = uiSchema;
  }

  let _path = {
    schema: [formContext.schema, ...schemaPath, "items"],
    uiSchema: [formContext.uiSchema, ...uiSchemaPath, "items"],
  };

  let __path = {
    schema: [formContext.schema, ...schemaPath],
    uiSchema: [formContext.uiSchema, ...uiSchemaPath],
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
          {Object.keys(schema.items).length == 0 ? (
            <DropArea />
          ) : (
            <>
              <Form
                schema={schema.items}
                uiSchema={uiSchema.items}
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
              {!schema.items.properties && <DropArea />}
            </>
          )}
        </div>
      )}
    </div>
  );
};

ArrayFieldTemplate.propTypes = {
  rawErrors: PropTypes.array,
  registry: PropTypes.object,
  addProperty: PropTypes.func,
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  id: PropTypes.string,
};

export default ArrayFieldTemplate;
