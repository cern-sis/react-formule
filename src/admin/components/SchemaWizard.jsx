import { MultiBackend } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { DndProvider } from "react-dnd";
import { Col, Row, Spin } from "antd";
import PropertyEditor from "../components/PropertyEditor";
import SelectFieldType from "../components/SelectFieldType";
import SchemaPreview from "../components/SchemaPreview";
import FormPreview from "../components/FormPreview";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { schemaInit } from "../../store/schemaWizard";
import { isEmpty } from "lodash-es";

const SchemaWizard = () => {
  const field = useSelector((state) => state.schemaWizard.field);
  const loader = useSelector((state) => state.schemaWizard.loader);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(schemaInit());
  }, []);

  if (loader)
    return (
      <Row style={{ height: "100%" }} align="middle" justify="center">
        <Spin size="large" />
      </Row>
    );

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch} context={window}>
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
          {isEmpty(field) ? <SelectFieldType /> : <PropertyEditor />}
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
