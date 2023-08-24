import { MosesContext, SelectOrEdit } from "cap-moses";
import { SchemaPreview } from "cap-moses";
import { FormPreview } from "cap-moses";
import { initMosesSchema } from "cap-moses";
import { useEffect } from "react";
import { Row, Col } from "antd";

function App() {
  useEffect(() => {
    initMosesSchema();
  }, []);

  return (
    <MosesContext>
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
          <SelectOrEdit />
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
      
    </MosesContext>
  );
}

export default App;
