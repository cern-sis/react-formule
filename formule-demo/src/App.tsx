import Icon, {
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
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  Drawer,
  Grid,
  Image,
  Layout,
  List,
  Menu,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Tag,
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
  AiChatFooter,
  getFormuleState,
} from "react-formule";
import { theme } from "./theme";
import formuleLogo from "./assets/logo.png";
import SparklesIcon from "./assets/sparkles.svg?react";

import "./style.css";

const { Content, Footer } = Layout;
const { useBreakpoint } = Grid;

const App = () => {
  const [formuleState, setFormuleState] = useState<SchemaWizardState>();
  const [localSchemas, setLocalSchemas] = useState(getAllFromLocalStorage());
  const [viewerOpen, setViewerOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [aiFooterOpen, setAiFooterOpen] = useState(() => {
    const storedAIState = localStorage.getItem("aiFooterOpen");
    return storedAIState ? JSON.parse(storedAIState) : true;
  });

  const screens = useBreakpoint();
  const [menuHidden, setMenuHidden] = useState(screens.md);

  useEffect(() => {
    localStorage.setItem("aiFooterOpen", JSON.stringify(aiFooterOpen));
  }, [aiFooterOpen]);

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
      }, 1000);
    });
  };

  return (
    <FormuleContext theme={theme} synchronizeState={handleFormuleStateChange}>
      <Layout hasSider style={{ height: "100vh" }}>
        <Layout.Sider
          hidden={menuHidden}
          width={200}
          collapsedWidth={64}
          collapsed
          theme="light"
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 500,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "15px 6px",
            }}
          >
            <Image
              src={formuleLogo}
              alt="Logo"
              preview={false}
              style={{ maxWidth: "120px" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "calc(100% - 80px)",
              overflow: "auto",
            }}
          >
            <Menu
              selectable={false}
              selectedKeys={[
                aiFooterOpen ? "ai" : "",
                drawerOpen ? "load" : "",
                viewerOpen ? "view" : "",
                helpOpen ? "help" : "",
              ]}
              mode="inline"
              style={{ borderRight: "none", flex: "auto" }}
              items={[
                hasUnsavedChanges &&
                localSchemas.some((s) => s.id === formuleState?.id)
                  ? {
                      key: "revert",
                      label: (
                        <Popconfirm
                          title={
                            <Typography.Paragraph>
                              Revert and discard the current changes?
                            </Typography.Paragraph>
                          }
                          okType="danger"
                          placement="right"
                          align={{ offset: [-65, 0] }}
                          onConfirm={() =>
                            loadFromLocalStorage(formuleState?.id ?? "")
                          }
                        >
                          <RollbackOutlined />
                          <span>Revert Changes</span>
                        </Popconfirm>
                      ),
                    }
                  : null,
                {
                  key: "new",
                  label: (
                    <Popconfirm
                      title={
                        <Typography.Paragraph>
                          You will lose the current changes
                        </Typography.Paragraph>
                      }
                      okType="danger"
                      placement="right"
                      align={{ offset: [-49, 0] }}
                      onConfirm={() => initFormuleSchema()}
                    >
                      <FileAddOutlined />
                      <span>New Schema</span>
                    </Popconfirm>
                  ),
                },
                {
                  key: "save",
                  icon: (
                    <Badge
                      dot={hasUnsavedChanges}
                      color={theme.token.colorPrimary}
                      offset={[6, 8]}
                    >
                      {justSaved ? (
                        <CheckOutlined
                          style={{ color: theme.token.colorPrimary }}
                        />
                      ) : (
                        <SaveOutlined />
                      )}
                    </Badge>
                  ),
                  label: "Save Schema",
                  onClick: !justSaved ? () => saveLocalSchema() : undefined,
                },
                {
                  key: "load",
                  icon: (
                    <Badge
                      count={localSchemas.length}
                      style={{ borderRadius: theme.token.borderRadius }}
                      color={theme.token.colorPrimary}
                      size="small"
                      offset={[6, 8]}
                    >
                      <FolderOpenOutlined />
                    </Badge>
                  ),
                  label: "Load Schema",
                  onClick: () => setDrawerOpen(!drawerOpen),
                },
                {
                  key: "view",
                  icon: <FileTextOutlined />,
                  label: "View Schema",
                  onClick: () => setViewerOpen(true),
                },
                {
                  key: "ai",
                  icon: (
                    <Icon
                      component={SparklesIcon}
                      style={{ fontSize: "18px" }}
                    />
                  ),
                  style: { padding: "2px 19px 0 19px" },
                  label: (
                    <span>
                      Formule AI
                      <Tag
                        color="blue"
                        bordered={false}
                        style={{
                          padding: "0 4px",
                          fontSize: "12px",
                          lineHeight: "14px",
                          marginLeft: "10px",
                          borderRadius: 0,
                        }}
                      >
                        Beta
                      </Tag>
                    </span>
                  ),
                  onClick: () => setAiFooterOpen(!aiFooterOpen),
                },
              ]}
            />
            <Menu
              selectable={false}
              mode="inline"
              style={{ borderRight: "none" }}
              items={[
                {
                  key: "help",
                  icon: <InfoCircleOutlined />,
                  label: "Information",
                  onClick: () => setHelpOpen(true),
                },
                {
                  style: { display: screens.md ? "none" : undefined },
                  key: "close",
                  icon: <CloseOutlined />,
                  label: "Close menu",
                  onClick: () => setMenuHidden(!menuHidden),
                },
              ]}
            />
          </div>
        </Layout.Sider>
        <Layout style={{ marginInlineStart: !menuHidden ? 64 : 0 }}>
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
                  value={JSON.stringify(
                    formuleState?.current.uiSchema,
                    null,
                    2,
                  )}
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
                  value={JSON.stringify(getFormuleState().formData, null, 2)}
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
              The state of the current form is <b>saved automatically</b> on
              change. However, this should simply be taken as a security measure
              to prevent your from accidentally losing data, as changes are not
              autosaved into your local schemas repository.
            </Typography.Paragraph>
            <Typography.Paragraph>
              If you want to persist the local changes to your schema in your
              local repository (local storage) you can{" "}
              <b>click on the save button or press [ctrl+s]</b> (your saved
              schema won't be updated with the latest changes until you do
              this). You can switch between schemas and load them later on. You
              can tell when you have unsaved changes by looking at the{" "}
              <b>blue dot</b> on the save button. You can also revert unsaved
              changes by clicking on the corresponding button.
            </Typography.Paragraph>
            <Typography.Paragraph>
              You are encouraged to <b>download</b> any important data as a JSON
              file for more safety in case your browser's storage gets wiped.
              You can do so from the "Saved Schemas" drawer.
            </Typography.Paragraph>
            <Typography.Paragraph>
              Additionally, you can also <b>upload</b> schemas from a JSON file
              in the same drawer.
            </Typography.Paragraph>
          </Modal>
          <Drawer
            title="Saved schemas"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            width={600}
            style={{ marginLeft: "64px" }}
            footer={
              <Typography.Text type="secondary">
                The schemas displayed here are stored in your browser's local
                storage. They are preserved between sessions unless you wipe
                your browser's storage. Please <b>download</b> your schemas if
                you don't want to risk losing them.
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
                Make sure you have <b>saved</b> your progress in the current
                schema before switching to another one!
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
                        setDrawerOpen(false);
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
          <Content
            style={{
              overflowY: "scroll",
              scrollSnapType: screens.md ? "none" : "y mandatory",
            }}
          >
            <Row style={{ height: "100%" }}>
              <Col
                xs={10}
                md={5}
                style={{
                  overflowX: "hidden",
                  height: "100%",
                  display: "flex",
                  scrollSnapAlign: screens.md ? "none" : "start",
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
                  scrollSnapAlign: screens.md ? "none" : "start",
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
                  scrollSnapAlign: screens.md ? "none" : "start",
                }}
              >
                <FormPreview liveValidate={true} hideAnchors={false} />
              </Col>
            </Row>
          </Content>
          <Footer style={{ padding: 0 }}>
            {aiFooterOpen && <AiChatFooter />}
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
        {!screens.md && menuHidden && (
          <Tooltip title="Open menu">
            <Button
              style={{
                position: "fixed",
                top: 10,
                right: 10,
                zIndex: 1000,
              }}
              icon={menuHidden ? <MenuOutlined /> : <CloseOutlined />}
              onClick={() => setMenuHidden(!menuHidden)}
            />
          </Tooltip>
        )}
      </Layout>
    </FormuleContext>
  );
};

export default App;
