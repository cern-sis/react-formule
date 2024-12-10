import {
  FileTextOutlined,
  FolderOpenOutlined,
  DeleteOutlined,
  SaveOutlined,
  FileAddOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
  RollbackOutlined,
  ToolOutlined,
  DownOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Drawer,
  FloatButton,
  Layout,
  List,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import {
  CodeViewer,
  FormPreview,
  FormuleContext,
  SchemaPreview,
  SchemaWizardState,
  SelectOrEdit,
  deleteFromLocalStorage,
  getAllFromLocalStorage,
  initFormuleSchema,
  isUnsaved,
  saveToLocalStorage,
  loadFromLocalStorage,
} from "react-formule";
import { theme } from "./theme";

import "./style.css";

const { Content, Footer } = Layout;

function App() {
  const [formuleState, setFormuleState] = useState<SchemaWizardState>();
  const [localSchemas, setLocalSchemas] = useState(getAllFromLocalStorage());
  const [viewerOpen, setViewerOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [openFloatButtons, setOpenFloatButtons] = useState(true);

  useEffect(() => {
    setHasUnsavedChanges(isUnsaved());
  }, [formuleState]);

  useEffect(() => {
    const handleKeyDowEvent = (e: KeyboardEvent) => {
      if (e.ctrlKey || (e.metaKey && e.key === "s")) {
        e.preventDefault();
        saveLocalSchema();
      }
    };
    window.addEventListener("keydown", handleKeyDowEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDowEvent);
    };
  }, []);

  const handleFormuleStateChange = (newState: SchemaWizardState) => {
    setFormuleState(newState);
  };

  const handleDownload = (id: string, schema: object) => {
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(schema, null, 4)], {
      type: "text/json",
    });
    a.href = URL.createObjectURL(file);
    a.download = `formuleForm_${id}.json`;
    a.click();
  };

  const deleteLocalSchema = (id: string) => {
    deleteFromLocalStorage(id).then((list) => setLocalSchemas(list));
    if (id === formuleState?.id) {
      initFormuleSchema();
    }
  };

  const saveLocalSchema = () => {
    saveToLocalStorage().then((list) => {
      setHasUnsavedChanges(isUnsaved());
      setLocalSchemas(list);
      setJustSaved(true);
      setTimeout(() => {
        setJustSaved(false);
      }, 500);
    });
  };

  return (
    <>
      <Modal
        title="Generated JSON schemas"
        open={viewerOpen}
        onCancel={() => setViewerOpen(false)}
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
      <Modal
        title="Information"
        open={helpOpen}
        onCancel={() => setHelpOpen(false)}
        width={500}
        footer={null}
      >
        <Typography.Paragraph>
          The state of the current form is <mark>saved automatically</mark> on
          change. However, this should simply be taken as a security measure to
          prevent your from accidentally losing data, as changes are not
          autosaved into your local schemas repository.
        </Typography.Paragraph>
        <Typography.Paragraph>
          If you want to persist the local changes to your schema in your local
          repository (local storage) you can{" "}
          <mark>click on the save button or press [ctrl+s]</mark> (your saved
          schema won't be updated with the latest changes until you do this).
          You can switch between schemas and load them later on. You can tell
          when you have unsaved changes by looking at the <mark>blue dot</mark>{" "}
          on the save button. You can also revert unsaved changes by clicking on
          the corresponding button.
        </Typography.Paragraph>
        <Typography.Paragraph>
          You are encouraged to <mark>download</mark> any important data as a
          JSON file for more safety in case your browser's storage gets wiped.
          You can do so from the "Saved Schemas" drawer.
        </Typography.Paragraph>
        <Typography.Paragraph>
          Additionally, you can also <mark>upload</mark> schemas from a JSON
          file in the same drawer.
        </Typography.Paragraph>
      </Modal>
      <Drawer
        title="Saved schemas"
        open={listOpen}
        onClose={() => setListOpen(false)}
        width={600}
        footer={
          <Typography.Text type="secondary">
            The schemas displayed here are stored in your browser's local
            storage. They are preserved between sessions unless you wipe your
            browser's storage. Please <b>download</b> your schemas if you don't
            want to risk losing them.
          </Typography.Text>
        }
        placement="left"
        extra={
          <Space>
            <Tooltip title="Upload schema">
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  if (file.type != "application/json") {
                    message.error("The file format should be json");
                  }
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const newSchema = JSON.parse(
                      event?.target?.result as string,
                    );
                    const { schema, uiSchema } = newSchema;
                    if (schema && uiSchema) {
                      initFormuleSchema(newSchema);
                      saveLocalSchema();
                      message.success("Uploaded and loaded successfully");
                    } else {
                      message.error(
                        "Your json should include a schema and a uiSchema key",
                      );
                    }
                  };
                  reader.readAsText(file);
                  // Prevent POST upload
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />} />
              </Upload>
            </Tooltip>
            {localSchemas.length > 0 && (
              <Popconfirm
                title="Are you sure?"
                okType="danger"
                placement="right"
                onConfirm={() =>
                  localSchemas.map((s) => deleteLocalSchema(s.id))
                }
              >
                <Button danger icon={<DeleteOutlined />}>
                  Delete all
                </Button>
              </Popconfirm>
            )}
          </Space>
        }
      >
        <div style={{ marginBottom: 12 }}>
          <Typography.Text>
            Make sure you have <b>saved</b> your progress in the current schema
            before switching to another one!
          </Typography.Text>
        </div>
        <List
          dataSource={localSchemas}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Popconfirm
                  title={
                    <Typography.Paragraph>
                      Delete schema permanently?
                    </Typography.Paragraph>
                  }
                  okType="danger"
                  placement="right"
                  onConfirm={() => deleteLocalSchema(item.id)}
                >
                  <Button danger type="text" icon={<DeleteOutlined />} />
                </Popconfirm>,
                <Tooltip title="Download schema">
                  <Button
                    type="text"
                    onClick={() => handleDownload(item.id, item.value)}
                    icon={<DownloadOutlined />}
                  />
                </Tooltip>,
                <Button
                  type="primary"
                  ghost
                  icon={<FolderOpenOutlined />}
                  onClick={() => {
                    loadFromLocalStorage(item.id);
                    setListOpen(false);
                  }}
                >
                  Load
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={item.value.schema.title}
                description={item.value.schema.description}
              />
              <div>
                <Typography.Text type="secondary">
                  {item.value.id}
                </Typography.Text>
              </div>
            </List.Item>
          )}
        />
      </Drawer>
      <Layout style={{ height: "100%" }}>
        <Content style={{ overflowY: "scroll" }}>
          <FormuleContext
            theme={theme}
            synchronizeState={handleFormuleStateChange}
          >
            <Row style={{ height: "100%" }}>
              <Col
                xs={10}
                md={5}
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
                md={5}
                style={{
                  overflowX: "hidden",
                  padding: "0px 15px",
                  backgroundColor: "#F6F7F8",
                }}
              >
                <SchemaPreview hideSchemaKey={false} />
              </Col>
              <Col
                xs={24}
                md={14}
                style={{
                  overflowX: "hidden",
                  height: "100%",
                  padding: "0px 25px",
                }}
              >
                <FormPreview liveValidate={true} hideAnchors={false} />
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
      <Tooltip
        title="Unsaved changes"
        placement="right"
        open={!openFloatButtons && hasUnsavedChanges}
      >
        <FloatButton.Group
          shape="square"
          style={{ insetInlineStart: 16 }}
          trigger="click"
          open={openFloatButtons}
          onClick={() => setOpenFloatButtons(!openFloatButtons)}
          icon={<ToolOutlined />}
          closeIcon={<DownOutlined />}
          type="primary"
          badge={
            !openFloatButtons && hasUnsavedChanges
              ? {
                  dot: true,
                  color: "firebrick",
                }
              : undefined
          }
          data-cy="floatButtons"
        >
          {hasUnsavedChanges &&
            localSchemas.some((s) => s.id === formuleState?.id) && (
              <Popconfirm
                title={
                  <Typography.Paragraph>
                    Revert and discard the current changes?
                  </Typography.Paragraph>
                }
                okType="danger"
                placement="right"
                onConfirm={() => {
                  loadFromLocalStorage(formuleState?.id ?? "");
                }}
              >
                <FloatButton
                  icon={<RollbackOutlined />}
                  tooltip="Revert changes (reload save)"
                />
              </Popconfirm>
            )}
          <Popconfirm
            title={
              <Typography.Paragraph>
                You will lose the current changes
              </Typography.Paragraph>
            }
            okType="danger"
            placement="right"
            onConfirm={() => initFormuleSchema()}
          >
            <FloatButton icon={<FileAddOutlined />} tooltip="New schema" />
          </Popconfirm>
          <FloatButton
            onClick={() => saveLocalSchema()}
            icon={justSaved ? <CheckOutlined /> : <SaveOutlined />}
            style={
              justSaved
                ? { backgroundColor: theme.token.colorPrimary }
                : undefined
            }
            badge={
              hasUnsavedChanges
                ? {
                    dot: true,
                    color: theme.token.colorPrimary,
                  }
                : undefined
            }
            tooltip="Save schema to local repository [ctrl+s]"
          />
          <FloatButton
            onClick={() => setListOpen(true)}
            icon={<FolderOpenOutlined />}
            badge={{
              count: localSchemas.length,
              style: { borderRadius: theme.token.borderRadius },
              color: theme.token.colorPrimary,
              size: "small",
            }}
            tooltip="Load schema from local repository"
          />
          <FloatButton
            onClick={() => setViewerOpen(true)}
            icon={<FileTextOutlined />}
            tooltip="View generated schemas"
          />
          <FloatButton
            onClick={() => setHelpOpen(true)}
            icon={<InfoCircleOutlined />}
            tooltip="Information"
          />
        </FloatButton.Group>
      </Tooltip>
    </>
  );
}

export default App;
