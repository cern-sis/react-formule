import { Tag } from "antd";

export const FieldMessageTag = ({ color, children }) => (
  <Tag
    color={color}
    bordered={false}
    style={{
      whiteSpace: "normal",
      padding: "1px 4px",
      lineHeight: "14px",
    }}
  >
    {children}
  </Tag>
);
