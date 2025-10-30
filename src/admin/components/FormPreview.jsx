import { useContext, useState } from "react";
import Form from "../../forms/Form";
import { Segmented, Row } from "antd";
import { useSelector } from "react-redux";
import EditablePreview from "./EditablePreview";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import CustomizationContext from "../../contexts/CustomizationContext";

const FormPreview = ({ liveValidate, hideAnchors }) => {
  // const { compactAlgorithm } = theme;

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
          position: "relative",
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            padding: "0 25px 20px 25px",
            minHeight: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* TODO: this should be set dynamically based on the compact prop from root ui settings */}
          {/* <ConfigProvider theme={{ algorithm: compactAlgorithm }}> */}
          {segment === "editable" ? (
            <EditablePreview
              hideTitle
              liveValidate={liveValidate}
              schema={customizationContext.transformSchema(schema)}
              uiSchema={uiSchema}
              formData={formData}
            />
          ) : (
            <Form
              schema={customizationContext.transformSchema(schema)}
              uiSchema={uiSchema}
              formData={formData}
              hideAnchors={hideAnchors}
              isPublished
            />
          )}
          {/* </ConfigProvider> */}
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
