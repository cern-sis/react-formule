import PropTypes from "prop-types";
import ObjectFieldTemplate from "./templates/ObjectFieldTemplate";
import ArrayFieldTemplate from "./templates/ArrayFieldTemplates";
import FieldTemplate from "./templates/Field/FieldTemplate";
import CAPFields from "./fields";
import CAPWidgets from "./widgets";

import objectPath from "object-path";

import "./Form.less";
import { Form } from "@rjsf/antd";
import validator from "@rjsf/validator-ajv8";
import CustomizationContext from "../contexts/CustomizationContext";
import { useContext } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "../store/configureStore";
import { updateFormData } from "../store/schemaWizard";

const RJSFForm = ({
  formRef,
  schema,
  uiSchema,
  formData,
  extraErrors,
  onChange,
  formContext,
  readonly,
  className,
  ObjectFieldTemplate: Objects,
  ArrayFieldTemplate: Arrays,
  FieldTemplate: Fields,
  fields,
  widgets,
  validate,
  tagName,
  liveValidate = false,
  showErrorList = false,
}) => {

  const customizationContext = useContext(CustomizationContext)
  
  const dispatch = useDispatch()

  // mainly this is used for the drafts forms
  // we want to allow forms to be saved even without required fields
  // if these fields are not filled in when publishing then an error will be shown
  const transformErrors = errors => {
    errors = errors
      .filter(item => item.name != "required")
      .map(error => {
        if (error.name == "required") return null;

        // Update messages for undefined fields when required,
        // from "should be string" ==> "Either edit or remove"
        if (error.message == "should be string") {
          let errorMessages = objectPath.get(formData, error.property);
          if (errorMessages == undefined)
            error.message = "Either edit or remove";
        }

        return error;
      });

    return errors;
  };

  const handleChange = (change) => {
    onChange && onChange(change)
    dispatch(updateFormData({ value: change.formData }))
  }

  const templates = {
    FieldTemplate: Fields || FieldTemplate,
    ArrayFieldTemplate: Arrays || ArrayFieldTemplate,
    ObjectFieldTemplate: Objects || ObjectFieldTemplate,
  };

  return (
    <Provider store={store}>
      <Form
        className={["__Form__", className].join(" ")}
        ref={formRef}
        schema={schema}
        uiSchema={uiSchema}
        tagName={tagName}
        formData={formData}
        fields={{ ...CAPFields, ...customizationContext.customFields, ...fields }}
        widgets={{ ...CAPWidgets, ...customizationContext.customWidgets, ...widgets }}
        templates={templates}
        liveValidate={liveValidate}
        showErrorList={showErrorList}
        noHtml5Validate={true}
        onError={() => {}}
        onBlur={() => {}}
        customValidate={validate}
        validator={validator}
        extraErrors={extraErrors}
        onChange={handleChange}
        readonly={readonly}
        transformErrors={transformErrors}
        formContext={{
          formRef: formRef,
          ...formContext,
        }}
      >
        <span />
      </Form>
    </Provider>
  );
};

RJSFForm.propTypes = {
  formRef: PropTypes.object,
  currentUser: PropTypes.object,
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  formData: PropTypes.object,
  extraErrors: PropTypes.object,
  onChange: PropTypes.func,
  validate: PropTypes.func,
  formContext: PropTypes.object,
  widgets: PropTypes.object,
  mode: PropTypes.string,
  draftEditor: PropTypes.bool,
  readonly: PropTypes.bool,
  className: PropTypes.string,
  liveValidate: PropTypes.bool,
  showErrorList: PropTypes.bool,
  FieldTemplate: PropTypes.node,
  ObjectFieldTemplate: PropTypes.node,
  ArrayFieldTemplate: PropTypes.node,
};

export default RJSFForm;
