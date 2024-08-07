import { useContext, useState } from "react";
import Form from "../../forms/Form";
import { Segmented, Row } from "antd";
import { useSelector } from "react-redux";
import EditablePreview from "./EditablePreview";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import CustomizationContext from "../../contexts/CustomizationContext";

const FormPreview = ({ liveValidate, hideAnchors }) => {
  const schema = useSelector((state) => state.schemaWizard.current.schema);
  const uiSchema = useSelector((state) => state.schemaWizard.current.uiSchema);
  const formData = useSelector((state) => state.schemaWizard.formData);

  const customizationContext = useContext(CustomizationContext);

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
      <Row justify="center" style={{ margin: "15px" }}>
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
      {segment === "editable" ? (
        <EditablePreview hideTitle liveValidate={liveValidate} />
      ) : (
        <Form
          schema={customizationContext.transformSchema(schema)}
          uiSchema={uiSchema}
          formData={formData}
          hideAnchors={hideAnchors}
          isPublished
        />
      )}
    </div>
  );
};

export default FormPreview;
