import { Alert, Button, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { ErrorBoundary } = Alert;

const FormErrorBoundary = ({ children }) => (
  <ErrorBoundary
    description={
      <div style={{ whiteSpace: "normal" }}>
        <Typography.Text strong>Why am I getting this error?</Typography.Text>
        <Typography.Paragraph ellipsis={{ rows: 12, expandable: true }}>
          Your schema might not be following the{" "}
          <a
            href="https://json-schema.org/specification"
            target="_blank"
            rel="noreferrer"
          >
            JSONSchema specification
          </a>
          . This usually happens when you have manually modified the JSON schema
          and introduced some errors. Please make sure the schema follows the
          specification and try again.
          <br />
          Notes:
          <ul>
            <li>
              Formule adds some custom properties to the schema not present in
              the JSONSchema specification, but these should not cause issues.
            </li>
            <li>
              When you get this error, you usually want to be looking at clear
              violations of the JSON Schema principles. For example, list or
              object fields not containing a type or containing children as
              direct descendants instead of within a <code>properties</code>
              or <code>items</code> object.
            </li>
            <li>
              These errors could also be coming from the uiSchema (e.g.
              non-existing widget/field).
            </li>
          </ul>
        </Typography.Paragraph>
        <Button
          icon={<ReloadOutlined />}
          onClick={() => window.location.reload()}
          block
        >
          Reload page
        </Button>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
);

export default FormErrorBoundary;
