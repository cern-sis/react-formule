import { Typography } from "antd";
import PropTypes from "prop-types";

const UriWidget = ({ value }) => {
  return <Typography.Link href={value}>{value}</Typography.Link>;
};

UriWidget.propTypes = {
  value: PropTypes.string,
};

export default UriWidget;
