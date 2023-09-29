import PropTypes from "prop-types";
import { Menu, Switch, Typography, Row } from "antd";
import { isFieldContainsError } from "../utils";

const TabFieldMenu = ({
  tabs,
  active,
  analysis_mode,
  showReuseMode,
  analysisChecked,
  setAnalysisChecked,
  setActive,
}) => {
  return (
    <Menu
      mode="inline"
      selectedKeys={[active]}
      style={{ height: "100%", width: "220px" }}
      items={[
        analysis_mode.length > 0 &&
          showReuseMode && {
            key: "analysis_reuse_mode",
            label: (
              <Row align="middle" justify="space-between">
                <Typography.Text>Reuse Mode</Typography.Text>
                <Switch
                  disabled={analysis_mode[0].content.props.readonly}
                  checked={analysisChecked}
                  onChange={checked => {
                    analysis_mode[0].content.props.onChange(
                      checked ? "true" : undefined
                    );
                    setAnalysisChecked(checked);
                  }}
                />
              </Row>
            ),
          },
      ].concat(
        tabs.map(tab => ({
          key: tab.name,
          label: tab.title || tab.content.props.schema.title || tab.name,
          onClick: () => setActive(tab.name),
          danger: isFieldContainsError(tab)
        }))
      )}
    />
  );
};

TabFieldMenu.propTypes = {
  setActive: PropTypes.func,
  setActiveLabel: PropTypes.func,
  setAnalysisChecked: PropTypes.func,
  tabs: PropTypes.array,
  active: PropTypes.string,
  analysis_mode: PropTypes.array,
  showReuseMode: PropTypes.bool,
  analysisChecked: PropTypes.bool,
};

export default TabFieldMenu;
