import PropTypes from "prop-types";
import { parse } from "marked";
import { Typography } from "antd";

const RichEditorWidget = ({ value = "" }) => {
  return (
    <Typography.Text>
      <span
        className="markdownSpan"
        dangerouslySetInnerHTML={{ __html: parse(value) }}
      />
    </Typography.Text>
  );
};

RichEditorWidget.propTypes = {
  value: PropTypes.string,
};

export default RichEditorWidget;
