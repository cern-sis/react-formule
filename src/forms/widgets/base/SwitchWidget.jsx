import { Switch } from "antd";

const SwitchWidget = ({
  autofocus,
  disabled,
  formContext,
  id,
  label,
  onBlur,
  onChange,
  onFocus,
  readonly,
  value,
  schema,
  options,
}) => {
  const { readonlyAsDisabled = true } = formContext;
  const { checkedLabel, uncheckedLabel, bgColor } = options;

  const handleChange = (checked) => {
    if (schema.type === "string") {
      onChange(String(checked));
    } else if (schema.type === "number") {
      onChange(checked ? 1 : 0);
    } else {
      onChange(checked);
    }
  };

  const handleBlur = ({ target }) => onBlur(id, target.checked);

  const handleFocus = ({ target }) => onFocus(id, target.checked);

  const isChecked = schema.type === "string" ? value === "true" : value;
  return (
    <Switch
      style={{
        background: bgColor,
        opacity: isChecked ? 1 : 0.5,
      }}
      autoFocus={autofocus}
      checked={schema.type === "string" ? value === "true" : value}
      disabled={disabled || (readonlyAsDisabled && readonly)}
      id={id}
      name={id}
      checkedChildren={checkedLabel}
      unCheckedChildren={uncheckedLabel}
      onBlur={!readonly ? handleBlur : undefined}
      onChange={!readonly ? handleChange : undefined}
      onFocus={!readonly ? handleFocus : undefined}
    >
      {label}
    </Switch>
  );
};

export default SwitchWidget;
