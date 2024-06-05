import { useState } from "react";
import { Button, Modal, Space, Tooltip, theme } from "antd";
import { EditOutlined, QuestionCircleOutlined } from "@ant-design/icons";

const FieldModal = ({ id, label, content, options, tooltip }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { token } = theme.useToken();

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
        <Space>
          {label}
          {!tooltip && (
            <Tooltip title={tooltip}>
              <QuestionCircleOutlined
                style={{ color: token.colorTextTertiary, cursor: "help" }}
              />
            </Tooltip>
          )}
        </Space>
        <Button
          id={id}
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
        data-cy="fieldModal"
        width={options?.modalWidth ? options?.modalWidth : 400}
      >
        {content}
      </Modal>
    </>
  );
};

export default FieldModal;
