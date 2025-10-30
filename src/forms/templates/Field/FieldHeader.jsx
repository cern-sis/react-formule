import PropTypes from "prop-types";
import { Col, Row, Space, Tooltip, Typography } from "antd";
import Markdown from "../../../partials/Markdown";
import TitleField from "../../fields/internal/TitleField";
import { ReadOutlined } from "@ant-design/icons";

const FieldHeader = ({
  label,
  description,
  uiSchema,
  isObject,
  idSchema,
  titleField,
  hideAnchors,
  compact,
  renderAddItemButton,
  renderErrorMessage,
}) => {
  const titleIsMarkdown =
    uiSchema["ui:options"] && uiSchema["ui:options"].titleIsMarkdown;
  const descriptionIsMarkdown =
    uiSchema["ui:options"] && uiSchema["ui:options"].descriptionIsMarkdown;

  const renderTitle = () =>
    titleField ||
    (uiSchema["ui:title"] !== false && label && (
      <TitleField
        title={label}
        titleIsMarkdown={titleIsMarkdown}
        isObject={isObject}
        id={`${idSchema.$id}-title`}
        fieldId={idSchema.$id}
        hideAnchors={hideAnchors}
      />
    ));

  const renderDescription = () => {
    if (!description) return null;
    const markdown = (
      <Markdown
        text={description}
        renderAsHtml={descriptionIsMarkdown}
        style={{ color: "#000" }}
      />
    );
    if (compact) {
      return (
        <Tooltip
          // title={markdown}
          title={<Typography.Text>{markdown}</Typography.Text>}
          placement="right"
          color="white"
          style={{ margin: 10 }}
        >
          <Typography.Text type="secondary" style={{ cursor: "pointer" }}>
            <span role="img" aria-label="info">
              <ReadOutlined />
            </span>
          </Typography.Text>
        </Tooltip>
      );
    }
    return (
      <Typography.Text type="secondary" id={`${idSchema.$id}-description`}>
        {markdown}
      </Typography.Text>
    );
  };

  if (compact) {
    return (
      <Row
        className="formItemTitle"
        align="middle"
        style={{ width: "100%" }}
        wrap={false}
      >
        <Col flex="auto">
          <Space wrap={false}>
            {renderTitle()}
            {renderDescription()}
          </Space>
        </Col>
        {renderErrorMessage && renderErrorMessage()}{" "}
        {/* FIXME: This approach doesn't display errors for fields with hidden headers... */}
        {renderAddItemButton && (
          <Col flex="none">
            <Tooltip title="Add item" placement="left">
              {renderAddItemButton()}
            </Tooltip>
          </Col>
        )}
      </Row>
    );
  }

  return (
    <Space
      direction="vertical"
      size={0}
      style={{ width: "100%" }}
      className="formItemTitle"
    >
      {renderTitle()}
      {renderDescription()}
    </Space>
  );
};

FieldHeader.propTypes = {
  displayLabel: PropTypes.bool,
  label: PropTypes.string,
  uiSchema: PropTypes.object,
  description: PropTypes.node,
  isObject: PropTypes.bool,
  idSchema: PropTypes.object,
  titleField: PropTypes.element,
};

export default FieldHeader;
