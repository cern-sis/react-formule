import { Typography } from "antd";
import PropTypes from "prop-types";

const TextWidget = ({ value }) => {
  return (
    <Typography.Paragraph style={{ whiteSpace: "pre-line" }}>
      {value}
    </Typography.Paragraph>
  );
};

TextWidget.propTypes = {
  value: PropTypes.string,
};

export default TextWidget;
