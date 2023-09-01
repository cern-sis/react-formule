import Form from "../../forms/Form";
import { transformSchema } from "../../partials/Utils/schema";
import { shoudDisplayGuideLinePopUp } from "../utils";
import { Row, Empty, Space, Typography, Col } from "antd";
import { useSelector } from "react-redux";
import { get } from "lodash-es"

const FormPreview = () => {
const schema = useSelector((state) => get(state.schemaWizard, ["current", "schema"]))
const uiSchema = useSelector((state) => get(state.schemaWizard, ["current", "uiSchema"]))

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Typography.Title
        level={4}
        style={{ textAlign: "center", margin: "15px 0" }}
      >
        Preview
      </Typography.Title>
      {shoudDisplayGuideLinePopUp(schema) ? (
        <Row
          justify="center"
          align="middle"
          style={{ height: "100%", flex: 1 }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Space direction="vertical">
                <Typography.Title level={5}>
                  Your form is empty
                </Typography.Title>
                <Typography.Text type="secondary">
                  Add fields to the drop area to initialize your form
                </Typography.Text>
              </Space>
            }
          />
        </Row>
      ) : (
        <Row justify="center">
          <Col xs={22} sm={20}>
            <Form
              schema={transformSchema(schema)}
              uiSchema={uiSchema}
              formData={{}}
              onChange={() => {}}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default FormPreview;
