import { Collapse, Space } from "antd";
import { partition } from "lodash-es";

const PropKeyEditorObjectFieldTemplate = ({ properties }) => {
  const [[uiOptions], otherProps] = partition(
    properties,
    (prop) => prop.name === "ui:options",
  );
  const elements = [
    uiOptions,
    { title: "Field UI Options", content: otherProps },
  ];

  return uiOptions ? (
    <Collapse
      className="propKeyCollapse"
      style={{ margin: "0 10px 10px 10px" }}
      defaultActiveKey={Array.from(Array(properties.length).keys())}
      expandIconPosition="end"
      items={elements.map((item, index) => ({
        key: index,
        label: item.title || item.content.props.schema.title,
        children: item.content.length
          ? item.content.map((i) => i.content)
          : item.content,
      }))}
    />
  ) : (
    <Space direction="vertical" style={{ margin: "0 10px" }}>
      {properties.map((item) => item.content)}
    </Space>
  );
};

export default PropKeyEditorObjectFieldTemplate;
