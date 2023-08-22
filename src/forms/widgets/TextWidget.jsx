import { useState } from "react";
import MaskedInput from "./MaskedInput";
import { InputNumber } from "antd";
import PropTypes from "prop-types";
import { isRegExp } from "lodash-es";

const INPUT_STYLE = {
  width: "100%",
};

const TextWidget = ({
  disabled,
  formContext,
  id,
  onBlur,
  onChange,
  onFocus,
  options,
  placeholder,
  readonly,
  schema,
  value,
}) => {
  const { readonlyAsDisabled = true } = formContext;

  const { convertToUppercase, mask } = options;

  const handleNumberChange = nextValue => onChange(nextValue);

  const handleTextChange = ({ target }) => {
    apiCalledWithCurrentState && setApiCalledWithCurrentState(false);
    message && setMessage(null);
    onChange(
      target.value === ""
        ? options.emptyValue
        : convertToUppercase
        ? target.value.toUpperCase()
        : target.value
    );
  };

  const handleBlur = ({ target }) => onBlur(id, target.value);

  const handleFocus = ({ target }) => onFocus(id, target.value);

  const [message, setMessage] = useState(null);

  const [apiCalledWithCurrentState, setApiCalledWithCurrentState] =
    useState(false);

  return schema.type === "number" || schema.type === "integer" ? (
    <InputNumber
      disabled={disabled || (readonlyAsDisabled && readonly)}
      id={id}
      name={id}
      onBlur={!readonly ? handleBlur : undefined}
      onChange={!readonly ? handleNumberChange : undefined}
      onFocus={!readonly ? handleFocus : undefined}
      placeholder={placeholder}
      style={INPUT_STYLE}
      type="number"
      value={value}
    />
  ) : (
    <MaskedInput
      disabled={disabled || (readonlyAsDisabled && readonly)}
      id={id}
      name={id}
      onChange={!readonly ? handleTextChange : undefined}
      onFocus={!readonly ? handleFocus : undefined}
      placeholder={placeholder}
      value={value}
      pattern={isRegExp(schema.pattern) ? schema.pattern : undefined}
      mask={mask}
      convertToUppercase={convertToUppercase}
      message={message}
    />
  );
};

TextWidget.propTypes = {
  disabled: PropTypes.bool,
  formContext: PropTypes.object,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  readonly: PropTypes.bool,
  schema: PropTypes.object,
  formData: PropTypes.object,
  value: PropTypes.string,
  options: PropTypes.object,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
};

export default TextWidget;
