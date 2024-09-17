import PropTypes from "prop-types";
import { Collapse } from "antd";
import ArrayFieldTemplateItem from "./ArrayFieldTemplateItem";
import { isFieldContainsError } from "../utils";

const AccordionArrayFieldTemplate = ({ items = [], formContext, id }) => {
  if (items.length < 1) return null;

  return (
    <Collapse
      expandIconPosition="end"
      items={items.map((item, index) => ({
        key: index,
        label: `Item #${index + 1}`,
        children: (
          <ArrayFieldTemplateItem
            key={id + index}
            {...item}
            formContext={formContext}
          />
        ),
        className: isFieldContainsError(item) && "collapseItemError",
      }))}
    />
  );
};

AccordionArrayFieldTemplate.propTypes = {
  items: PropTypes.array,
  formContext: PropTypes.object,
  id: PropTypes.string,
};

export default AccordionArrayFieldTemplate;
