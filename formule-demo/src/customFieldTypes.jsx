import { common, extra } from "../../src/admin/utils/fieldTypes";

import { FileOutlined } from "@ant-design/icons";

export const customFieldTypes = {
  advanced: {
    CapFiles: {
      title: "File upload",
      icon: <FileOutlined />,
      description: "Upload Files",
      child: {},
      optionsSchema: {
        type: "object",
        title: "File upload widget",
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
          "ui:field": "CapFiles",
        },
      },
    },
  },
};
