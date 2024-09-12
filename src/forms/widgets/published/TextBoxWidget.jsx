import { Tag } from "antd";

const TextBoxWidget = ({ value, Icon }) => {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return values.length
    ? values.map((v) => (
        <Tag
          key={v}
          bordered={false}
          color={"#0069961A"}
          style={{ borderRadius: "20px", color: "black" }}
        >
          <Icon style={{ color: "gray" }} /> {v}
        </Tag>
      ))
    : undefined;
};

export default TextBoxWidget;
