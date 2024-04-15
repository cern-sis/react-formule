import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Col, List, Modal, Row, Typography } from "antd";
import { render } from "squirrelly";
import ArrowUpOutlined from "@ant-design/icons/ArrowUpOutlined";
import ArrowDownOutlined from "@ant-design/icons/ArrowDownOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import { isFieldContainsError } from "../utils";

const LayerArrayFieldTemplate = ({ items = [], uiSchema }) => {
  const [itemToDisplay, setItemToDisplay] = useState(null);
  const [visible, setVisible] = useState(false);

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
  }, [items]);

  const getActionsButtons = (item) => {
    if (!item.hasToolbar) return [];

    return [
      <Row key={item.key} gutter={4}>
        {(item.hasMoveUp || item.hasMoveDown) && (
          <Col>
            <Row>
              <Button
                key="up"
                icon={
                  <Row justify="center">
                    <ArrowUpOutlined />
                  </Row>
                }
                onClick={item.onReorderClick(item.index, item.index - 1)}
                disabled={item.disabled || item.readonly || !item.hasMoveUp}
                type="link"
                size="small"
                style={{ height: "16px" }}
              />
            </Row>
            <Row>
              <Button
                key="down"
                icon={
                  <Row justify="center">
                    <ArrowDownOutlined />
                  </Row>
                }
                onClick={item.onReorderClick(item.index, item.index + 1)}
                disabled={item.disabled || item.readonly || !item.hasMoveDown}
                type="link"
                size="small"
                style={{ height: "16px" }}
              />
            </Row>
          </Col>
        )}
        {item.hasRemove && (
          <Col>
            <Button
              onClick={item.onDropIndexClick(item.index)}
              key="delete"
              danger
              icon={<DeleteOutlined />}
              disabled={item.disabled || item.readonly}
              type="link"
              size="small"
              style={{ height: "32px" }}
            />
          </Col>
        )}
      </Row>,
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
            actions={getActionsButtons(item)}
            style={{
              border: "1px solid #f0f0f0",
              padding: "0 10px",
              marginBottom: "5px",
              backgroundColor: "white",
            }}
          >
            <List.Item.Meta
              title={
                <Typography.Text ellipsis>
                  {stringifyItem(
                    item?.children?.props?.uiSchema?.["ui:options"] ?? null,
                    item.children.props.formData,
                  ) || `Item #${item.index + 1}`}
                </Typography.Text>
              }
              onClick={() => {
                setVisible(true);
                setItemToDisplay({
                  index: item.index,
                  children: item.children,
                });
              }}
              style={{ padding: "10px 0" }}
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
