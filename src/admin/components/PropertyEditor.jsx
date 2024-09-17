import { useContext, useEffect, useState } from "react";
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
import {
  deleteByPath,
  enableCreateMode,
  renameIdByPath,
} from "../../store/schemaWizard";
import CustomizationContext from "../../contexts/CustomizationContext";
import { get } from "lodash-es";
import { getIconByType } from "../utils";

const { useBreakpoint } = Grid;

const renderPath = (path) => {
  let prev;
  let content;
  const breadcrumbItems = [];

  path &&
    path.map((item) => {
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

  const customizationContext = useContext(CustomizationContext);

  const path = useSelector((state) => state.schemaWizard.field.path);
  const uiPath = useSelector((state) => state.schemaWizard.field.uiPath);

  const schema = useSelector((state) =>
    get(state.schemaWizard, ["current", "schema", ...path]),
  );
  const uiSchema = useSelector((state) =>
    get(state.schemaWizard, ["current", "uiSchema", ...uiPath]),
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (path) {
      if (path.length) {
        setName(
          path.findLast((item) => item !== "properties" && item != "items"),
        );
      } else {
        setName("root");
      }
    }
  }, [path]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", width: "100%" }}
      data-cy="fieldSettings"
    >
      <PageHeader
        onBack={() => dispatch(enableCreateMode())}
        title={(screens.xl || path.length == 0) && "Field settings"}
        extra={
          path.length > 0 && (
            <Popconfirm
              title="Delete field"
              okType="danger"
              okText="Delete"
              cancelText="Cancel"
              onConfirm={() => {
                dispatch(deleteByPath({ path: { path, uiPath } }));
                dispatch(enableCreateMode());
              }}
            >
              <Button danger icon={<DeleteOutlined />} data-cy="deleteField" />
            </Popconfirm>
          )
        }
      />
      <Row justify="center">
        <Col xs={22} style={{ paddingBottom: "10px" }}>
          {renderPath(path)}
        </Col>
        <Col xs={18} data-cy="editFieldId">
          <Typography.Title
            level={5}
            editable={
              path.length && {
                text: name,
                onChange: (value) =>
                  dispatch(
                    renameIdByPath({
                      path: { path, uiPath },
                      newName: value,
                      separator: customizationContext.separator,
                    }),
                  ),
              }
            }
            style={{ textAlign: "center", margin: "10px 0" }}
          >
            {getIconByType(
              schema,
              uiSchema,
              customizationContext.allFieldTypes,
            )}{" "}
            {name}
          </Typography.Title>
        </Col>
      </Row>
      <Row style={{ overflowY: "hidden", flex: 1 }}>
        <Customize />
      </Row>
    </div>
  );
};

export default PropertyEditor;
