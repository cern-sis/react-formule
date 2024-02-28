import { StreamLanguage } from "@codemirror/language";
import CodeEditor from "../../utils/CodeEditor";
import { jinja2 } from "@codemirror/legacy-modes/mode/jinja2";
import { placeholder } from "@codemirror/view";
import { Button, Modal } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { useState } from "react";

const ItemsDisplayTitle = ({ onChange, value }) => {
  const [editorValue, setEditorValue] = useState(value);
  const [modalOpen, setModalOpen] = useState();

  return (
    <>
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => {
          onChange(editorValue);
          setModalOpen(false);
        }}
        width={720}
        title="Items Title"
        style={{ height: "200px" }}
        destroyOnClose
      >
        <div style={{ height: "200px" }}>
          <CodeEditor
            height="100%"
            value={value}
            handleEdit={setEditorValue}
            extraExtensions={[
              StreamLanguage.define(jinja2),
              placeholder("Path: {{item_123}} - Type: {{item_456}}"),
            ]}
            minimal
          />
        </div>
      </Modal>
      <Button
        icon={<ExportOutlined />}
        style={{ width: "100%" }}
        onClick={() => setModalOpen(true)}
      >
        Edit
      </Button>
    </>
  );
};

export default ItemsDisplayTitle;
