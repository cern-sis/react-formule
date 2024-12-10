import {
  AimOutlined,
  AppstoreOutlined,
  BorderHorizontalOutlined,
  BorderTopOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  CloudDownloadOutlined,
  CodeOutlined,
  AlignCenterOutlined,
  FontSizeOutlined,
  LayoutOutlined,
  LinkOutlined,
  NumberOutlined,
  SwapOutlined,
  TagOutlined,
  UnorderedListOutlined,
  FieldNumberOutlined,
  FileMarkdownOutlined,
  NodeIndexOutlined,
} from "@ant-design/icons";
import { placeholder } from "@codemirror/view";

// COMMON / EXTRA PROPERTIES:

export const common = {
  optionsSchema: {
    title: {
      type: "string",
      title: "Title",
      description: "Provide a title to be displayed for your field",
    },
    description: {
      title: "Description",
      type: "string",
      description: "Provide a description to be displayed for your field",
    },
  },
  optionsUiSchema: {
    type: "object",
    title: "UI Schema",
    properties: {
      "ui:options": {
        type: "object",
        title: "UI Options",
        properties: {
          span: {
            title: "Field Width",
            type: "integer",
            defaultValue: 24,
            values: [6, 8, 12, 16, 18, 24],
            labels: ["25%", "33%", "50%", "66%", "75%", "100%"],
          },
          showAsModal: {
            title: "Display as Modal",
            type: "boolean",
          },
        },
        // Using dependencies here instead of if-then-else simplifies reusing the common properties
        dependencies: {
          showAsModal: {
            oneOf: [
              {
                properties: {
                  showAsModal: {
                    enum: [false],
                  },
                },
              },
              {
                properties: {
                  showAsModal: {
                    enum: [true],
                  },
                  modal: {
                    title: "Modal settings",
                    type: "object",
                    properties: {
                      buttonText: { title: "Button title", type: "string" },
                      modalWidth: { title: "Modal width", type: "integer" },
                      buttonInNewLine: {
                        title: "Button in new line",
                        type: "boolean",
                      },
                    },
                  },
                },
              },
            ],
            required: ["modal"],
          },
        },
      },
      "ui:label": {
        title: "Show label",
        type: "boolean",
        default: true,
      },
    },
  },
  optionsUiSchemaUiSchema: {
    "ui:options": {
      span: {
        "ui:widget": "slider",
      },
      modal: {
        "ui:options": {
          showAsModal: true,
          modal: {
            buttonInNewLine: true,
          },
        },
      },
      showAsModal: {
        "ui:widget": "switch",
      },
      "ui:order": ["showAsModal", "modal", "*"],
    },
    "ui:label": {
      "ui:widget": "switch",
    },
  },
};

export const extra = {
  optionsSchema: {
    readOnly: {
      type: "boolean",
      title: "Read-only",
    },
    isRequired: {
      title: "Required",
      type: "boolean",
    },
  },
  optionsSchemaUiSchema: {
    readOnly: {
      "ui:widget": "switch",
    },
    isRequired: {
      "ui:widget": "required",
    },
  },
};

// FIELDS:

const collections = {
  object: {
    title: "Object",
    icon: <div>&#123;&#32;&#125;</div>,
    description: "Data in JSON format, Grouped section",
    className: "tour-object-field",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Object Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          dependencies:
            common.optionsUiSchema.properties["ui:options"].dependencies,
          properties: {
            ...common.optionsUiSchema.properties["ui:options"].properties,
            hidden: {
              type: "boolean",
              title: "Do you want this field to be hidden?",
              description: "If yes, this field will not be visible in the form",
            },
          },
        },
        "ui:label": common.optionsUiSchema.properties["ui:label"],
      },
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "object",
        properties: {},
      },
      uiSchema: {},
    },
  },
  array: {
    title: "List",
    icon: <UnorderedListOutlined />,
    description:
      "A list of things. List of strings, numbers, objects, references",
    className: "tour-list-field",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Array Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            ...common.optionsUiSchema.properties["ui:options"].properties,
            itemsDisplayTitle: {
              type: "string",
              title: "Items Display Title",
              description:
                "You can set a fixed value or you can reference child fields by id between `{{` and `}}`",
              tooltip:
                "You can easily copy the field id by right-clicking the desired field in the tree",
            },
          },
        },
        "ui:label": common.optionsUiSchema.properties["ui:label"],
      },
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        ...common.optionsUiSchemaUiSchema["ui:options"],
        itemsDisplayTitle: {
          "ui:options": {
            descriptionIsMarkdown: true,
            showAsModal: true,
            modal: {
              buttonInNewLine: true,
            },
            codeEditor: {
              minimal: true,
              language: "jinja",
              extraExtensions: [
                placeholder("Path: {{item_123}} - Type: {{item_456}}"),
              ],
              height: "200px",
            },
          },
          "ui:field": "codeEditor",
        },
      },
      "ui:label": common.optionsUiSchemaUiSchema["ui:label"],
    },

    default: {
      schema: {
        type: "array",
        items: {},
      },
      uiSchema: {},
    },
  },
  accordionObjectField: {
    title: "Accordion",
    icon: <BorderTopOutlined />,
    description: "Data in JSON format, Grouped section",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Accordion Field Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "object",
        properties: {},
      },
      uiSchema: {
        "ui:object": "accordionObjectField",
      },
    },
  },
  tabView: {
    title: "Tab",
    icon: <LayoutOutlined />,
    description: "Data in JSON format, Grouped section",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Tab Field Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "object",
        properties: {},
      },
      uiSchema: {
        "ui:object": "tabView",
      },
    },
  },
  stepsView: {
    title: "Steps",
    icon: <NodeIndexOutlined />,
    child: {},
    optionsSchema: {
      type: "object",
      title: "Steps Field Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      ...common.optionsUiSchema,
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          dependencies:
            common.optionsUiSchema.properties["ui:options"].dependencies,
          properties: {
            ...common.optionsUiSchema.properties["ui:options"].properties,
            hideSteps: {
              type: "boolean",
              title: "Hide steps",
              tooltip:
                "Hide the steps and display a simple progress bar instead",
            },
          },
          if: {
            properties: {
              hideSteps: {
                const: false,
              },
            },
          },
          then: {
            properties: {
              stepsPlacement: {
                type: "string",
                title: "Steps placement",
                oneOf: [
                  { const: "horizontal", title: "Horizontal" },
                  { const: "vertical", title: "Vertical" },
                ],
              },
              hideButtons: {
                type: "boolean",
                title: "Hide buttons",
                tooltip: "Hide the next and previous buttons",
              },
              hideNumbers: {
                type: "boolean",
                title: "Hide numbers",
                tooltip: "Hide the step numbers and show a simple dot instead",
              },
              markAsCompleted: {
                type: "boolean",
                title: "Mark as completed",
                tooltip:
                  "Mark the steps as completed (if correct) after moving to the next one",
              },
            },
          },
        },
        "ui:label": common.optionsUiSchema.properties["ui:label"],
      },
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        ...common.optionsUiSchemaUiSchema["ui:options"],
        hideSteps: {
          "ui:widget": "switch",
        },
        hideButtons: {
          "ui:widget": "switch",
        },
        hideNumbers: {
          "ui:widget": "switch",
        },
        markAsCompleted: {
          "ui:widget": "switch",
        },
      },
      "ui:label": common.optionsUiSchemaUiSchema["ui:label"],
    },
    default: {
      schema: {
        type: "object",
        properties: {},
      },
      uiSchema: {
        "ui:object": "stepsView",
        "ui:options": {
          stepsPlacement: "horizontal",
          markAsCompleted: true,
        },
      },
    },
  },
  layerObjectField: {
    title: "Layer",
    icon: <BorderHorizontalOutlined />,
    description: "Data in JSON format, Grouped section",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Layer Field Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "object",
        properties: {},
      },
      uiSchema: {
        "ui:object": "layerObjectField",
      },
    },
  },
};

const simple = {
  text: {
    title: "Text",
    icon: <FontSizeOutlined />,
    description: "Titles, names, paragraphs, IDs, list of names",
    className: "tour-text-field",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Text Schema",
      properties: {
        ...common.optionsSchema,
        pattern: {
          title: "Validation regex",
          description:
            "The input will be validated against this regex on form submission",
          type: "string",
          format: "regex",
        },
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
      pattern: {
        "ui:placeholder": "^.*$",
      },
    },
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          dependencies:
            common.optionsUiSchema.properties["ui:options"].dependencies,
          properties: {
            ...common.optionsUiSchema.properties["ui:options"].properties,
            suggestions: {
              type: "string",
              title: "Add a suggestion URL endpoint",
              description: "Provide an URL endpoint, to fetch data from there",
            },
            convertToUppercase: {
              type: "boolean",
              title: "Convert input to uppercase",
            },
            mask: {
              type: "string",
              title: "Input mask",
              tooltip:
                "Add a mask to visualize and limit the format of the input. Use the following format: `0` (number), `a` (lowercase letter), `A` (uppercase letter), `*` (letter or number). You can escape all these with `\\`. The rest of the characters will be treated as constants",
            },
          },
        },
        "ui:label": common.optionsUiSchema.properties["ui:label"],
      },
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        ...common.optionsUiSchemaUiSchema["ui:options"],
        mask: {
          "ui:placeholder": "BN-000/aa",
          "ui:options": {
            descriptionIsMarkdown: true,
            tooltipIsMarkdown: true,
          },
        },
      },
      "ui:label": common.optionsUiSchemaUiSchema["ui:label"],
    },
    default: {
      schema: {
        type: "string",
      },
      uiSchema: {
        "ui:widget": "text",
      },
    },
  },
  textarea: {
    title: "Text area",
    icon: <AlignCenterOutlined />,
    description: "Text Area field",
    child: {},
    optionsSchema: {
      type: "object",
      title: "TextArea Schema",
      properties: {
        ...common.optionsSchema,
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
    },
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          dependencies:
            common.optionsUiSchema.properties["ui:options"].dependencies,
          properties: {
            ...common.optionsUiSchema.properties["ui:options"].properties,
            rows: {
              title: "Rows",
              description: "The number of rows in the textarea",
              type: "number",
            },
            maxLength: {
              title: "Max Length",
              description: "Infinity if not provided",
              type: "number",
            },
            minLength: {
              title: "Min Length",
              description: "Empty if not provided",
              type: "number",
            },
            placeholder: {
              title: "Placeholder",
              description: "Provide a placeholder for the field",
              type: "string",
            },
          },
        },
        "ui:label": common.optionsUiSchema.properties["ui:label"],
      },
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "string",
      },
      uiSchema: {
        "ui:widget": "textarea",
      },
    },
  },
  number: {
    title: "Number",
    icon: <FieldNumberOutlined />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Number Schema",
      properties: {
        ...common.optionsSchema,
        type: {
          title: "Type of the number",
          type: "string",
          oneOf: [
            { const: "integer", title: "Integer" },
            { const: "number", title: "Float" },
          ],
        },
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
    },
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "number",
      },
      uiSchema: {},
    },
  },
  checkbox: {
    title: "Checkbox",
    icon: <CheckSquareOutlined />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Checkbox Schema",
      properties: {
        ...common.optionsSchema,
        type: {
          title: "Type",
          type: "string",
          oneOf: [
            { const: "boolean", title: "One Option" },
            { const: "array", title: "Multiple Options" },
          ],
        },
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
      dependencies: {
        type: {
          oneOf: [
            {
              properties: {
                type: {
                  enum: ["boolean"],
                },
                checkedValue: {
                  title: "Returned value when checked",
                  description: "Default: true",
                  type: "string",
                },
                uncheckedValue: {
                  title: "Returned value when unchecked",
                  description: "Default: false",
                  type: "string",
                },
              },
            },
            {
              properties: {
                type: {
                  enum: ["array"],
                },
                items: {
                  title: "Define your options",
                  type: "object",
                  description: "The options for the widget",
                  properties: {
                    enum: {
                      title: "Options List",
                      type: "array",
                      items: {
                        title: "Option",
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
    },
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "boolean",
        items: {
          type: "string",
          enum: ["Option A", "Option B"],
        },
        uniqueItems: true,
      },
      uiSchema: {
        "ui:widget": "checkbox",
      },
    },
  },
  switch: {
    title: "Switch",
    icon: <SwapOutlined />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Switch Schema",
      properties: {
        ...common.optionsSchema,
        type: {
          type: "string",
          title: "Type of the returned value",
          description: "Define the type of the returned value",
          oneOf: [
            { const: "boolean", title: "Boolean" },
            { const: "string", title: "String" },
            { const: "number", title: "Number" },
          ],
        },
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
    },
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          dependencies:
            common.optionsUiSchema.properties["ui:options"].dependencies,
          properties: {
            ...common.optionsUiSchema.properties["ui:options"].properties,
            falseToUndefined: {
              type: "boolean",
              title: "Do you want to return undefined instead of false?",
              description:
                "In some cases the returned value is preferred to be undefined than false",
            },
          },
        },
        "ui:label": common.optionsUiSchema.properties["ui:label"],
      },
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "boolean",
      },
      uiSchema: {
        "ui:widget": "switch",
      },
    },
  },
  radio: {
    title: "Radio",
    icon: <AimOutlined />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Radio Schema",
      properties: {
        ...common.optionsSchema,
        enum: {
          title: "Define your options",
          type: "array",
          description: "The options for the radio widget",
          items: {
            title: "Radio Option",
            type: "string",
          },
        },
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
    },
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "string",
        enum: ["Option A", "Option B"],
      },
      uiSchema: {
        "ui:widget": "radio",
      },
    },
  },
  select: {
    title: "Select",
    icon: <AppstoreOutlined />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Select Schema",
      properties: {
        ...common.optionsSchema,
        type: {
          title: "Type",
          type: "string",
          oneOf: [
            { const: "string", title: "Select one value (text)" },
            { const: "number", title: "Select one value (number)" },
            { const: "array", title: "Select multiple values" },
          ],
        },
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
      allOf: [
        {
          if: {
            properties: {
              type: {
                const: "string",
              },
            },
          },
          then: {
            properties: {
              enum: {
                title: "Define your options",
                type: "array",
                description: "The options for the widget",
                items: {
                  title: "Option",
                  type: "string",
                },
              },
            },
          },
        },
        {
          if: {
            properties: {
              type: {
                const: "number",
              },
            },
          },
          then: {
            properties: {
              enum: {
                title: "Define your options",
                type: "array",
                description: "The options for the widget",
                items: {
                  title: "Option",
                  type: "number",
                },
              },
            },
          },
        },
        {
          if: {
            properties: {
              type: {
                const: "array",
              },
            },
          },
          then: {
            properties: {
              items: {
                title: "Define your options",
                type: "object",
                properties: {
                  enum: {
                    title: "Options List",
                    type: "array",
                    items: {
                      title: "Option",
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
    },
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "string",
        uniqueItems: true,
      },
      uiSchema: {
        "ui:widget": "select",
      },
    },
  },
  date: {
    title: "Date",
    icon: <CalendarOutlined />,
    description: "Date",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Date Schema",
      properties: {
        ...common.optionsSchema,
        format: {
          type: "string",
          title: "Type",
          enum: ["date", "date-time"],
          default: "date",
        },
        customFormat: {
          type: "string",
          title: "Format",
          description:
            "Define the date format ([help](https://day.js.org/docs/en/display/format#list-of-all-available-formats))",
          tooltip:
            "Remember to include the time in the format if you have selected `date-time` as type",
        },
        minDate: {
          type: "string",
          title: "Minimum date allowed",
        },
        maxDate: {
          type: "string",
          title: "Maximum date allowed",
        },
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      customFormat: {
        "ui:placeholder": "DD/MM/YYYY",
        "ui:options": {
          descriptionIsMarkdown: true,
          tooltipIsMarkdown: true,
        },
      },
      minDate: {
        "ui:widget": "date",
      },
      maxDate: {
        "ui:widget": "date",
      },
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
    },
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "string",
      },
      uiSchema: {
        "ui:widget": "date",
      },
    },
  },
};

const advanced = {
  uri: {
    title: "URI",
    icon: <LinkOutlined />,
    description: "Add uri text",
    child: {},
    optionsSchema: {
      type: "object",
      title: "URI Schema",
      properties: {
        ...common.optionsSchema,
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
    },
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          dependencies:
            common.optionsUiSchema.properties["ui:options"].dependencies,
          properties: {
            ...common.optionsUiSchema.properties["ui:options"].properties,
            suggestions: {
              type: "string",
              title: "Add a suggestion URL endpoint",
              description: "Provide an URL endpoint, to fetch data from there",
            },
          },
        },
        "ui:label": common.optionsUiSchema.properties["ui:label"],
      },
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "string",
        format: "uri",
      },
      uiSchema: {
        "ui:widget": "uri",
      },
    },
  },
  richeditor: {
    title: "Rich/LaTeX editor",
    icon: <FileMarkdownOutlined />,
    description: "Rich/LaTeX Editor Field",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Rich/LaTeX Editor Schema",
      properties: {
        ...common.optionsSchema,
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
    },
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "string",
      },
      uiSchema: {
        "ui:widget": "richeditor",
      },
    },
  },
  tags: {
    title: "Tags",
    icon: <TagOutlined />,
    description: "Add keywords, tags, etc",
    child: {},
    optionsSchema: {
      title: "Tags Schema",
      type: "object",
      properties: {
        ...common.optionsSchema,
        tagPattern: {
          type: "string",
          title: "Pattern",
          description: "Provide a regex for your pattern",
        },
        tagPatternErrorMessage: {
          type: "string",
          title: "Pattern error message",
          description:
            "Provide a message to display when the input does not match the pattern",
        },
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
    },
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "array",
        items: {
          type: "string",
        },
      },
      uiSchema: {
        "ui:field": "tags",
      },
    },
  },
  idFetcher: {
    title: "ID Fetcher",
    icon: <CloudDownloadOutlined />,
    description: "Fetch data from ZENODO, ORCiD or ROR",
    child: {},
    optionsSchema: {
      type: "object",
      title: "ID Fetcher Schema",
      properties: {
        ...common.optionsSchema,
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
    },
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        ...common.optionsUiSchema.properties,
        "ui:servicesList": {
          title: "Select the services you want to allow",
          type: "array",
          items: {
            type: "string",
            oneOf: [
              { const: "orcid", title: "ORCiD" },
              { const: "ror", title: "ROR" },
              { const: "zenodo", title: "Zenodo" },
            ],
          },
          uniqueItems: true,
        },
      },
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
      "ui:servicesList": {
        "ui:widget": "checkbox",
      },
    },
    default: {
      schema: {
        type: "object",
        properties: {},
      },
      uiSchema: {
        "ui:servicesList": ["orcid", "ror", "zenodo"],
        "ui:field": "idFetcher",
      },
    },
  },
  codeEditor: {
    title: "Code Editor",
    icon: <CodeOutlined />,
    description: "Code editor with syntax highlighting",
    child: {},
    optionsSchema: {
      title: "Code Editor Schema",
      type: "object",
      properties: {
        ...common.optionsSchema,
        validateWith: {
          type: "string",
          title: "Validate with",
          description:
            "You can either provide a URL of a UI Schema to validate against or paste the JSON schema directly",
          oneOf: [
            { const: "none", title: "None" },
            { const: "url", title: "URL" },
            { const: "json", title: "JSON" },
          ],
        },
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
      dependencies: {
        validateWith: {
          oneOf: [
            {
              properties: {
                validateWith: {
                  enum: ["url"],
                },
                validateWithUrl: {
                  title: "Validation schema URL",
                  type: "string",
                },
              },
            },
            {
              properties: {
                validateWith: {
                  enum: ["json"],
                },
                validateWithJson: {
                  title: "Validation JSON schema",
                  type: "string",
                },
              },
            },
            {
              properties: {
                validateWith: {
                  enum: ["none"],
                },
              },
            },
          ],
        },
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
      validateWithUrl: {
        "ui:widget": "uri",
      },
      validateWithJson: {
        "ui:field": "codeEditor",
        "ui:options": {
          showAsModal: true,
          modal: {
            buttonInNewLine: true,
            modalWidth: "800px",
          },
          codeEditor: {
            minimal: true,
            language: "json",
            height: "600px",
            extraExtensions: [placeholder("Paste your JSON Schema here")],
          },
        },
      },
      "ui:order": [
        "title",
        "description",
        "validateWith",
        "validateWithUrl",
        "validateWithJson",
        "*",
      ],
    },
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          dependencies:
            common.optionsUiSchema.properties["ui:options"].dependencies,
          properties: {
            ...common.optionsUiSchema.properties["ui:options"].properties,
            height: {
              type: "number",
              title: "Height",
              description: "In pixels",
            },
            language: {
              type: "string",
              title: "Language",
              oneOf: [
                { const: "none", title: "None" },
                { const: "json", title: "JSON" },
                { const: "jinja", title: "Jinja" },
                { const: "stex", title: "LaTeX (sTeX)" },
              ],
              tooltip:
                "This setting will be ignored when passing a validation schema in the schema settings",
            },
          },
        },
        "ui:label": common.optionsUiSchema.properties["ui:label"],
      },
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "string",
        validateWith: "none",
      },
      uiSchema: {
        "ui:field": "codeEditor",
        "ui:options": {
          language: "none",
        },
      },
    },
  },
};

// HIDDEN FIELDS (not directly selectable by the user):

export const hiddenFields = {
  integer: {
    title: "Integer",
    icon: <NumberOutlined />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Integer Schema",
      properties: {
        ...common.optionsSchema,
        type: {
          title: "Type of the number",
          type: "string",
          oneOf: [
            { const: "integer", title: "Integer" },
            { const: "number", title: "Float" },
          ],
        },
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
    },
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "integer",
      },
      uiSchema: {},
    },
  },
};

const fieldTypes = {
  collections: {
    title: "Collections",
    description: "",
    fields: collections,
    className: "tour-collections",
  },
  simple: {
    title: "Fields",
    description: "",
    fields: simple,
  },
  advanced: {
    title: "Advanced fields",
    description: "",
    fields: advanced,
  },
};

export default fieldTypes;
