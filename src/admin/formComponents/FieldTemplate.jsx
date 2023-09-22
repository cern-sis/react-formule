import { useState } from "react";
import PropTypes from "prop-types";
import HoverBox from "./HoverBox";
import SchemaTreeItem from "./SchemaTreeItem";
import Form from "../../forms/Form";
import ArrayFieldTemplate from "./ArrayFieldTemplate";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import { useDispatch } from "react-redux";
import { isItTheArrayField, _validate } from "../utils/index";
import DropArea from "./DropArea";
import { addByPath } from "../../store/schemaWizard";

const FieldTemplate = props => {
  const {
    schema,
    uiSchema = {},
    rawErrors = [],
    children,
    formContext,
    id,
  } = props;

  const dispatch = useDispatch()

  const [display, setDisplay] = useState(false);

  let path = {
    schema: [
      ...formContext.schema,
      ...(rawErrors.find(e => typeof e === "object").schema || []),
    ],
    uiSchema: [
      ...formContext.uiSchema,
      ...(rawErrors.find(e => typeof e === "object").uiSchema || []),
    ],
  };

  const shouldBoxHideChildren = uiSchema => {
    return uiSchema["ui:field"] !== undefined;
  };

  // The content of a JSON Object field is also considered a 'root'
  if (id == "root" && !formContext.nestedForm) {
    const inside = (
      <div
        style={{
          padding: formContext.schema.length == 0 ? "10px" : "none",
        }}
      >
        {children}
        <DropArea />
      </div>
    );
    if (formContext.schema.length == 0) {
      return (
        <HoverBox
          allowsChildren
          addProperty={(path, value) => dispatch(addByPath({path, value}))}
          key={id}
          path={path}
          shouldHideChildren={shouldBoxHideChildren(uiSchema)}
        >
          {inside}
        </HoverBox>
      );
    }
    return inside;
  }

  let _renderObjectArray = undefined;

  if (isItTheArrayField(schema, uiSchema)) {
    _renderObjectArray = <div>{children}</div>;
  } else if (["object"].indexOf(schema.type) > -1) {
    _renderObjectArray = (
      <div>
        <SchemaTreeItem
          type="object"
          {...props}
          path={path}
          display={display}
          updateDisplay={() => setDisplay(!display)}
        />
        {display ? (
          <div style={{ marginLeft: "10px" }}>
            <Form
              schema={schema}
              uiSchema={uiSchema}
              formData={{}}
              FieldTemplate={FieldTemplate}
              ObjectFieldTemplate={ObjectFieldTemplate}
              ArrayFieldTemplate={ArrayFieldTemplate}
              liveValidate={true}
              validate={_validate}
              formContext={path}
              onChange={() => {}}
            >
              <span />
            </Form>
          </div>
        ) : null}
      </div>
    );
  }

  if (_renderObjectArray) {
    return (
      // The HoverBox wrapper here is needed to allow dropping items into objects
      // or arrays directly without having to expand them first
      <HoverBox
        addProperty={(path, value) => dispatch(addByPath({path, value}))}
        key={id}
        path={path}
        shouldHideChildren={shouldBoxHideChildren(uiSchema)}
      >
        {_renderObjectArray}
      </HoverBox>
    );
  }

  return <SchemaTreeItem {...props} path={path} />;
};

FieldTemplate.propTypes = {
  id: PropTypes.string,
  children: PropTypes.element,
  formContext: PropTypes.object,
  rawErrors: PropTypes.array,
  uiSchema: PropTypes.object,
  schema: PropTypes.object,
};

export default FieldTemplate
