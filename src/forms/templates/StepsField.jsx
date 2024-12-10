import { Button, Col, Grid, Progress, Row, Steps, Typography } from "antd";
import { _filterTabs, isFieldContainsError } from "./utils";
import { useContext, useEffect, useRef, useState } from "react";
import CustomizationContext from "../../contexts/CustomizationContext";

const StepsField = ({ uiSchema, properties, idSchema }) => {
  const options = uiSchema["ui:options"] || {};

  const tabs = _filterTabs(options.tabs, options, properties);

  const {
    hideButtons,
    hideSteps,
    hideNumbers,
    stepsPlacement,
    markAsCompleted,
  } = options;
  const isVertical = stepsPlacement === "vertical";

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const customizationContext = useContext(CustomizationContext);
  const [current, setCurrent] = useState(0);
  const [anchor, setAnchor] = useState("");
  const [scroll, setScroll] = useState(false);
  const [progressColor, setProgressColor] = useState("");
  const stepsRef = useRef(null);

  window.addEventListener("hashchange", () => {
    setAnchor(window.location.hash.replace("#", ""));
  });

  useEffect(() => {
    if (window.location.hash) {
      setAnchor(window.location.hash.replace("#", ""));
    }
  }, []);

  useEffect(() => {
    if (anchor) {
      const items = anchor.split(customizationContext.separator);
      items.forEach((item, index) => {
        if (idSchema.$id.includes(item)) {
          const tabName = items[index + 1];
          const activeIndex = tabs.findIndex((tab) => tab.name === tabName);
          if (activeIndex > -1) {
            setCurrent(activeIndex);
            setScroll(true);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchor]);

  useEffect(() => {
    if (scroll) {
      const elem = document.getElementById(anchor);
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ behavior: "smooth" });
        }, 500);
      }
    }
  }, [current, anchor, scroll]);

  useEffect(() => {
    if (!hideSteps && !isVertical) {
      // Horizontal scroll to the current step
      stepsRef.current
        .querySelector(".ant-steps-item-active")
        ?.scrollIntoView({ behavior: "smooth" });
    } else if (tabs.some((tab) => isFieldContainsError(tab))) {
      setProgressColor("red");
    } else {
      setProgressColor("");
    }
  }, [current, hideSteps, isVertical, tabs]);

  const items = tabs.map((tab, index) => ({
    key: tab.name,
    title: screens.md && (
      <Typography.Paragraph
        ellipsis={{ rows: 2, tooltip: { placement: "right" } }}
      >
        {tab.title || tab.content.props.schema.title || tab.name}
      </Typography.Paragraph>
    ),
    status: isFieldContainsError(tab)
      ? "error"
      : !markAsCompleted && index != current && "wait",
  }));

  const updateCurrent = (value) => {
    setCurrent(value);
    setScroll(false);
  };

  const content = (
    <Row style={{ width: "100%" }}>
      <Col flex="auto">
        <div>{tabs[current]?.content}</div>
        {(!hideButtons || hideSteps) && (
          <Row justify="space-between">
            <Col>
              {current > 0 && (
                <Button onClick={() => updateCurrent(current - 1)}>
                  Previous
                </Button>
              )}
            </Col>
            <Col>
              {current < tabs.length - 1 && (
                <Button
                  type="primary"
                  onClick={() => updateCurrent(current + 1)}
                >
                  Next
                </Button>
              )}
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );

  return (
    <>
      {hideSteps ? (
        <Progress
          percent={(current / (items.length - 1)) * 100}
          showInfo={false}
          strokeLinecap="square"
          style={{ marginBottom: "20px" }}
          strokeColor={progressColor}
        />
      ) : (
        <Row ref={stepsRef} gutter={20} wrap={false}>
          <Col xs={isVertical && 8}>
            <Steps
              className="steps"
              responsive={false}
              labelPlacement={!isVertical && "vertical"}
              progressDot={hideNumbers}
              current={current}
              direction={stepsPlacement}
              onChange={updateCurrent}
              items={items}
              size="small"
              style={
                !isVertical && {
                  overflowX: "scroll",
                  padding: "10px",
                  marginBottom: "10px",
                }
              }
            />
          </Col>
          {isVertical && <Col flex="auto">{content}</Col>}
        </Row>
      )}
      {(!isVertical || hideSteps) && content}
    </>
  );
};

export default StepsField;
