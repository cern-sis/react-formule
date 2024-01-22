import { Button, Col, Row } from "antd";
import ArrowUpOutlined from "@ant-design/icons/ArrowUpOutlined";
import ArrowDownOutlined from "@ant-design/icons/ArrowDownOutlined";

const RenderFieldWithArrows = (card, cards, i, moveCard) => {
  if (card === undefined || card.prop === undefined) {
    return null;
  }
  return (
    <Row wrap={false}>
      <Col flex="auto">{card.prop.content}</Col>
      <Col>
        <Row>
          <Button
            disabled={i === 0}
            icon={<ArrowUpOutlined style={{ fontSize: "14px" }} />}
            onClick={() => moveCard(i, i - 1)}
            type="link"
            size="small"
            style={{ height: "16px" }}
          />
        </Row>
        <Row>
          <Button
            disabled={i === cards.length - 1}
            icon={<ArrowDownOutlined style={{ fontSize: "14px" }} />}
            onClick={() => moveCard(i, i + 1)}
            type="link"
            size="small"
            style={{ height: "16px" }}
          />
        </Row>
      </Col>
    </Row>
  );
};

export default RenderFieldWithArrows;
