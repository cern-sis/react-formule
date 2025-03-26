import PropTypes from "prop-types";
import ObjectFieldTemplate from "./templates/ObjectFieldTemplate";
import ArrayFieldTemplate from "./templates/ArrayFieldTemplates";
import FieldTemplate from "./templates/Field/FieldTemplate";
import CAPFields from "./fields/base";
import CAPWidgets from "./widgets/base";
import PublishedFields from "./fields/published";
import PublishedWidgets from "./widgets/published";

import "./Form.less";
import { Form } from "@rjsf/antd";
import validator from "@rjsf/validator-ajv8";
import CustomizationContext from "../contexts/CustomizationContext";
import { useContext } from "react";
import { Provider } from "react-redux";
import store from "../store/configureStore";
import FormErrorBoundary from "./FormErrorBoundary";

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
  transformErrors,
  hideAnchors,
  isPublished,
}) => {
  const customizationContext = useContext(CustomizationContext);

  const templates = {
    FieldTemplate: Fields || FieldTemplate,
    ArrayFieldTemplate: Arrays || ArrayFieldTemplate,
    ObjectFieldTemplate: Objects || ObjectFieldTemplate,
  };

  const ErrorBoundary = customizationContext.errorBoundary || FormErrorBoundary;

  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Form
          className={["__Form__", className].join(" ")}
          ref={formRef}
          schema={schema}
          uiSchema={uiSchema}
          tagName={tagName}
          formData={formData}
          fields={{
            ...CAPFields,
            ...customizationContext.customFields,
            ...fields,
            ...(isPublished && PublishedFields),
            ...(isPublished && customizationContext.customPublishedFields),
          }}
          widgets={{
            ...CAPWidgets,
            ...customizationContext.customWidgets,
            ...widgets,
            ...(isPublished && PublishedWidgets),
            ...(isPublished && customizationContext.customPublishedWidgets),
          }}
          templates={templates}
          liveValidate={liveValidate}
          showErrorList={showErrorList}
          noHtml5Validate={true}
          onError={() => {}}
          onBlur={() => {}}
          customValidate={validate}
          validator={validator}
          extraErrors={extraErrors}
          onChange={onChange}
          readonly={readonly || isPublished}
          transformErrors={transformErrors}
          formContext={{
            formRef,
            ...formContext,
            hideAnchors,
          }}
          idSeparator={customizationContext.separator}
        >
          <span />
        </Form>
      </ErrorBoundary>
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
  readonly: PropTypes.bool,
  className: PropTypes.string,
  liveValidate: PropTypes.bool,
  showErrorList: PropTypes.bool,
  FieldTemplate: PropTypes.node,
  ObjectFieldTemplate: PropTypes.node,
  ArrayFieldTemplate: PropTypes.node,
  hideAnchors: PropTypes.bool,
  transformErrors: PropTypes.func,
  isPublished: PropTypes.bool,
};

export default RJSFForm;
