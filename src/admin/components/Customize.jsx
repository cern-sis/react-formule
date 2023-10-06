import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PropertyKeyEditorForm from "./PropKeyEditorForm";

import { Radio, Space, Tabs, Typography } from "antd";
import { SIZE_OPTIONS } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { updateSchemaByPath, updateUiSchemaByPath } from "../../store/schemaWizard";

import { get } from "lodash-es"

const JUSTIFY_OPTIONS = ["start", "center", "end"];

const Customize = ({
  path,
}) => {
  const [justify, setJustify] = useState(() => "start");
  const [size, setSize] = useState("xlarge");

  const dispatch = useDispatch()
  const _path = useSelector((state) => state.schemaWizard.field.path)
  const _uiPath = useSelector((state) => state.schemaWizard.field.uiPath)
  
  const schema = useSelector((state) => _path && get(state.schemaWizard, ["current", "schema", ..._path]))
  const uiSchema = useSelector((state) => _uiPath && get(state.schemaWizard, ["current", "uiSchema", ..._uiPath]))

  useEffect(() => {
    if (uiSchema && Object.hasOwn(uiSchema, "ui:options")) {
      setSize(uiSchema["ui:options"].size);
      setJustify(uiSchema["ui:options"].justify);
    }
  }, [uiSchema]);

  const _onSchemaChange = data => {
    dispatch(updateSchemaByPath({path: path.path, value: data.formData}));
  };
  const _onUiSchemaChange = data => {
    dispatch(updateUiSchemaByPath({path: path.uiPath, value: data.formData}));
  };
  const sizeChange = newSize => {
    let { "ui:options": uiOptions = {}, ...rest } = uiSchema;

    dispatch(updateUiSchemaByPath({path: path.uiPath, value: {
      ...rest,
      "ui:options": { ...uiOptions, size: newSize },
    }}));
  };

  const alignChange = newAlign => {
    let { "ui:options": uiOptions = {}, ...rest } = uiSchema;

    dispatch(updateUiSchemaByPath({path: path.uiPath, value: {
      ...rest,
      "ui:options": { ...uiOptions, justify: newAlign },
    }}));
  };

  return (
    <Tabs
      className="scrollableTabs"
      centered
      style={{ flex: 1 }}
      items={[
        {
          key: "1",
          label: "Schema Settings",
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
          label: "UI Schema Settings",
          children:
            _path.length != 0 ? (
              <PropertyKeyEditorForm
                schema={schema && schema}
                uiSchema={uiSchema && uiSchema}
                formData={uiSchema && uiSchema}
                onChange={_onUiSchemaChange}
                optionsSchemaObject="optionsUiSchema"
                optionsUiSchemaObject="optionsUiSchemaUiSchema"
                key={_uiPath}
              />
            ) : (
              <Space
                direction="vertical"
                style={{ padding: "0 12px", width: "100%" }}
              >
                <Typography.Text>Size Options</Typography.Text>
                <Radio.Group
                  size="small"
                  onChange={e => sizeChange(e.target.value)}
                  value={size}
                  style={{ paddingBottom: "15px" }}
                >
                  {Object.keys(SIZE_OPTIONS).map(size => (
                    <Radio.Button key={size} value={size}>
                      {size}
                    </Radio.Button>
                  ))}
                </Radio.Group>
                <Typography.Text>Align Options</Typography.Text>
                <Radio.Group
                  size="small"
                  onChange={e => alignChange(e.target.value)}
                  value={justify}
                >
                  {JUSTIFY_OPTIONS.map(justify => (
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

Customize.propTypes = {
  path: PropTypes.object,
};

export default Customize;
