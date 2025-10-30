import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { List, Modal, theme, Typography } from "antd";
import { render } from "squirrelly";
import { isFieldContainsError } from "../utils";
import ArrayUtils from "./ArrayUtils";
import { ExpandOutlined } from "@ant-design/icons";

const LayerArrayFieldTemplate = ({ items = [], uiSchema, formContext }) => {
  const [itemToDisplay, setItemToDisplay] = useState(null);
  const [visible, setVisible] = useState(false);

  const { token } = theme.useToken();

  // FIXME: stringifyTmpl and stringify are deprecated and will be removed in favor of itemsDisplayTitle
  const stringifyItem = (options, item) => {
    const itemsDisplayTitle = uiSchema?.["ui:options"]?.itemsDisplayTitle;

    /**
     * @deprecated
     */
    const stringifyTmpl = options ? options.stringifyTmpl : null;
    if (itemsDisplayTitle || stringifyTmpl) {
      try {
        const str = render(itemsDisplayTitle || stringifyTmpl, item, {
          useWith: true,
        });
        return str;
      } catch (_err) {
        return null;
      }
    }

    /**
     * @deprecated
     */
    const stringify = options ? options.stringify : [],
      reducer = (acc, val) => (item[val] ? `${acc} ${item[val]}` : acc);

    return stringify ? stringify.reduce(reducer, "") : null;
  };

  useEffect(() => {
    if (items && itemToDisplay)
      setItemToDisplay({
        index: itemToDisplay.index,
        children: items[itemToDisplay.index].children,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const getActionsButtons = (item) => {
    if (!item.hasToolbar) return [];

    return [
      <ArrayUtils
        hasMoveDown={item.hasMoveDown}
        hasMoveUp={item.hasMoveUp}
        disabled={item.disabled}
        readonly={item.readonly}
        onReorderClick={item.onReorderClick}
        index={item.index}
        hasRemove={item.hasRemove}
        onDropIndexClick={item.onDropIndexClick}
        key={item.key}
      />,
    ];
  };

  if (items.length < 1) return null;

  return (
    <>
      <Modal
        className="__Form__"
        destroyOnClose
        open={visible}
        onCancel={() => {
          setVisible(false);
          setItemToDisplay(null);
        }}
        onOk={() => {
          setVisible(false);
          setItemToDisplay(null);
        }}
        width={720}
        data-cy="layerModal"
      >
        {/* FIXME: For some reason the form in the modal does not have the antd compact algorithm */}
        {itemToDisplay && itemToDisplay.children}
      </Modal>

      <List
        className="layerArrayFieldList"
        style={{ overflow: "auto" }}
        dataSource={items}
        renderItem={(item) => (
          <List.Item
            className={[
              "layerListItem",
              isFieldContainsError(item) && "layerItemError",
            ]}
            onClick={() => {
              setVisible(true);
              setItemToDisplay({
                index: item.index,
                children: item.children,
              });
            }}
            actions={getActionsButtons(item)}
            style={{
              border: `1px solid ${token.colorBorder}`,
              padding: formContext.compact ? "0 8px" : "0 16px",
              marginBottom: formContext.compact ? "2px" : "5px",
              backgroundColor: "white",
            }}
            extra={
              item.readonly && <ExpandOutlined style={{ fontSize: "10px" }} />
            }
          >
            <List.Item.Meta
              description={
                <Typography.Text ellipsis>
                  {stringifyItem(
                    item?.children?.props?.uiSchema?.["ui:options"] ?? null,
                    item.children.props.formData,
                  ) || `Item #${item.index + 1}`}
                </Typography.Text>
              }
              style={{ padding: formContext.compact ? "8px 0" : "12px 0" }}
            />
          </List.Item>
        )}
      />
    </>
  );
};

LayerArrayFieldTemplate.propTypes = {
  items: PropTypes.array,
};

export default LayerArrayFieldTemplate;
