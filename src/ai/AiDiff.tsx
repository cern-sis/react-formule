import { useMemo, useState } from "react";
import { Row, Col, Tabs, theme, Typography } from "antd";
import { DoubleRightOutlined } from "@ant-design/icons";
import { generatePatches } from "./utils";
import Form from "../forms/Form";
import { AISuggestion } from "../types";
import CodeDiffViewer from "../utils/CodeDiffViewer";

type AiDiffProps = {
  currentSchema: object;
  currentUiSchema: object;
  suggestion: AISuggestion;
};

const AiDiff = ({
  currentSchema,
  currentUiSchema,
  suggestion,
}: AiDiffProps) => {
  const { token } = theme.useToken();
  const [activeTab, setActiveTab] = useState("form");

  const patches = useMemo(() => {
    return generatePatches(currentSchema, suggestion?.schema);
  }, [currentSchema, suggestion]);

  const items = [
    {
      key: "form",
      label: "Form Diff",
      children: suggestion && (
        <Row
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
            paddingBottom: "12px",
          }}
        >
          <Col
            flex="1"
            style={{
              backgroundColor: token.colorErrorBg,
              marginRight: "30px",
              padding: "10px",
              height: "100%",
            }}
          >
            <Form
              schema={currentSchema}
              uiSchema={currentUiSchema}
              formData={{}}
              formContext={{
                patches: patches.filter((p) => p.op === "remove"),
              }}
              hideAnchors
            />
          </Col>
          <Col
            flex="1"
            style={{
              backgroundColor: token.colorSuccessBg,
              marginLeft: "30px",
              padding: "10px",
              height: "100%",
            }}
          >
            <Form
              schema={suggestion.schema}
              uiSchema={suggestion.uiSchema}
              formData={{}}
              formContext={{
                patches: patches.filter(
                  (p) => p.op === "add" || p.op === "replace",
                ),
              }}
              hideAnchors
            />
          </Col>
        </Row>
      ),
    },
    {
      key: "schema",
      label: "Schema Diff",
      children: suggestion && (
        <Row
          style={{
            maxHeight: "80vh",
            textAlign: "left",
            overflow: "auto",
            paddingBottom: "12px",
          }}
        >
          <Col
            xs={12}
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              borderRight: `1px solid ${token.colorBorderSecondary}`,
              paddingTop: "8px",
            }}
          >
            <Typography.Text
              strong
              style={{
                textAlign: "center",
              }}
            >
              Schema
            </Typography.Text>
            <div
              style={{
                flex: 1,
                overflowY: "scroll",
                paddingTop: "5px",
              }}
            >
              <CodeDiffViewer
                left={JSON.stringify(currentSchema, null, 2)}
                right={JSON.stringify(suggestion.schema, null, 2)}
                lang="json"
                height="100%"
                unified
              />
            </div>
          </Col>
          <Col
            xs={12}
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              paddingTop: "8px",
            }}
          >
            <Typography.Text
              strong
              style={{
                textAlign: "center",
              }}
            >
              UI Schema
            </Typography.Text>
            <div
              style={{
                flex: 1,
                overflowY: "scroll",
                paddingTop: "5px",
              }}
            >
              <CodeDiffViewer
                left={JSON.stringify(currentUiSchema, null, 2)}
                right={JSON.stringify(suggestion.uiSchema, null, 2)}
                lang="json"
                height="100%"
                unified
              />
            </div>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div
      style={{
        width: "80vw",
        position: "relative",
      }}
    >
      <Tabs
        centered
        size="small"
        items={items}
        tabPosition="bottom"
        onChange={(key) => setActiveTab(key)}
        tabBarStyle={{ marginTop: "0px" }}
      />
      {activeTab === "form" && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <DoubleRightOutlined style={{ fontSize: "20px" }} />
        </div>
      )}
    </div>
  );
};

export default AiDiff;
