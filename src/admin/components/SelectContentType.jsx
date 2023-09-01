import { Space, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectContentType } from "../../store/schemaWizard";
const SelectContentType = () => {

  const contentTypes = useSelector((state) => state.auth.getIn(["currentUser", "depositGroups"]))

  const dispatch = useDispatch()

  return (
    <Space style={{ width: "100%", flexWrap: "wrap" }}>
      {contentTypes &&
        contentTypes.map(item => (
          <Tag
            className="hoverPointer"
            onClick={() => dispatch(selectContentType(item.get("deposit_group")))}
            key={item.get("deposit_group")}
            data-cy={"admin-predefined-content"}
          >
            {item.get("name")}
          </Tag>
        ))}
    </Space>
  );
};

export default SelectContentType;
