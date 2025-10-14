import { useContext, useState, useMemo } from "react";
import Form from "../../forms/Form";
import { Segmented, Row } from "antd";
import { useSelector } from "react-redux";
import EditablePreview from "./EditablePreview";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import CustomizationContext from "../../contexts/CustomizationContext";

const FormPreview = ({ liveValidate, hideAnchors }) => {
  const schema = useSelector((state) => state.schemaWizard.current.schema);
  const uiSchema = useSelector((state) => state.schemaWizard.current.uiSchema);
  const formData = useSelector((state) => state.form.formData);

  const customizationContext = useContext(CustomizationContext);

  const transformedSchema = useMemo(() => {
    return customizationContext.transformSchema(schema);
  }, [customizationContext, schema]);

  const [segment, setSegment] = useState("editable");

  const handleSegmentChange = (value) => {
    setSegment(value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      data-cy="formPreview"
    >
      <Row justify="center" style={{ margin: "18px" }}>
        <Segmented
          options={[
            { label: "Editable", value: "editable", icon: <EditOutlined /> },
            { label: "Published", value: "published", icon: <EyeOutlined /> },
          ]}
          style={{ fontWeight: "bold" }}
          value={segment}
          onChange={handleSegmentChange}
        />
      </Row>
      <div
        style={{
          padding: "0 25px",
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {segment === "editable" ? (
          <EditablePreview
            hideTitle
            liveValidate={liveValidate}
            schema={transformedSchema}
            uiSchema={uiSchema}
            formData={formData}
          />
        ) : (
          <Form
            schema={transformedSchema}
            uiSchema={uiSchema}
            formData={formData}
            hideAnchors={hideAnchors}
            isPublished
          />
        )}
      </div>
    </div>
  );
};

export default FormPreview;
