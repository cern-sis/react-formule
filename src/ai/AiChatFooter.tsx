import { useState, useEffect, useCallback } from "react";
import {
  Alert,
  Button,
  Col,
  Input,
  Popover,
  Row,
  Space,
  Tag,
  theme,
  Typography,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
  SendOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  InfoOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateByPath } from "../store/schemaWizard";
import Ajv from "ajv";
import { useGenerateSchema, useGetProvider } from "./hooks";
import { AISuggestion, TokenUsage } from "../types";
import { SchemaWizardState } from "../store/schemaWizard";
import AiSettingsDialog from "./AiSettingsDialog";
import AiDiff from "./AiDiff";

const { TextArea } = Input;
const ajv = new Ajv();

type AiChatFooterProps = {
  onApply?: () => void;
  onReject?: () => void;
  hideHelp?: boolean;
  hideSettings?: boolean;
  vibeMode?: boolean;
};

const AiChatFooter = ({
  onApply,
  onReject,
  hideHelp,
  hideSettings,
  vibeMode,
}: AiChatFooterProps) => {
  const fullSchema = useSelector(
    (state: { schemaWizard: SchemaWizardState }) => state.schemaWizard.current,
  );
  const { schema: currentSchema, uiSchema: currentUiSchema } = fullSchema;
  const dispatch = useDispatch();

  const { token } = theme.useToken();

  const generateSchema = useGenerateSchema();
  const provider = useGetProvider();

  const [prompt, setPrompt] = useState("");
  const [suggestion, setSuggestion] = useState<AISuggestion>();
  const [tokenUsage, setTokenUsage] = useState<TokenUsage>();
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [successGlow, setSuccessGlow] = useState(false);

  const [aiSettingsVisible, setAiSettingsVisible] = useState(false);
  const [aiSettingsMounted, setAiSettingsMounted] = useState(false);
  const [schemaDiffVisible, setSchemaDiffVisible] = useState(false);

  const settingsVibeMode =
    vibeMode ??
    JSON.parse(localStorage.getItem("aiSettings") || "{}")?.vibeMode;

  const applyChanges = useCallback(() => {
    dispatch(updateByPath({ value: suggestion }));
    resetState();
    setSuccessGlow(true);
    setPrompt("");
    setTimeout(() => setSuccessGlow(false), 1000);
    onApply?.();
  }, [dispatch, onApply, suggestion]);

  useEffect(() => {
    if (suggestion && settingsVibeMode) {
      applyChanges();
    } else if (suggestion) {
      setSchemaDiffVisible(true);
    }
  }, [applyChanges, suggestion, settingsVibeMode]);

  const resetState = () => {
    setSchemaDiffVisible(false);
    setSuggestion(undefined);
    setError("");
    setTokenUsage(undefined);
  };

  const rejectChanges = () => {
    resetState();
    onReject?.();
  };

  const getCompletion = async () => {
    if (prompt) {
      try {
        setLoading(true);
        resetState();

        const response = await generateSchema(prompt, fullSchema);

        if ("error" in response) {
          setError(response.error);
          response.usage && setTokenUsage(response.usage);
        } else {
          const { usage, schema, uiSchema } = response;
          usage && setTokenUsage(response.usage);

          const sugg = { schema, uiSchema };
          if (!ajv.validateSchema(sugg)) {
            setError(
              "The returned schema is not valid. Please try generating it again or refining your request.",
            );
          } else {
            setSuggestion(sugg);
          }
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOpenAiSettings = () => {
    setAiSettingsMounted(true);
    setAiSettingsVisible(true);
  };

  const handleCloseAiSettings = () => {
    setAiSettingsVisible(false);
    // Delay unmounting to allow for closing transition
    setTimeout(() => {
      setAiSettingsMounted(false);
    }, 300);
  };

  const KeyboardKeyTag = ({ children }) => (
    <Tag bordered={false} color="blue" style={{ margin: 0 }}>
      {children}
    </Tag>
  );

  return (
    <Space direction="vertical" style={{ width: "100%", padding: "15px 25px" }}>
      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
          closable
          onClose={() => setError("")}
          style={{ margin: "0", height: "100%" }}
        />
      )}
      <Row gutter={8}>
        <Col>
          {!hideSettings && (
            <Button
              size="large"
              type="text"
              icon={<SettingOutlined />}
              onClick={handleOpenAiSettings}
            />
          )}
          {!hideHelp && (
            <Popover
              placement="topRight"
              content={
                <Space
                  direction="vertical"
                  style={{
                    overflowY: "scroll",
                    maxHeight: "50vh",
                    maxWidth: 400,
                  }}
                >
                  <Typography.Text>
                    1. In settings, select a provider and paste your API key,
                    then select a model
                  </Typography.Text>
                  <Typography.Text>
                    2. Ask FormuleAI to create a form, add or remove fields or
                    modify any existing schema
                  </Typography.Text>
                  <Typography.Text>
                    3. Review the generated JSON schemas and apply or reject the
                    changes
                  </Typography.Text>
                  <Typography.Text>
                    If you want to apply changes automatically, without the need
                    of a manual review, you can enable the Vibe Mode in the
                    settings. Use under your own risk!
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    <strong>Note:</strong> FormuleAI does not keep context
                    between requests at the moment, so make sure to always
                    specify which fields you want to perform further actions on
                    if needed.
                  </Typography.Text>
                  <Typography.Text>Example prompts:</Typography.Text>
                  {[
                    "Create a form with a text field for the name and an email field that is required",
                    "Add a date picker field and a select field with options: Low, Medium, High",
                    "Create an object titled 'Contact Info' with phone and address fields",
                    "Create a form with two fields: one radio field with the options 'A' and 'B' that is required and one text field which is readonly and with the title 'This field is readonly'",
                  ].map((text, idx) => (
                    <Button
                      key={idx}
                      type="link"
                      onClick={() => setPrompt(text)}
                      className="aiExamples"
                      style={{
                        whiteSpace: "normal",
                        height: "auto",
                        textAlign: "left",
                      }}
                    >
                      {text}
                    </Button>
                  ))}
                </Space>
              }
              title="FormuleAI Quickstart Guide"
              trigger="click"
            >
              <Button
                size="large"
                type="text"
                icon={<QuestionCircleOutlined />}
              />
            </Popover>
          )}
        </Col>
        <Col flex="auto">
          <div style={{ position: "relative" }}>
            <TextArea
              size="large"
              autoSize={{ maxRows: 5 }}
              placeholder={
                !provider
                  ? "Please select first a provider and model in the settings at the left"
                  : "Ask FormuleAI to modify the schema or create a form"
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && e.metaKey && getCompletion()
              }
              className="gradientBorder"
              disabled={!provider || loading}
              style={{
                boxShadow: successGlow
                  ? `0 0 10px 2px ${token.colorSuccess}`
                  : "none",
              }}
            />
            {tokenUsage && (
              <Popover
                title="Token Usage"
                content={
                  <Space direction="vertical" size="small">
                    {tokenUsage?.prompt && (
                      <Typography.Text>
                        Prompt Tokens: {tokenUsage.prompt}
                        {!!tokenUsage.cached &&
                          ` (${tokenUsage.cached} cached)`}
                      </Typography.Text>
                    )}
                    {tokenUsage?.completion && (
                      <Typography.Text>
                        Completion Tokens: {tokenUsage.completion}
                      </Typography.Text>
                    )}
                    {tokenUsage?.total && (
                      <Typography.Text>
                        <strong>Total Tokens:</strong> {tokenUsage.total}
                      </Typography.Text>
                    )}
                  </Space>
                }
                trigger="click"
              >
                {provider && (
                  <Button
                    color="default"
                    variant="text"
                    icon={<InfoOutlined />}
                    style={{
                      color: token.colorTextSecondary,
                      position: "absolute",
                      right: prompt ? 38 : 5,
                      top: 5,
                    }}
                  />
                )}
              </Popover>
            )}
            {prompt && !loading && (
              <Button
                color="default"
                variant="text"
                icon={<CloseOutlined />}
                onClick={() => setPrompt("")}
                style={{
                  color: token.colorTextSecondary,
                  position: "absolute",
                  right: 5,
                  top: 5,
                }}
              />
            )}
          </div>
        </Col>
        <Col>
          <Space>
            {suggestion && !loading && (
              <>
                <Button
                  color="red"
                  variant="filled"
                  onClick={rejectChanges}
                  style={{
                    flexDirection: "column",
                    height: "auto",
                    padding: "4px",
                    rowGap: "0px",
                  }}
                >
                  <CloseOutlined />
                  Reject
                </Button>
                <Popover
                  content={
                    <AiDiff
                      currentSchema={currentSchema}
                      currentUiSchema={currentUiSchema}
                      suggestion={suggestion}
                    />
                  }
                  open={schemaDiffVisible}
                  onOpenChange={(visible) => setSchemaDiffVisible(visible)}
                  trigger="click"
                  placement="topLeft"
                >
                  <Button
                    color="blue"
                    variant="filled"
                    onClick={() => setSchemaDiffVisible(!schemaDiffVisible)}
                    style={{
                      flexDirection: "column",
                      height: "auto",
                      padding: "4px",
                      rowGap: "0px",
                    }}
                  >
                    <InfoCircleOutlined />
                    View
                  </Button>
                </Popover>
                <Button
                  color="green"
                  variant="filled"
                  onClick={applyChanges}
                  style={{
                    flexDirection: "column",
                    height: "auto",
                    padding: "4px",
                    rowGap: "0px",
                  }}
                >
                  <CheckOutlined />
                  Apply
                </Button>
              </>
            )}
            <Button
              size="large"
              variant="solid"
              icon={loading ? <LoadingOutlined spin /> : <SendOutlined />}
              onClick={getCompletion}
              color="purple"
              disabled={!provider || loading || !prompt}
            />
          </Space>
        </Col>
      </Row>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Typography.Text type="secondary">
          <KeyboardKeyTag>CTRL</KeyboardKeyTag> /{" "}
          <KeyboardKeyTag>⌘</KeyboardKeyTag> +{" "}
          <KeyboardKeyTag>Enter</KeyboardKeyTag> to send messages.
        </Typography.Text>
        <Typography.Text type="secondary">
          Please review the generated JSON schemas before applying the changes.
        </Typography.Text>
      </Space>
      {aiSettingsMounted && (
        <AiSettingsDialog
          visible={aiSettingsVisible}
          onClose={handleCloseAiSettings}
          hideVibeMode={vibeMode !== undefined}
        />
      )}
    </Space>
  );
};

export default AiChatFooter;
