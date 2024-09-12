import { AppstoreOutlined } from "@ant-design/icons";
import TextBoxWidget from "./TextBoxWidget";

const SelectWidget = ({ value }) => {
  return <TextBoxWidget value={value} Icon={AppstoreOutlined} />;
};

export default SelectWidget;
