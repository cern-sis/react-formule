import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "lodash-es";
import Form from "../../forms/Form";
import { shoudDisplayGuideLinePopUp } from "../utils";
import { Row, Empty, Space, Typography } from "antd";
import { updateFormData } from "../../store/form";

const EditablePreview = ({
  hideTitle,
  liveValidate,
  schema,
  uiSchema,
  formData,
}) => {
  const dispatch = useDispatch();

  const debouncedDispatch = useMemo(() => {
    return debounce((newFormData) => {
      dispatch(updateFormData({ value: newFormData }));
    }, 500);
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
          schema={schema}
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
