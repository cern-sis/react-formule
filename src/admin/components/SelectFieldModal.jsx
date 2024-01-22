import { Button, Modal } from "antd";
import SelectFieldType from "./SelectFieldType";

const SelectFieldModal = ({ visible, setVisible, insertInPath }) => {
  return (
    <Modal
      destroyOnClose
      open={visible}
      onCancel={() => setVisible(false)}
      footer={
        <Button type="primary" onClick={() => setVisible(false)}>
          Ok
        </Button>
      }
      width={450}
    >
      <SelectFieldType insertInPath={insertInPath} />
    </Modal>
  );
};

export default SelectFieldModal;
