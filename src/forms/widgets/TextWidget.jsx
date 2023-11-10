import { useState } from "react";
import MaskedInput from "./MaskedInput";
import { Button, InputNumber } from "antd";
import PropTypes from "prop-types";
import { isRegExp } from "lodash-es";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateFormData } from "../../store/schemaWizard";
import { set, cloneDeep } from "lodash-es";

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

  const { autofill_from, autofill_on, convertToUppercase, mask } = options;

  const [message, setMessage] = useState(null);
  const [apiCalledWithCurrentState, setApiCalledWithCurrentState] =
    useState(false);
  const [apiCalling, setApiCalling] = useState(false);

  const formData = useSelector((state) => state.schemaWizard.formData);

  const dispatch = useDispatch();

  const handleNumberChange = (nextValue) => onChange(nextValue);

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

  const _replace_hash_with_current_indexes = (path) => {
    let indexes = id.split("_").filter((item) => !isNaN(item)),
      index_cnt = 0;

    return path.map((item) => {
      item = item === "#" ? indexes[index_cnt] : item;
      if (!isNaN(item)) ++index_cnt;
      return item;
    });
  };

  const autoFillOtherFields = (event) => {
    let newFormData = cloneDeep(formData);
    const url = options.autofill_from;
    const fieldsMap = options.autofill_fields;

    if (
      !event.target.value ||
      (value === event.target.value && apiCalledWithCurrentState)
    )
      return;

    fieldsMap.map((el) => {
      let destination = _replace_hash_with_current_indexes(el[1]);
      set(newFormData, destination, undefined);
    });
    dispatch(updateFormData({ value: newFormData }));
    // We need to deep clone again after this dispatch since for some reason 
    // redux/immer mark the object passed as argument to the reducer as readonly
    newFormData = cloneDeep(newFormData);

    setApiCalling(true);
    setApiCalledWithCurrentState(true);
    setMessage(null);
    axios
      .get(`${url}${event.target.value}`)
      .then(({ data }) => {
        if (Object.keys(data).length !== 0) {
          fieldsMap.map((el) => {
            let destination = _replace_hash_with_current_indexes(el[1]);
            set(newFormData, destination, data[el[0]]);
          });
          dispatch(updateFormData({ value: newFormData }));
          setApiCalling(false);
          setMessage({
            status: "success",
            message: "Navigate to the next tab to review the fetched values.",
          });
        } else {
          setApiCalling(false);
          setMessage({
            status: "error",
            message: "Results not found",
          });
        }
      })
      .catch((err) => {
        setApiCalling(false);
        setMessage({
          status: "error",
          message:
            err.response.status !== 500
              ? err.response.data && err.response.data.message
                ? err.response.data.message
                : "Your request was not successful, please try again "
              : "Something went wrong with the request ",
        });
      });
  };

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
      onBlur={
        !readonly
          ? autofill_from &&
            (!autofill_on || (autofill_on && autofill_on.includes("onBlur")))
            ? autoFillOtherFields
            : handleBlur
          : undefined
      }
      onPressEnter={
        !readonly
          ? (!autofill_on ||
              (autofill_on && autofill_on.includes("onEnter"))) &&
            autoFillOtherFields
          : undefined
      }
      onChange={!readonly ? handleTextChange : undefined}
      onFocus={!readonly ? handleFocus : undefined}
      placeholder={placeholder}
      value={value}
      pattern={isRegExp(schema.pattern) ? schema.pattern : undefined}
      mask={mask}
      convertToUppercase={convertToUppercase}
      message={message}
      buttons={
        autofill_from &&
        autofill_on &&
        autofill_on.includes("onClick") &&
        (enabled => (
          <Button
            type="primary"
            disabled={!enabled || readonly}
            loading={apiCalling}
            onClick={() => autoFillOtherFields({ target: { value: value } })}
          >
            AutoFill
          </Button>
        ))
      }
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
