import { useEffect, useState } from "react";
import PropertyKeyEditorForm from "./PropKeyEditorForm";

import { Radio, Space, Tabs, Typography } from "antd";
import { SIZE_OPTIONS } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSchemaByPath,
  updateUiSchemaByPath,
} from "../../store/schemaWizard";

import { get } from "lodash-es";

const JUSTIFY_OPTIONS = ["start", "center", "end"];

const Customize = () => {
  const [justify, setJustify] = useState(() => "start");
  const [size, setSize] = useState("xlarge");

  const dispatch = useDispatch();
  const path = useSelector((state) => state.schemaWizard.field.path);
  const uiPath = useSelector((state) => state.schemaWizard.field.uiPath);

  const schema = useSelector(
    (state) => path && get(state.schemaWizard, ["current", "schema", ...path]),
  );
  const uiSchema = useSelector(
    (state) =>
      uiPath && get(state.schemaWizard, ["current", "uiSchema", ...uiPath]),
  );

  useEffect(() => {
    if (uiSchema && Object.hasOwn(uiSchema, "ui:options")) {
      setSize(uiSchema["ui:options"].size);
      setJustify(uiSchema["ui:options"].justify);
    }
  }, [uiSchema]);

  const _onSchemaChange = (data) => {
    dispatch(updateSchemaByPath({ path: path, value: data.formData }));
  };
  const _onUiSchemaChange = (data) => {
    dispatch(updateUiSchemaByPath({ path: uiPath, value: data.formData }));
  };
  const sizeChange = (newSize) => {
    let { "ui:options": uiOptions = {}, ...rest } = uiSchema;

    dispatch(
      updateUiSchemaByPath({
        path: uiPath,
        value: {
          ...rest,
          "ui:options": { ...uiOptions, size: newSize },
        },
      }),
    );
  };

  const alignChange = (newAlign) => {
    let { "ui:options": uiOptions = {}, ...rest } = uiSchema;

    dispatch(
      updateUiSchemaByPath({
        path: uiPath,
        value: {
          ...rest,
          "ui:options": { ...uiOptions, justify: newAlign },
        },
      }),
    );
  };

  return (
    <Tabs
      className="scrollableTabs"
      centered
      style={{ height: "100%", width: "100%" }}
      items={[
        {
          key: "1",
          label: "Settings",
          children: (
            <PropertyKeyEditorForm
              schema={schema && schema}
              uiSchema={uiSchema && uiSchema}
              formData={schema && schema}
              onChange={_onSchemaChange}
              optionsSchemaObject="optionsSchema"
              optionsUiSchemaObject="optionsSchemaUiSchema"
            />
          ),
        },
        {
          key: "2",
          label: "UI Settings",
          children:
            path.length != 0 ? (
              <PropertyKeyEditorForm
                schema={schema && schema}
                uiSchema={uiSchema && uiSchema}
                formData={uiSchema && uiSchema}
                onChange={_onUiSchemaChange}
                optionsSchemaObject="optionsUiSchema"
                optionsUiSchemaObject="optionsUiSchemaUiSchema"
                key={uiPath}
              />
            ) : (
              <Space direction="vertical" style={{ padding: "0 12px" }}>
                <Typography.Text>Size Options</Typography.Text>
                <Radio.Group
                  size="small"
                  onChange={(e) => sizeChange(e.target.value)}
                  value={size}
                  style={{ paddingBottom: "15px" }}
                >
                  {Object.keys(SIZE_OPTIONS).map((size) => (
                    <Radio.Button key={size} value={size}>
                      {size}
                    </Radio.Button>
                  ))}
                </Radio.Group>
                <Typography.Text>Align Options</Typography.Text>
                <Radio.Group
                  size="small"
                  onChange={(e) => alignChange(e.target.value)}
                  value={justify}
                >
                  {JUSTIFY_OPTIONS.map((justify) => (
                    <Radio.Button key={justify} value={justify}>
                      {justify}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Space>
            ),
        },
      ]}
    />
  );
};

export default Customize;
