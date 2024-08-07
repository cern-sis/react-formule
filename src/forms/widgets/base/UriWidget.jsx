import { Button, Input, Tooltip } from "antd";
import { CopyOutlined, LinkOutlined } from "@ant-design/icons";
import { URL_REGEX } from "../../../utils";

const UriWidget = ({
  autofocus,
  disabled,
  formContext,
  id,
  onBlur,
  onChange,
  onFocus,
  readonly,
  value,
}) => {
  const { readonlyAsDisabled = true } = formContext;

  const handleBlur = ({ target }) => onBlur(id, target.value);
  const handleFocus = ({ target }) => onFocus(id, target.value);

  return (
    <Input
      type="url"
      autoFocus={autofocus}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={handleBlur}
      onFocus={handleFocus}
      disabled={disabled || (readonlyAsDisabled && readonly)}
      suffix={
        <>
          <Tooltip title="Open URI">
            <Button
              href={value}
              target="_blank"
              icon={<LinkOutlined />}
              style={{ marginRight: "5px" }}
              disabled={!value || !new RegExp(URL_REGEX).test(value)}
            />
          </Tooltip>
          <Tooltip title="Copy URI">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(value);
              }}
              icon={<CopyOutlined />}
              disabled={!value}
            />
          </Tooltip>
        </>
      }
    />
  );
};

export default UriWidget;
