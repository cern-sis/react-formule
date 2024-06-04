import { Collapse } from "antd";

// For use in fieldTypes for the PropKeyEditor
const CollapseObjectFieldTemplate = ({ properties }) => {
  const [first, ...rest] = properties;
  const elements = [first, { title: "Field UI Options", content: rest }];

  return (
    <Collapse
      style={{ margin: "0 10px 10px 10px" }}
      defaultActiveKey={Array.from(Array(properties.length).keys())}
      expandIconPosition="right"
      items={elements.map((item, index) => ({
        key: index,
        label: item.title || item.content.props.schema.title,
        children: item.content.length
          ? item.content.map((i) => i.content)
          : item.content,
      }))}
    />
  );
};

export default CollapseObjectFieldTemplate;
