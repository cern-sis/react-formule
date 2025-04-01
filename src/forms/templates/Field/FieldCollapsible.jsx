import { Collapse, Typography } from "antd";

const FieldCollapsible = ({ id, label, content }) => {
  return (
    <Collapse
      ghost
      size="small"
      expandIconPosition="left"
      items={[
        {
          key: id,
          label: <Typography.Text strong>{label}</Typography.Text>,
          children: content,
        },
      ]}
      className="formule-field-collapsible"
    />
  );
};

export default FieldCollapsible;
