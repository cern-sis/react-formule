import { useState } from "react";
import { Button, Modal, Space } from "antd";
import { EditOutlined } from "@ant-design/icons";

const FieldModal = ({ label, content, options }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Space
        align={options?.buttonInNewLine ? "start" : "center"}
        size="small"
        direction={options?.buttonInNewLine ? "vertical" : "horizontal"}
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        {label}
        <Button
          size="small"
          icon={<EditOutlined />}
          onClick={() => setModalOpen(true)}
        >
          {options?.buttonText || "Open"}
        </Button>
      </Space>
      <Modal
        getContainer={false}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        className="formule-field-modal"
        width={options?.modalWidth ? options?.modalWidth : 400}
      >
        {content}
      </Modal>
    </>
  );
};

export default FieldModal;
