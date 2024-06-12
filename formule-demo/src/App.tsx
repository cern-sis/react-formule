import { FileTextOutlined } from "@ant-design/icons";
import { Col, FloatButton, Layout, Modal, Row, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  CodeViewer,
  FormPreview,
  FormuleContext,
  SchemaPreview,
  SchemaWizardState,
  SelectOrEdit,
  initFormuleSchema,
} from "react-formule";
import { theme } from "./theme";

import "./style.css";

const { Content, Footer } = Layout;

function App() {
  useEffect(() => {
    initFormuleSchema();
  }, []);

  const [formuleState, setFormuleState] = useState<SchemaWizardState>();
  const [modalOpen, setModalOpen] = useState(false);

  const handleFormuleStateChange = (newState: SchemaWizardState) => {
    setFormuleState(newState);
  };

  return (
    <>
      <Modal
        title="Generated JSON schemas"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        width={1000}
        footer={null}
      >
        <Row gutter={[10, 10]}>
          <Col
            xs={24}
            style={{
              overflowX: "hidden",
              height: "100%",
            }}
          >
            <Typography.Text strong>Schema</Typography.Text>
            <CodeViewer
              value={JSON.stringify(formuleState?.current.schema, null, 2)}
              lang="json"
              height="45vh"
              reset
            />
          </Col>
          <Col
            xs={12}
            style={{
              overflowX: "hidden",
              height: "100%",
            }}
          >
            <Typography.Text strong>UI Schema</Typography.Text>
            <CodeViewer
              value={JSON.stringify(formuleState?.current.uiSchema, null, 2)}
              lang="json"
              height="25vh"
              reset
            />
          </Col>
          <Col
            xs={12}
            style={{
              overflowX: "hidden",
              height: "100%",
            }}
          >
            <Typography.Text strong>Form data</Typography.Text>
            <CodeViewer
              value={JSON.stringify(formuleState?.formData, null, 2)}
              lang="json"
              height="25vh"
              reset
            />
          </Col>
        </Row>
      </Modal>
      <Layout style={{ height: "100%" }}>
        <Content style={{ overflowY: "scroll" }}>
          <FormuleContext
            theme={theme}
            synchronizeState={handleFormuleStateChange}
          >
            <Row style={{ height: "100%" }}>
              <Col
                xs={10}
                sm={5}
                style={{
                  overflowX: "hidden",
                  height: "100%",
                  display: "flex",
                }}
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
              >
                <SchemaPreview />
              </Col>
              <Col
                xs={24}
                sm={14}
                style={{
                  overflowX: "hidden",
                  height: "100%",
                  padding: "0px 25px",
                }}
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
      <FloatButton
        onClick={() => setModalOpen(true)}
        shape="square"
        description={
          <div>
            <FileTextOutlined /> View generated schemas
          </div>
        }
        style={{ width: "200px" }}
        type="primary"
      />
    </>
  );
}

export default App;
