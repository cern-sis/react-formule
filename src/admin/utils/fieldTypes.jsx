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
  UploadOutlined,
  DashOutlined,
} from "@ant-design/icons";
import { placeholder } from "@codemirror/view";
import PropKeyEditorObjectFieldTemplate from "../formComponents/PropKeyEditorObjectFieldTemplate";

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
  optionsSchemaUiSchema: {
    "ui:ObjectFieldTemplate": PropKeyEditorObjectFieldTemplate,
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
            kind: "discrete",
            defaultValue: 24,
            values: [6, 8, 12, 16, 18, 24],
            labels: ["25%", "33%", "50%", "66%", "75%", "100%"],
          },
          showAsModal: {
            title: "Display as Modal",
            type: "boolean",
          },
          collapsible: {
            title: "Collapsible",
            type: "boolean",
          },
          hidden: {
            type: "boolean",
            title: "Hidden",
            tooltip:
              "When enabled, this field will not be visible in the form, but data can exist and be validated",
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
                      modalWidth: {
                        title: "Modal width",
                        type: "integer",
                        tooltip:
                          "On small screens modals will ignore this setting and use full screen width",
                        kind: "discrete",
                        values: [0, 25, 33, 50, 66, 75, 100],
                        labels: [
                          "auto",
                          "25%",
                          "33%",
                          "50%",
                          "66%",
                          "75%",
                          "100%",
                        ],
                      },
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
            modalWidth: 33,
          },
        },
        buttonInNewLine: {
          "ui:widget": "switch",
        },
        modalWidth: {
          "ui:widget": "slider",
        },
      },
      showAsModal: {
        "ui:widget": "switch",
      },
      collapsible: {
        "ui:widget": "switch",
      },
      hidden: {
        "ui:widget": "switch",
      },
      "ui:order": ["showAsModal", "modal", "hidden", "collapsible", "*"],
      "ui:padding": 0,
      "ui:label": false,
    },
    "ui:label": {
      "ui:widget": "switch",
    },
    "ui:ObjectFieldTemplate": PropKeyEditorObjectFieldTemplate,
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
    icon: <span>&#123;&nbsp;&#125;</span>,
    description: "Group of fields, useful for nesting",
    className: "tour-object-field",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Object Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsSchemaUiSchema: common.optionsSchemaUiSchema,
    optionsUiSchema: common.optionsUiSchema,
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
    description: "List of fields supporting addition, deletion and reordering",
    className: "tour-list-field",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Array Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsSchemaUiSchema: {
      ...common.optionsSchemaUiSchema,
    },
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
      ...common.optionsUiSchemaUiSchema,
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
    },

    default: {
      schema: {
        type: "array",
        items: {},
      },
      uiSchema: {},
    },
  },
  accordion: {
    title: "Accordion",
    icon: <BorderTopOutlined />,
    description: "List of collapsible fields",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Accordion Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsSchemaUiSchema: {
      ...common.optionsSchemaUiSchema,
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
        items: {},
      },
      uiSchema: {
        "ui:array": "accordion",
      },
    },
  },
  layer: {
    title: "Layer",
    icon: <BorderHorizontalOutlined />,
    description: "List of modal fields",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Layer Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsSchemaUiSchema: {
      ...common.optionsSchemaUiSchema,
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
        items: {},
      },
      uiSchema: {
        "ui:array": "layer",
      },
    },
  },
  tabView: {
    title: "Tab",
    icon: <LayoutOutlined />,
    description: "Group of fields separated in tabs",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Tab Field Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsSchemaUiSchema: {
      ...common.optionsSchemaUiSchema,
    },
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
    description: "Group of fields separated in steps",
    icon: <NodeIndexOutlined />,
    child: {},
    optionsSchema: {
      type: "object",
      title: "Steps Field Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsSchemaUiSchema: {
      ...common.optionsSchemaUiSchema,
    },
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
      ...common.optionsUiSchemaUiSchema,
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
};

const simple = {
  text: {
    title: "Text",
    icon: <FontSizeOutlined />,
    description: "Text field supporting validation",
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
        format: {
          title: "Format",
          type: "string",
          enum: [
            "date",
            "time",
            "date-time",
            "duration",
            "regex",
            "email",
            "idn-email",
            "hostname",
            "idn-hostname",
            "ipv4",
            "ipv6",
            "json-pointer",
            "relative-json-pointer",
            "uri",
            "uri-reference",
            "uri-template",
            "iri",
            "iri-reference",
            "uuid",
          ],
        },
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      ...common.optionsSchemaUiSchema,
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
      ...common.optionsUiSchemaUiSchema,
      "ui:options": {
        ...common.optionsUiSchemaUiSchema["ui:options"],
        mask: {
          "ui:placeholder": "BN-000/aa",
          "ui:options": {
            descriptionIsMarkdown: true,
            tooltipIsMarkdown: true,
          },
        },
        convertToUppercase: {
          "ui:widget": "switch",
        },
      },
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
    description: "Text area that can grow vertically",
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
      ...common.optionsSchemaUiSchema,
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
    description: "Number field (integer or float)",
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
      ...common.optionsSchemaUiSchema,
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
    description:
      "Checkbox field with one or multiple options and customizable return values",
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
      ...common.optionsSchemaUiSchema,
      items: {
        enum: {
          items: {
            "ui:label": false,
          },
        },
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
    description: "Switch field with customizable return types",
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
      ...common.optionsSchemaUiSchema,
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
    description: "Radio button with multiple options and only one selection",
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
      ...common.optionsSchemaUiSchema,
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
    description: "Dropdown select with multiselect support",
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
      ...common.optionsSchemaUiSchema,
      items: {
        enum: {
          items: {
            "ui:label": false,
          },
        },
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
    description:
      "Date field with date and date-time support and date range validation",
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
      ...common.optionsSchemaUiSchema,
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
  email: {
    title: "Email",
    icon: <FontSizeOutlined />,
    description: "Email field supporting validation",
    className: "tour-email-field",
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
      ...common.optionsSchemaUiSchema,
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
      ...common.optionsUiSchemaUiSchema,
      "ui:options": {
        ...common.optionsUiSchemaUiSchema["ui:options"],
        mask: {
          "ui:placeholder": "BN-000/aa",
          "ui:options": {
            descriptionIsMarkdown: true,
            tooltipIsMarkdown: true,
          },
        },
        convertToUppercase: {
          "ui:widget": "switch",
        },
      },
    },
    default: {
      schema: {
        type: "string",
        format: "email",
      },
      uiSchema: {
        "ui:widget": "text",
      },
    },
  },
};

const advanced = {
  uri: {
    title: "URI",
    icon: <LinkOutlined />,
    description: "URI/URL field with quick action buttons",
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
      ...common.optionsSchemaUiSchema,
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
    description: "Interactive editor with support for LaTeX and Markdown",
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
      ...common.optionsSchemaUiSchema,
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
            height: {
              title: "Height",
              type: "integer",
              kind: "continuous",
              minimum: 200,
              maximum: 1000,
              step: 100,
            },
          },
        },
        "ui:label": common.optionsUiSchema.properties["ui:label"],
      },
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        ...common.optionsUiSchemaUiSchema["ui:options"],
        height: {
          "ui:widget": "slider",
          "ui:options": {
            suffix: "px",
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
        "ui:widget": "richeditor",
        "ui:options": {
          height: 200,
        },
      },
    },
  },
  tags: {
    title: "Tags",
    icon: <TagOutlined />,
    description: "List of tags with pattern validation",
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
      ...common.optionsSchemaUiSchema,
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
      ...common.optionsSchemaUiSchema,
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
    description:
      "Code editor with syntax highlighting and JSONSchema validation",
    child: {},
    optionsSchema: {
      title: "Code Editor Schema",
      type: "object",
      properties: {
        ...common.optionsSchema,
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      ...common.optionsSchemaUiSchema,
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,

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
          dependencies: {
            ...common.optionsUiSchema.properties["ui:options"].dependencies,
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
                      aiHint: "The JSON must be stringified",
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
          properties: {
            ...common.optionsUiSchema.properties["ui:options"].properties,
            height: {
              title: "Height",
              type: "integer",
              tooltip: "Set to 0 for auto",
              kind: "continuous",
              minimum: 0,
              maximum: 1000,
              step: 100,
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
            validateWith: {
              type: "string",
              title: "Validate with",
              tooltip:
                "You can either provide a URL of a UI Schema to validate against or paste the JSON schema directly",
              oneOf: [
                { const: "none", title: "None" },
                { const: "url", title: "URL" },
                { const: "json", title: "JSON" },
              ],
            },
          },
        },
        "ui:label": common.optionsUiSchema.properties["ui:label"],
      },
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
      "ui:options": {
        ...common.optionsUiSchemaUiSchema["ui:options"],
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
      },
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
  file: {
    title: "Files",
    icon: <UploadOutlined />,
    description: "File upload with previews and extension whitelisting",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Files Schema",
      properties: {
        ...common.optionsSchema,
        maxFiles: {
          title: "Maximum number of files",
          description: "Default or 0 = infinite",
          type: "integer",
          minimum: 0,
        },
        accept: {
          title: "Allowed extensions",
          description:
            "E.g. `.pdf`, `.png` (include the dot). Leave empty to allow all extensions",
          type: "array",
          uniqueItems: true,
          items: {
            type: "string",
            pattern: "^\\.[a-zA-Z0-9]+$",
          },
        },
        disablePreview: {
          title: "Disable preview",
          description: "Disables image thumbnails and previews",
          type: "boolean",
        },
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      ...common.optionsSchemaUiSchema,
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
      accept: {
        "ui:options": {
          descriptionIsMarkdown: true,
        },
        items: {
          "ui:label": false,
        },
      },
      disablePreview: {
        "ui:widget": "switch",
      },
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
        "ui:field": "file",
      },
    },
  },
  slider: {
    title: "Slider",
    icon: <DashOutlined />,
    description: "Select a value within a range",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Slider Schema",
      properties: {
        ...common.optionsSchema,
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
      oneOf: [
        {
          title: "Simple slider",
          properties: {
            minimum: {
              type: "number",
              title: "Minimum value",
            },
            maximum: {
              type: "number",
              title: "Maximum value",
            },
            step: {
              type: "number",
              title: "Step size",
            },
          },
        },
        {
          title: "Descrete options",
          description:
            "Create a slider with predefined points/marks to select on",
          properties: {
            oneOf: {
              title: "Marks/Labels",
              type: "array",
              items: {
                type: "object",
                properties: {
                  const: {
                    type: "number",
                    default: 0,
                  },
                  title: {
                    type: "string",
                  },
                  type: {
                    type: "string",
                    default: "number",
                  },
                },
              },
            },
          },
        },
      ],
    },
    optionsSchemaUiSchema: {
      ...common.optionsSchemaUiSchema,
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
      minimum: {
        "ui:options": {
          span: 12,
          label: false,
          placeholder: "Minimum",
        },
      },
      maximum: {
        "ui:options": {
          span: 12,
          label: false,
          placeholder: "Maximum",
        },
      },
      oneOf: {
        items: {
          "ui:label": false,
          const: {
            "ui:options": {
              span: 12,
              placeholder: "value",
              label: false,
            },
          },
          title: {
            "ui:options": {
              span: 12,
              placeholder: "label",
              label: false,
            },
          },
          type: {
            "ui:widget": "hidden",
          },
        },
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
            suffix: {
              title: "Suffix",
              type: "string",
              tooltip:
                "For visual purposes. Only the plain numeric value will be stored on the form data.",
            },
            hideInput: {
              type: "boolean",
              title: "Hide input",
              tooltip:
                "Hide numeric input field at the right. On `discrete` sliders the input is never shown and this setting is ignored.",
            },
          },
        },
        "ui:label": common.optionsUiSchema.properties["ui:label"],
      },
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
      "ui:options": {
        ...common.optionsUiSchemaUiSchema["ui:options"],
        hideInput: {
          "ui:widget": "switch",
        },
      },
      "ui:label": common.optionsUiSchemaUiSchema["ui:label"],
    },
    default: {
      schema: {
        type: "number",
        kind: "continuous",
      },
      uiSchema: {
        "ui:widget": "slider",
      },
    },
  },
};

// HIDDEN FIELDS (not directly selectable by the user):

export const hiddenFields = {
  integer: {
    title: "Integer",
    icon: <NumberOutlined />,
    description: "Number field (integer or float)",
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
      ...common.optionsSchemaUiSchema,
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
