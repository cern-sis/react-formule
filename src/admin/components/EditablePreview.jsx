import { useContext } from "react";
import Form from "../../forms/Form";
import { shoudDisplayGuideLinePopUp } from "../utils";
import { Row, Empty, Space, Typography } from "antd";
import { useSelector } from "react-redux";
import CustomizationContext from "../../contexts/CustomizationContext";

const EditablePreview = ({ hideTitle, liveValidate }) => {
  const schema = useSelector((state) => state.schemaWizard.current.schema);
  const uiSchema = useSelector((state) => state.schemaWizard.current.uiSchema);
  const formData = useSelector((state) => state.schemaWizard.formData);

  const customizationContext = useContext(CustomizationContext);

  return (
    <>
      {!hideTitle && (
        <Typography.Title
          level={4}
          style={{ textAlign: "center", margin: "15px 0" }}
        >
          Editable Preview
        </Typography.Title>
      )}
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
        <Form
          schema={customizationContext.transformSchema(schema)}
          uiSchema={uiSchema}
          formData={formData || {}}
          onChange={() => {}}
          liveValidate={liveValidate}
        />
      )}
    </>
  );
};

export default EditablePreview;
