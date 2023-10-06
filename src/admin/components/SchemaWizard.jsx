import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Col, Row, Spin } from "antd";
import PropertyEditor from "../components/PropertyEditor";
import SelectFieldType from "../components/SelectFieldType";
import SchemaPreview from "../components/SchemaPreview";
import FormPreview from "../components/FormPreview";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { schemaInit } from "../../store/schemaWizard";

const SchemaWizard = () => {

  const field = useSelector((state) => state.schemaWizard.field)
  const loader = useSelector((state) => state.schemaWizard.loader)

  const dispatch = useDispatch()

  useEffect(() => { dispatch(schemaInit()) }, [])

  if (loader)
    return (
      <Row style={{ height: "100%" }} align="middle" justify="center">
        <Spin size="large" />
      </Row>
    );

  return (
    <DndProvider backend={HTML5Backend} context={window}>
      <Row style={{ height: "100%" }}>
        <Col
          xs={10}
          sm={5}
          style={{
            overflowX: "hidden",
            height: "100%",
            display: "flex",
          }}
          className="tour-field-types"
        >
          {field ? <PropertyEditor /> : <SelectFieldType />}
        </Col>
        <Col
          xs={14}
          sm={5}
          style={{
            overflowX: "hidden",
            height: "100%",
            padding: "0px 15px",
            backgroundColor: "#F6F7F8",
          }}
          className="tour-schema-preview"
        >
          <SchemaPreview />
        </Col>
        <Col
          xs={24}
          sm={14}
          style={{ overflowX: "hidden", height: "100%", padding: "0px 15px" }}
          className="tour-form-preview"
        >
          <FormPreview />
        </Col>
      </Row>
    </DndProvider>
  );
};

export default SchemaWizard;
