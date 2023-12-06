import { FormuleContext, SelectOrEdit } from "react-formule";
import { SchemaPreview } from "react-formule";
import { FormPreview } from "react-formule";
import { initFormuleSchema } from "react-formule";
import { useEffect } from "react";
import { Row, Col } from "antd";

import "./style.css"

const PRIMARY_COLOR = "#006996";

function App() {
  useEffect(() => {
    initFormuleSchema();
  }, []);

  return (
    <FormuleContext theme={{
      token: {
        colorPrimary: PRIMARY_COLOR,
        colorLink: PRIMARY_COLOR,
        colorLinkHover: "#1a7fa3",
        borderRadius: 2,
        colorBgLayout: "#f0f2f5",
        fontFamily: "Titillium Web",
      },
    }}>
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
          <FormPreview liveValidate={true} />
        </Col>
      </Row>
      
    </FormuleContext>
  );
}

export default App;
