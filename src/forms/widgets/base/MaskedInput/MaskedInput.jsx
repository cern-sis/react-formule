import { Input, Space } from "antd";
import InputMask from "react-input-mask";
import { FieldMessageTag } from "../../../../utils/FieldMessageTag";

const MAPPINGS = {
  a: /[a-z]/,
  A: /[A-Z]/,
  0: /[0-9]/,
  "*": /[a-zA-Z0-9]/,
};

const MaskedInput = ({
  id,
  mask,
  pattern,
  name,
  onBlur,
  onChange,
  onFocus,
  onPressEnter,
  placeholder,
  buttons,
  value,
  disabled,
  message,
  convertToUppercase,
  autofillInfo,
}) => {
  const status = new RegExp(pattern).test(value);

  return (
    <div>
      <Space.Compact style={{ width: "100%" }}>
        <InputMask
          mask={
            mask &&
            mask
              .split(/(.*?[^\\])/)
              .filter((i) => i) // needed to remove empty entries
              .map((i) => {
                let mappings = convertToUppercase
                  ? { ...MAPPINGS, a: /[a-zA-Z]/, A: /[a-zA-Z]/ }
                  : MAPPINGS;
                return i in mappings ? mappings[i] : i.replace("\\", "");
              })
          }
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onPressEnter={onPressEnter}
          value={value}
          disabled={disabled}
        >
          <Input
            id={id}
            name={name}
            placeholder={placeholder}
            autoComplete="off"
            suffix={autofillInfo}
          />
        </InputMask>
        {buttons && buttons(status)}
      </Space.Compact>
      {message && (
        <FieldMessageTag color={message.status}>
          {message.message}
        </FieldMessageTag>
      )}
    </div>
  );
};

export default MaskedInput;
