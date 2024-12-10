import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import {
  Col,
  Layout,
  Row,
  Space,
  Switch,
  Typography,
  Grid,
  Select,
} from "antd";
import TabFieldMenu from "./TabFieldMenu";
import { _filterTabs, isFieldContainsError } from "../utils";
import CustomizationContext from "../../../contexts/CustomizationContext";

const TabField = ({ uiSchema, properties, idSchema }) => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const customizationContext = useContext(CustomizationContext);

  let options = uiSchema["ui:options"] || {};

  // fetch tabs either from view object or from properties
  let fetched_tabs = options.tabs ? options.tabs : properties;
  // check if there is analysis_reuse_mode
  let analysis_mode = fetched_tabs.filter(
    (item) => item.name === "analysis_reuse_mode",
  );

  // remove components which are meant to be hidden
  // remove from the tab list the analysis_reuse_mode if it exists
  let tabs = _filterTabs(options.tabs, options, properties);

  const [active, setActive] = useState("");
  const [analysisChecked, setAnalysisChecked] = useState(
    analysis_mode.length > 0
      ? analysis_mode[0].content.props.formData == "true"
      : false,
  );
  const [anchor, setAnchor] = useState("");
  const [activeTabContent, setActiveTabContent] = useState([]);
  const [scroll, setScroll] = useState(false);

  const updateActive = (newActiveTab) => {
    setActive(newActiveTab);
    setScroll(false);
  };

  window.addEventListener("hashchange", () => {
    setAnchor(window.location.hash.replace("#", ""));
  });

  useEffect(() => {
    if (!active && tabs.length > 0) {
      setActive(options.initTab ? options.initTab : tabs[0].name);
    }
    if (window.location.hash) {
      setAnchor(window.location.hash.replace("#", ""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let activeTab = tabs.filter((prop) => prop.name == active);
    if (options.tabs) {
      setActiveTabContent(
        properties.filter(
          (prop) =>
            activeTab[0].content &&
            activeTab[0].content.indexOf(prop.name) > -1,
        ),
      );
    } else {
      setActiveTabContent(activeTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (anchor) {
      const items = anchor.split(customizationContext.separator);
      items.forEach((item, index) => {
        if (idSchema.$id.includes(item)) {
          const tabName = items[index + 1];
          const activeTab = tabs.filter((tab) => tab.name === tabName);
          if (activeTab && activeTab != active) {
            setActive(tabName);
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
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [activeTabContent, anchor, scroll]);

  return (
    <Layout style={{ height: "100%", padding: 0 }}>
      {screens.md ? (
        <Layout.Sider style={{ height: "100%" }}>
          <TabFieldMenu
            analysisChecked={analysisChecked}
            analysis_mode={analysis_mode}
            tabs={tabs}
            active={active}
            showReuseMode
            setActive={updateActive}
            setAnalysisChecked={setAnalysisChecked}
          />
        </Layout.Sider>
      ) : (
        <Row
          justify="center"
          style={{ padding: "10px", background: "#fff", marginTop: "5px" }}
        >
          <Space direction="vertical" size="middle">
            {analysis_mode.length > 0 && (
              <Space>
                <Typography.Text>Reuse Mode</Typography.Text>
                <Switch
                  disabled={analysis_mode[0].content.props.readonly}
                  checked={analysisChecked}
                  onChange={(checked) => {
                    analysis_mode[0].content.props.onChange(
                      checked ? "true" : undefined,
                    );
                    setAnalysisChecked(checked);
                  }}
                />
              </Space>
            )}
            <Select
              value={active}
              onChange={(val) => updateActive(val)}
              style={{ width: 220 }}
              options={tabs.map((tab) => ({
                value: tab.name,
                label: tab.title || tab.content.props.schema.title || tab.name,
                className: isFieldContainsError(tab) && "tabItemError",
              }))}
            />
          </Space>
        </Row>
      )}

      <Layout.Content
        style={{ height: "100%", overflowX: "hidden", paddingBottom: "24px" }}
      >
        <Row justify="center">
          <Col span={20} style={{ padding: "10px 0" }}>
            {activeTabContent.map((item) => item.content)}
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
};

TabField.propTypes = {
  uiSchema: PropTypes.object,
  properties: PropTypes.object,
  idSchema: PropTypes.array,
};

export default TabField;
