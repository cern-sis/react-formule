import { useState, useEffect, useContext, useMemo } from "react";
import { Modal, Form, Select, Input, message, Switch } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import CustomizationContext from "../contexts/CustomizationContext";
import { AIProvider } from "../types";

type AiSettingsDialogProps = {
  visible: boolean;
  onClose: () => void;
  hideVibeMode?: boolean;
};

const AiSettingsDialog = ({
  visible,
  onClose,
  hideVibeMode,
}: AiSettingsDialogProps) => {
  const [form] = Form.useForm();
  const [availableModels, setAvailableModels] = useState<
    { id: string; name: string }[]
  >([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>();

  const customizationContext = useContext(CustomizationContext);
  const providers = customizationContext.ai.providers;

  useEffect(() => {
    const localAiSettings = JSON.parse(
      localStorage.getItem("aiSettings") || "{}",
    );

    const providerName = localAiSettings.provider;
    const provider = providers[providerName];

    if (provider) {
      setSelectedProvider(provider);

      const formValues = {
        ...localAiSettings,
        apiKey: provider?.apiKey ? undefined : localAiSettings.apiKey,
        model: provider?.model ? undefined : localAiSettings.model,
      };

      form.setFieldsValue(formValues);

      if (providerName && !provider?.model && provider?.fetchModels) {
        debouncedFetchModels(providerName);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedFetchModels = useMemo(
    () =>
      debounce(async (providerName: string) => {
        setLoadingModels(true);
        try {
          const provider = providers[providerName];
          const apiKey = provider?.apiKey || form.getFieldValue("apiKey");
          if (!apiKey) {
            message.warning("Please provide an API key to fetch models.");
            setLoadingModels(false);
            return;
          }
          const models = await provider.fetchModels!(apiKey);
          setAvailableModels(models);

          if (
            provider.recommendedModel?.id &&
            models.some((model) => model.id === provider.recommendedModel?.id)
          ) {
            form.setFieldValue("model", provider.recommendedModel.id);
          }
        } catch (error) {
          message.error(
            `Failed to fetch models: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          );
          setAvailableModels([]);
        } finally {
          setLoadingModels(false);
        }
      }, 500),
    [providers, form],
  );

  useEffect(() => {
    return () => {
      debouncedFetchModels.cancel();
    };
  }, [debouncedFetchModels]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const provider = providers[values.provider];

      localStorage.setItem(
        "aiSettings",
        JSON.stringify({
          ...values,
          model: provider?.model ? undefined : values.model,
          apiKey: provider?.apiKey ? undefined : values.apiKey,
        }),
      );
      message.success("AI settings saved!");
      onClose();
    } catch (errorInfo) {
      message.error(
        "Failed to save AI settings. Please fill in all required fields.",
      );
    }
  };

  const handleProviderChange = (value) => {
    const provider = providers[value];
    setAvailableModels([]);
    setSelectedProvider(provider);
    form.setFieldsValue({ apiKey: undefined, model: undefined });
    debouncedFetchModels.cancel();

    !provider?.model && debouncedFetchModels(value);
  };

  const handleApiKeyChange = () => {
    const provider = form.getFieldValue("provider");
    provider && !providers[provider]?.model && debouncedFetchModels(provider);
  };

  return (
    <Modal
      title="FormuleAI API Settings"
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Save"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="provider"
          label="Provider"
          rules={[{ required: true, message: "Please select a provider" }]}
        >
          <Select
            onChange={handleProviderChange}
            options={Object.entries(providers).map(([key, provider]) => ({
              value: key,
              label: provider.label,
            }))}
          />
        </Form.Item>
        {selectedProvider && !selectedProvider?.apiKey && (
          <Form.Item
            name="apiKey"
            label="API Key"
            rules={[{ required: true, message: "Please input your API Key" }]}
          >
            <Input.Password onChange={handleApiKeyChange} />
          </Form.Item>
        )}
        {selectedProvider && !selectedProvider?.model && (
          <Form.Item
            name="model"
            label="Model"
            rules={[{ required: true, message: "Please select a model" }]}
            extra={
              selectedProvider?.recommendedModel?.name &&
              `Recommended: ${selectedProvider.recommendedModel?.name}`
            }
          >
            <Select
              loading={loadingModels}
              disabled={availableModels.length === 0}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={availableModels.map((model) => ({
                value: model.id,
                label: model.name,
                key: model.id,
              }))}
            />
          </Form.Item>
        )}
        {!hideVibeMode && (
          <Form.Item
            name="vibeMode"
            label="Vibe Mode"
            tooltip={{
              title:
                "Vibe Mode applies the changes automatically to the schema, without the need for a manual review. Use at your own risk.",
              placement: "right",
              icon: <WarningOutlined />,
            }}
          >
            <Switch defaultChecked={false} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default AiSettingsDialog;
