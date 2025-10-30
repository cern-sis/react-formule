import PropTypes from "prop-types";
import { Button, Col, Row, Tooltip, Typography } from "antd";
import SchemaTree from "../components/SchemaTree";
import { SettingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { selectProperty } from "../../store/schemaWizard";

const SchemaPreview = ({ hideSchemaKey }) => {
  const schema = useSelector((state) => state.schemaWizard.current.schema);
  const id = useSelector((state) => state.schemaWizard.id);

  const dispatch = useDispatch();

  return (
    <div style={{ height: "80%" }} data-cy="schemaTree">
      <Row justify="center">
        <Col span={24}>
          <Typography.Title
            level={4}
            style={{
              textAlign: "center",
              margin: hideSchemaKey ? "15px 0" : "15px 0 0 0",
            }}
          >
            Schema tree
          </Typography.Title>
        </Col>
        {!hideSchemaKey && (
          <Typography.Text type="secondary">{id}</Typography.Text>
        )}
      </Row>
      <Row
        wrap={false}
        justify="space-between"
        align="middle"
        style={{ padding: "0 10px" }}
      >
        <Typography.Title
          level={5}
          style={{ margin: 0 }}
          ellipsis={{ tooltip: true }}
          data-cy="rootTitle"
        >
          {(schema && schema.title) || "root"}
        </Typography.Title>
        <Tooltip title="Edit root settings">
          <Button
            type="link"
            shape="circle"
            icon={<SettingOutlined />}
            onClick={() =>
              dispatch(selectProperty({ path: { schema: [], uiSchema: [] } }))
            }
            className="tour-root-settings"
            data-cy="rootSettings"
          />
        </Tooltip>
      </Row>
      <Row style={{ padding: "0 10px" }}>
        <Typography.Text type="secondary" level={5} data-cy="rootDescription">
          {schema && schema.description}
        </Typography.Text>
      </Row>
      <SchemaTree key="schemaTree" />
    </div>
  );
};

SchemaPreview.propTypes = {
  schema: PropTypes.object,
  selectProperty: PropTypes.func,
};

export default SchemaPreview;
