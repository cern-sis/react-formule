import { Col, InputNumber, Row, Slider } from "antd";
import { useState } from "react";

interface SliderSchema {
  defaultValue?: number;
  oneOf?: [];
  minimum?: number;
  maximum?: number;
  step?: number;
}

interface SliderOptions {
  suffix?: string;
  hideInput?: boolean;
}

interface SliderWidgetProps {
  schema: SliderSchema;
  onChange: (value: number) => void;
  value?: number;
  options: SliderOptions;
  readonly?: boolean;
}

const SliderWidget = ({
  schema,
  onChange,
  value,
  options,
  readonly,
}: SliderWidgetProps) => {
  const { defaultValue, minimum, maximum, step, oneOf = [] } = schema;
  const { suffix, hideInput } = options;
  const marks = {};
  oneOf?.map((i) => {
    const label = i.title || i.const;
    marks[i.const] = suffix ? (
      <span>
        {label}&nbsp;{suffix}
      </span>
    ) : (
      label
    );
  });
  const [inputValue, setInputValue] = useState<number | undefined>(
    value || defaultValue,
  );

  const handleChange = (event: number | null): void => {
    if (event === null) return;

    setInputValue(event);
    onChange(event);
  };

  return (
    <Row gutter={10}>
      <Col flex="auto">
        {oneOf.length > 0 ? (
          <Slider
            marks={marks}
            defaultValue={value || defaultValue}
            max={
              marks
                ? Math.max(...Object.keys(marks))
                : maximum
                  ? maximum
                  : undefined
            }
            onChange={handleChange}
            tooltip={{ open: false }}
            included={true}
            step={null}
            disabled={readonly}
          />
        ) : (
          <Slider
            defaultValue={defaultValue}
            step={step || 0}
            min={minimum || 0}
            max={maximum || 100}
            onChange={handleChange}
            dots={!!step}
            value={inputValue}
            tooltip={{ formatter: (val) => val + (suffix ? ` ${suffix}` : "") }}
            disabled={readonly}
          />
        )}
      </Col>
      {!oneOf && !hideInput && (
        <Col flex={"none"}>
          <InputNumber
            type="number"
            min={minimum}
            max={maximum}
            value={inputValue}
            onChange={handleChange}
            suffix={suffix}
            disabled={readonly}
          />
        </Col>
      )}
    </Row>
  );
};

export default SliderWidget;
