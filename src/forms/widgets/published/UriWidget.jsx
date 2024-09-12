import { Button, Tooltip, Typography } from "antd";
import PropTypes from "prop-types";
import { CopyOutlined } from "@ant-design/icons";

const UriWidget = ({ value }) => {
  return (
    value && (
      <span>
        <Typography.Link href={value}>{value}</Typography.Link>
        <Tooltip title="Copy URI">
          <Button
            onClick={() => {
              navigator.clipboard.writeText(value);
            }}
            icon={<CopyOutlined />}
            type="link"
          />
        </Tooltip>
      </span>
    )
  );
};

UriWidget.propTypes = {
  value: PropTypes.string,
};

export default UriWidget;
