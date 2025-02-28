import { GoogleOutlined, OpenAIOutlined } from "@ant-design/icons";
import { AIProvider } from "../types";

export const defaultGenerationPrompt = `
## Role
You are an advanced assistant for a form builder application based on RJSF and JSON Schema draft 07. Your task is to analyze user requests and generate the corresponding JSON schema and UI schema in a single step.

## Input Format
- \`<FORM>\`: Contains the current state of the schema and uiSchema (both JSON objects) for reference.
- \`<SPEC>\`: Contains a comprehensive list of available field types with their specifications.
- \`<REQ>\`: Contains the user's request for creating or modifying the form.

## Response Format
You MUST respond with a JSON object containing the \`schema\` and \`uiSchema\`, structured as follows:

{
  "schema": {},
  "uiSchema": {}
}

- If the request is irrelevant or cannot be fulfilled, respond with a JSON object containing an \`error\` field:

{
  "error": "Explanation of why the request could not be fulfilled"
}

- The response MUST be a **plain JSON object** without any additional text, formatting, or code blocks.

## Process
1. **Field Type Detection**: Analyze \`<REQ>\` to identify the necessary field types.
2. **Schema Generation**: Generate the \`schema\` and \`uiSchema\` based on the detected field types and user request, using the specifications in \`<SPEC>\`.

## Rules
- Only include fields and properties explicitly requested in \`<REQ>\` and defined in \`<SPEC>\`.
- Follow the structure and properties defined in \`<SPEC>\` strictly. Be careful to not mix things up between different field types.
- If a field type or property is not in \`<SPEC>\`, exclude it entirely. 
- Note that not all field types require a \`ui:widget\` or \`ui:field\` property (e.g. number or integer fields don't), only include them if they are explicitly specified in the defaults in \`<SPEC>\` for that field type.
- If the request is ambiguous or cannot be fulfilled, provide an \`error\` object.
- Do not include standard JSON Schema properties or RJSF extensions unless explicitly listed in \`<SPEC>\`.
- Always keep or use a standard object as form root.

## Available Field Types
<SPEC>

## Example

**Input**:
<REQ>Create a form with a text field for the name and an email field that is required</REQ>

**Response**:
{
  "schema": {
    "title": "New Form",
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "title": "Name"
      },
      "email": {
        "type": "string",
        "title": "Email"
      }
    },
    "required": ["email"]
  },
  "uiSchema": {
    "name": {
      "ui:widget": "text"
    },
    "email": {
      "ui:widget": "text"
    }
  }
}
`;

export const defaultProviders: Record<string, AIProvider> = {
  openai: {
    label: (
      <span>
        <OpenAIOutlined /> OpenAI
      </span>
    ),
    recommendedModel: { id: "gpt-4.1-mini", name: "gpt-4.1-mini" },
    fetchModels: async (apiKey) => {
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message ||
            `Failed to fetch models: ${response.status} ${response.statusText}`,
        );
      }

      return data.data
        .filter(
          (model: { id: string; created: number }) =>
            /^(gpt-|o\d)/.test(model.id) &&
            !/(audio|search|image|vision)/.test(model.id),
        )
        .sort(
          (a: { created: number }, b: { created: number }) =>
            b.created - a.created,
        )
        .map((model: { id: string; created: number }) => ({
          id: model.id,
          name: model.id,
        }));
    },
    generateSchema: async (
      prompt,
      currentSchema,
      fieldTypes,
      apiKey,
      model,
    ) => {
      if (!apiKey || !model) {
        return {
          error: "API Key or Model not found. Please configure LLM settings.",
        };
      }

      const formJson = JSON.stringify(currentSchema, null, 0);
      const specsJson = JSON.stringify(fieldTypes, null, 0);
      const userContent = `<FORM>${formJson}</FORM><SPEC>${specsJson}</SPEC><REQ>${prompt}</REQ>`;

      try {
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: model,
              messages: [
                {
                  role: "system",
                  content: defaultGenerationPrompt,
                },
                {
                  role: "user",
                  content: userContent,
                },
              ],
              response_format: { type: "json_object" },
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          return {
            error: `API Error ${response.status}: ${
              data.error?.message || response.statusText
            }`,
          };
        }

        const content = JSON.parse(data.choices[0].message.content);
        const openAIUsage = data.usage;
        const usage = {
          prompt: openAIUsage.prompt_tokens,
          completion: openAIUsage.completion_tokens,
          total: openAIUsage.total_tokens,
          cached: openAIUsage.prompt_tokens_details?.cached_tokens,
        };

        if (content.error) {
          return {
            error: content.error,
            usage,
          };
        }

        return {
          schema: content.schema,
          uiSchema: content.uiSchema,
          usage,
        };
      } catch (error) {
        return {
          error: `Failed to generate schema: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        };
      }
    },
  },
  gemini: {
    label: (
      <span>
        <GoogleOutlined /> Gemini
      </span>
    ),
    recommendedModel: {
      id: "models/gemini-2.0-flash",
      name: "Gemini 2.0 Flash",
    },
    fetchModels: async (apiKey) => {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message ||
            `Failed to fetch models: ${response.status} ${response.statusText}`,
        );
      }

      return data.models
        .filter(
          (model) =>
            model.supportedGenerationMethods.includes("generateContent") &&
            /^models\/(gemini-|gemma-)/.test(model.name) &&
            !/(audio|search|image|vision)/.test(model.name),
        )
        .sort((a, b) => b.name.localeCompare(a.name))
        .map((model) => ({ id: model.name, name: model.displayName }));
    },
    generateSchema: async (
      prompt,
      currentSchema,
      fieldTypes,
      apiKey,
      model,
    ) => {
      if (!apiKey || !model) {
        return {
          error: "API Key or Model not found. Please configure LLM settings.",
        };
      }

      const formJson = JSON.stringify(currentSchema, null, 0);
      const specsJson = JSON.stringify(fieldTypes, null, 0);
      const userContent = `<FORM>${formJson}</FORM><SPEC>${specsJson}</SPEC><REQ>${prompt}</REQ>`;

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `${defaultGenerationPrompt}\n\nUSER REQUEST:\n\n${userContent}`,
                    },
                  ],
                },
              ],
              generationConfig: {
                responseMimeType: "application/json",
              },
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          return {
            error: `API Error ${response.status}: ${
              data.error?.message || response.statusText
            }`,
          };
        }

        const content = JSON.parse(data.candidates[0].content.parts[0].text);
        const geminiUsage = data.usageMetadata;
        const usage = {
          prompt: geminiUsage.promptTokenCount,
          completion: geminiUsage.candidatesTokenCount,
          total: geminiUsage.totalTokenCount,
        };

        if (content.error) {
          return {
            error: content.error,
            usage,
          };
        }

        return {
          schema: content.schema,
          uiSchema: content.uiSchema,
          usage,
        };
      } catch (error) {
        return {
          error: `Failed to generate schema: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        };
      }
    },
  },
};
