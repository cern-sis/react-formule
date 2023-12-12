import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Grid,
  Popconfirm,
  Row,
  Typography,
} from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import Customize from "../components/Customize";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { deleteByPath, enableCreateMode, renameIdByPath } from "../../store/schemaWizard";

const { useBreakpoint } = Grid;

const renderPath = pathToUpdate => {
  let prev;
  let content;
  const breadcrumbItems = [];

  let path = pathToUpdate.path;

  path &&
    path.map(item => {
      if (breadcrumbItems.length == 0) {
        if (item == "properties") content = "{ } root";
        else if (item == "items") content = "[ ] root";
      } else {
        if (item == "properties") {
          content = `{ } ${prev || ""}`;
          prev = null;
        } else if (item == "items") {
          content = `[ ] ${prev || ""}`;
          prev = null;
        } else prev = item;
      }

      if (!prev) breadcrumbItems.push({ title: content });
    });

  if (prev) breadcrumbItems.push({ title: prev });

  return <Breadcrumb items={breadcrumbItems} />;
};
const PropertyEditor = () => {
  const [name, setName] = useState();
  const screens = useBreakpoint();

  const pathObj = useSelector((state) => state.schemaWizard.field)

  const dispatch = useDispatch()

  useEffect(() => {
    if (pathObj) {
      const p = pathObj.path;
      if (p.length) {
        setName(p.findLast(item => item !== "properties" && item != "items"));
      } else {
        setName("root");
      }
    }
  }, [pathObj]);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }} data-cy="fieldSettings">
      <PageHeader
        onBack={() => dispatch(enableCreateMode())}
        title={(screens.xl || pathObj.path.length == 0) && "Field settings"}
        extra={
          pathObj.path.length > 0 && (
            <Popconfirm
              title="Delete field"
              okType="danger"
              okText="Delete"
              cancelText="Cancel"
              onConfirm={() => {
                dispatch(deleteByPath({path: pathObj}));
                dispatch(enableCreateMode());
              }}
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )
        }
      />
      <Row justify="center">
        <Col xs={22} style={{ paddingBottom: "10px", textAlign: "center" }}>
          {renderPath(pathObj)}
        </Col>
        <Col xs={18} data-cy="editFieldId">
          <Typography.Title
            level={5}
            editable={pathObj.path.length && {
              text: name,
              onChange: value => dispatch(renameIdByPath({path: pathObj, newName: value})),
            }}
            style={{ textAlign: "center" }}
          >
            {name}
          </Typography.Title>
        </Col>
      </Row>
      <Customize path={pathObj} />
    </div>
  );
};

export default PropertyEditor;
