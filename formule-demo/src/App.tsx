import { FormuleContext, SelectOrEdit } from "react-formule";
import { SchemaPreview } from "react-formule";
import { FormPreview } from "react-formule";
import { initFormuleSchema } from "react-formule";
import { useEffect } from "react";
import { Row, Col, Layout, Space, Typography } from "antd";
import { theme } from "./theme";

import "./style.css";

const { Content, Footer } = Layout;

function App() {
  useEffect(() => {
    initFormuleSchema();
  }, []);

  return (
    <Layout style={{ height: "100%" }}>
      <Content>
        <FormuleContext theme={theme}>
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
              style={{
                overflowX: "hidden",
                height: "100%",
                padding: "0px 15px",
              }}
              className="tour-form-preview"
            >
              <FormPreview liveValidate={true} />
            </Col>
          </Row>
        </FormuleContext>
      </Content>
      <Footer style={{ padding: 0 }}>
        <Row
          align="bottom"
          justify="center"
          style={{ padding: "5px", background: "#001529" }}
        >
          <Space direction="horizontal" size="middle">
            <Typography.Text style={{ color: "rgba(255, 255, 255, 0.65)" }}>
              Running react-formule v{import.meta.env.REACT_FORMULE_VERSION}
            </Typography.Text>
          </Space>
        </Row>
      </Footer>
    </Layout>
  );
}

export default App;
