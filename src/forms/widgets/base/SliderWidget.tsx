import { Col, InputNumber, Row, Slider } from "antd";
import { useState } from "react";

interface SliderSchema {
  defaultValue?: number;
  values?: number[];
  labels?: string[];
  minimum?: number;
  maximum?: number;
  step?: number;
  kind?: "continuous" | "discrete";
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
  const { defaultValue, values, labels, minimum, maximum, step, kind } = schema;
  const { suffix, hideInput } = options;

  const isDiscrete = kind === "discrete";

  const marks = values?.reduce((acc, _, index) => {
    const label = labels?.[index] ?? values[index];
    acc[index] = suffix ? (
      <span>
        {label}&nbsp;{suffix}
      </span>
    ) : (
      label
    );
    return acc;
  }, {});

  const [inputValue, setInputValue] = useState<number | undefined>(
    value || defaultValue,
  );

  const handleChangeDiscrete = (event: number): void => {
    values && onChange(values[event]);
  };

  const handleChangeContinuous = (event: number | null): void => {
    if (event === null) return;

    setInputValue(event);
    onChange(event);
  };

  return (
    <Row gutter={10}>
      <Col flex="auto">
        {isDiscrete ? (
          <Slider
            marks={marks}
            defaultValue={
              values &&
              (value
                ? values.indexOf(value)
                : defaultValue && values.indexOf(defaultValue))
            }
            max={marks ? Object.keys(marks).length - 1 : 0}
            onChange={handleChangeDiscrete}
            tooltip={{ open: false }}
            disabled={readonly}
          />
        ) : (
          <Slider
            defaultValue={defaultValue}
            step={step || 0}
            min={minimum || 0}
            max={maximum || 100}
            onChange={handleChangeContinuous}
            dots={!!step}
            value={inputValue}
            tooltip={{ formatter: (val) => val + (suffix ? ` ${suffix}` : "") }}
            disabled={readonly}
          />
        )}
      </Col>
      {!isDiscrete && !hideInput && (
        <Col flex={"none"}>
          <InputNumber
            type="number"
            min={minimum}
            max={maximum}
            value={inputValue}
            onChange={handleChangeContinuous}
            suffix={suffix}
            disabled={readonly}
          />
        </Col>
      )}
    </Row>
  );
};

export default SliderWidget;
