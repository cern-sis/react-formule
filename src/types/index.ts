import { ReactNode } from "react";
import { ThemeConfig } from "antd";
import { SchemaWizardState } from "../store/schemaWizard";

export type CustomFunctions = {
  file?: {
    /**
     * Function to fetch a file based on a file UID. Formule will call this function with
     * each of the file UIDs in a Files field's formData to initialize it with the files
     * fetched from the URL returned by this function.
     * @param uid The UID of the file to fetch
     * @returns An object URL for the file which can be a promise. This can be:
     *      - Simply a url to your backend, requiring no processing from your side
     *      - If you have a more complex use case, where you need to configure authentication,
     *          etc, you can instead fetch the file inside this function using your custom logic
     *          and then create and return an object URL with URL.createObjectURL()
     */
    fetchFile: (uid: string) => string | Promise<string>;
  };
};

export type TokenUsage = {
  prompt: number;
  completion: number;
  total: number;
  cached?: number;
};

export type AISuggestion = {
  schema: object;
  uiSchema: object;
  usage?: TokenUsage;
};

export type AIError = {
  error: string;
  usage?: TokenUsage;
};

export type AIResponse = AISuggestion | AIError;

/**
 * Configuration for an AI Provider. New providers will override the defaults.
 * If you want to add a new provider while keeping the defaults, you can import
 * and include `...defaultProviders`.
 */
export type AIProvider = {
  /** Label for the AI provider in the UI */
  label: ReactNode;

  /**
   * Optional provider API key. If not provided here, you should request it from the user,
   * for example using the `AiSettingsDialog` component.
   */
  apiKey?: string;

  /**
   * Optional model identifier. If not provided, you need to pass a
   * `fetchModels` function to be called by `AiSettingsDialog`.
   */
  model?: string;

  /** Show this model as a recommended default in the `AiSettingsDialog` panel.
   * If not provided, no model will be recommended.
   */
  recommendedModel?: { id: string; name: string };

  /**
   * Function to retrieve available models (used in the AiSettingsDialog component).
   * Not needed when the api key and model are provided directly.
   * @param apiKey - Provider API key
   * @returns Promise containing an array of available models with their IDs and display names
   */
  fetchModels?: (apiKey: string) => Promise<{ id: string; name: string }[]>;

  /**
   * Main function to generate schema modifications. You must use your own system prompt.
   * @param prompt - User prompt
   * @param currentSchema - Current form state (schema and uiSchema)
   * @param fieldTypes - Field type specification
   * @param apiKey - Provider API key
   * @param model - Model identifier to use
   * @returns Promise containing the generated schema (or otherwise error) with optional token usage information
   */
  generateSchema: (
    prompt: string,
    currentSchema: object,
    fieldTypes: object,
    apiKey: string,
    model: string,
  ) => Promise<AIResponse>;
};

export type AIConfig = {
  providers: {
    [key: string]: AIProvider;
  };
};

export type FormuleContextProps = {
  children: ReactNode;
  customFieldTypes?: object;
  customFields?: object;
  customWidgets?: object;
  customPublishedFields?: object;
  customPublishedWidgets?: object;
  customFunctions?: CustomFunctions;
  theme?: ThemeConfig;
  separator?: string;
  errorBoundary?: ReactNode;
  synchronizeState?: (state: SchemaWizardState) => void;
  transformSchema?: (schema: object) => object;
  ai?: AIConfig;
};

export type CustomizationContextProps = Omit<
  FormuleContextProps,
  "children" | "customFieldTypes" | "synchronizeState" | "theme"
> & {
  allFieldTypes: object;
  separator: string;
  transformSchema: (schema: object) => object;
  ai: AIConfig;
};
