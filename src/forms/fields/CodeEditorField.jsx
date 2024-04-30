import CodeEditor from "../../utils/CodeEditor";
import axios from "axios";
import { useEffect, useState } from "react";
import { Typography } from "antd";
import { debounce } from "lodash-es";
import { URL_REGEX } from "../../utils";

const CodeEditorField = ({
  formData,
  onChange,
  schema,
  uiSchema,
  readonly,
}) => {
  const { validateWith, validateWithUrl, validateWithJson } = schema;
  const uiOptions = uiSchema["ui:options"];
  const {
    language = uiOptions.codeEditor?.language,
    height = uiOptions.codeEditor?.height,
    codeEditor,
  } = uiOptions || {};

  const [initialValue] = useState(formData);

  const [error, setError] = useState();

  const [validationSchema, setValidationSchema] = useState();

  const handleUrlError = () => {
    setValidationSchema();
    setError("Error querying validation schema URL");
  };

  useEffect(() => {
    setError();
    if (validateWith === "url" && validateWithUrl) {
      const fetchSchema = debounce(() => {
        axios
          .get(validateWithUrl)
          .then((response) => {
            setValidationSchema(response.data);
          })
          .catch(() => {
            handleUrlError();
          });
      }, 2000);
      if (new RegExp(URL_REGEX).test(validateWithUrl)) {
        fetchSchema();
      } else {
        handleUrlError();
      }
      return () => {
        // Cleaning up the debounce when validateWithUrl changes
        fetchSchema.cancel();
      };
    } else if (validateWith === "json" && validateWithJson) {
      const parsed = (() => {
        try {
          return JSON.parse(validateWithJson);
        } catch {
          setError("Error parsing validation JSON");
          return;
        }
      }).call();
      setValidationSchema(parsed);
    } else {
      setValidationSchema();
    }
  }, [validateWith, validateWithUrl, validateWithJson]);

  return (
    <>
      <CodeEditor
        // Key needed to refresh the component on settings change due to the custom logic in CodeViewer
        key={`${language}${readonly}${validationSchema}`}
        isReadOnly={readonly}
        height={height}
        initialValue={initialValue}
        handleEdit={(v) => onChange(v)}
        reset
        lang={!validationSchema && language}
        validationSchema={!readonly && validationSchema}
        {...codeEditor}
      />
      <Typography.Text type="danger" data-cy="codeEditorFieldError">
        {error}
      </Typography.Text>
    </>
  );
};

export default CodeEditorField;
