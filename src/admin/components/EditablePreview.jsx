import React, { useContext, useMemo } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "lodash-es";
import Form from "../../forms/Form";
import { shoudDisplayGuideLinePopUp } from "../utils";
import { Row, Empty, Space, Typography } from "antd";
import { updateFormData } from "../../store/schemaWizard";

import CustomizationContext from "../../contexts/CustomizationContext";

const EditablePreview = ({
  hideTitle,
  liveValidate,
  schema,
  uiSchema,
  formData,
}) => {
  const customizationContext = useContext(CustomizationContext);
  const dispatch = useDispatch();

  const transformedSchema = useMemo(() => {
    return customizationContext.transformSchema(schema);
  }, [customizationContext, schema]);

  const debouncedDispatch = useMemo(() => {
    return debounce((newFormData) => {
      dispatch(updateFormData({ value: newFormData }));
    }, 300);
  }, [dispatch]);

  const handleFormChange = (change) => {
    debouncedDispatch(change.formData);
  };

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
          schema={transformedSchema}
          uiSchema={uiSchema}
          formData={formData || {}}
          onChange={handleFormChange}
          liveValidate={liveValidate}
        />
      )}
    </>
  );
};

export default EditablePreview;
