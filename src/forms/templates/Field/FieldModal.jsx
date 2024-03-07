import { useState } from "react";

import { Button, Divider, Modal, Space } from "antd";

import "../../Form.less";

import { EditOutlined } from "@ant-design/icons";

function FieldModal(props) {
  const [modalOpen, setmodalOpen] = useState(false);
  const { label, content, options } = props;
  return (
    <>
      <Space
        align={options?.headerDirection == "horizontal" ? "center" : "start"}
        size="small"
        split={
          options?.headerDirection != "vertical" && <Divider type="vertical" />
        }
        direction={
          ["horizontal", "vertical"].indexOf(options?.headerDirection) > -1
            ? options.headerDirection
            : "horizontal"
        }
        style={{
          display: "flex",
          flex: 1,
          width: "100%",
          backgdround: "blue",
          justifyCodntent: "space-between",
        }}
      >
        {label}
        <Button
          size="small"
          icon={<EditOutlined />}
          onClick={() => setmodalOpen(!modalOpen)}
        >
          {options?.btnText || "Open"}
        </Button>
      </Space>
      <Modal
        centered
        getContainer={false}
        open={modalOpen}
        okText={options?.okText}
        onCancel={() => setmodalOpen(false)}
        footer={null}
        className="formule-field-modal"
        width={options?.modalWidth ? options?.modalWidth : 416}
      >
        {content}
      </Modal>
    </>
  );
}

export default FieldModal;
