import PropTypes from "prop-types";
import { Space, Typography } from "antd";
import Markdown from "../../../partials/Markdown";
import TitleField from "../../fields/internal/TitleField";

const FieldHeader = ({
  label,
  description,
  uiSchema,
  isObject,
  fieldPathId,
  titleField,
  hideAnchors,
}) => {
  return (
    <Space direction="vertical" size={0} style={{ width: "100%" }}>
      {titleField
        ? titleField
        : uiSchema["ui:title"] !== false &&
          label && (
            <TitleField
              title={label}
              titleIsMarkdown={
                uiSchema["ui:options"] && uiSchema["ui:options"].titleIsMarkdown
              }
              isObject={isObject}
              id={`${fieldPathId.$id}-title`}
              fieldId={fieldPathId.$id}
              hideAnchors={hideAnchors}
            />
          )}
      {description && (
        <Typography.Text type="secondary" id={`${fieldPathId.$id}-description`}>
          <Markdown
            text={description}
            style={{
              color: "#000",
            }}
            renderAsHtml={
              uiSchema["ui:options"] &&
              uiSchema["ui:options"].descriptionIsMarkdown
            }
          />
        </Typography.Text>
      )}
    </Space>
  );
};

FieldHeader.propTypes = {
  displayLabel: PropTypes.bool,
  label: PropTypes.string,
  uiSchema: PropTypes.object,
  description: PropTypes.node,
  isObject: PropTypes.bool,
  fieldPathId: PropTypes.object,
  titleField: PropTypes.element,
};

export default FieldHeader;
