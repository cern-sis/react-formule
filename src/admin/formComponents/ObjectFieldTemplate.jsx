import { useMemo, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { updateUiSchemaByPath } from "../../store/schemaWizard";
import SortableBox from "./SortableBox";
import { theme } from "antd";

const ObjectFieldTemplate = ({
  properties,
  uiSchema,
  formContext,
  idSchema,
}) => {
  const [visualItems, setVisualItems] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const { token } = theme.useToken();

  const dispatch = useDispatch();

  const sortedItems = useMemo(() => {
    return properties.map((prop, index) => ({
      id: index + 1,
      name: prop.name,
      prop,
    }));
  }, [properties]);

  const displayedItems = visualItems || sortedItems;

  const updateVisualOrder = useCallback(
    (dragIndex, hoverIndex) => {
      setVisualItems((prevItems) => {
        const items = prevItems ? [...prevItems] : [...sortedItems];
        const [movedItem] = items.splice(dragIndex, 1);
        items.splice(hoverIndex, 0, movedItem);
        return items;
      });
    },
    [sortedItems],
  );

  const moveItem = useCallback(() => {
    dispatch(
      updateUiSchemaByPath({
        path: formContext.uiSchema.length > 0 ? formContext.uiSchema : [],
        value: {
          ...uiSchema,
          "ui:order": [...displayedItems.map((item) => item.name), "*"],
        },
      }),
    );
    setVisualItems(null);
  }, [dispatch, displayedItems, formContext.uiSchema, uiSchema]);

  if (idSchema.$id === "root") {
    return (
      <div
        style={{
          ...(isDragging && {
            position: "relative",
            outline: `1px solid ${token.colorPrimary}`,
            outlineOffset: "1px",
          }),
        }}
      >
        {displayedItems.map((item, i) => (
          <SortableBox
            key={item.id}
            parent={formContext.uiSchema}
            id={item.id}
            index={i}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            onDragCancel={() => setVisualItems(null)}
            updateVisualOrder={updateVisualOrder}
            moveItem={moveItem}
          >
            {item.prop.content}
          </SortableBox>
        ))}
      </div>
    );
  }
};

ObjectFieldTemplate.propTypes = {
  idSchema: PropTypes.object,
  properties: PropTypes.array,
  formContext: PropTypes.object,
  onUiSchemaChange: PropTypes.func,
  uiSchema: PropTypes.object,
};

export default ObjectFieldTemplate;
