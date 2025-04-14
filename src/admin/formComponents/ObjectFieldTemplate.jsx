import { useMemo, useCallback, useState, useRef } from "react";
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
  const [tempItems, setTempItems] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const originalOrderRef = useRef(null);

  const { token } = theme.useToken();

  const dispatch = useDispatch();

  const sortedItems = useMemo(() => {
    return properties.map((prop, index) => ({
      id: index + 1,
      name: prop.name,
      prop,
    }));
  }, [properties]);

  const displayedItems = tempItems || sortedItems;

  const updateOrderInStore = useCallback(
    (items) => {
      const currentOrder = (uiSchema["ui:order"] || []).filter(
        (o) => o !== "*",
      );
      const newOrder = items.map((item) => item.name);

      if (JSON.stringify(newOrder) === JSON.stringify(currentOrder)) {
        return;
      }

      dispatch(
        updateUiSchemaByPath({
          path: formContext.uiSchema.length > 0 ? formContext.uiSchema : [],
          value: {
            ...uiSchema,
            "ui:order": [...newOrder, "*"],
          },
        }),
      );
    },
    [dispatch, formContext.uiSchema, uiSchema],
  );

  const onDragStart = useCallback(() => {
    if (!originalOrderRef.current) {
      originalOrderRef.current = [...sortedItems];
    }
    setIsDragging(true);
  }, [sortedItems]);

  // Handle drag cancellation (escape key press or drop outside container)
  const onDragCancel = useCallback(() => {
    if (originalOrderRef.current) {
      updateOrderInStore(originalOrderRef.current);
      originalOrderRef.current = null;
    }
    setTempItems(null);
  }, [updateOrderInStore]);

  const moveItem = useCallback(
    (dragIndex, hoverIndex) => {
      setTempItems((prevItems) => {
        const items = prevItems || [...sortedItems];
        const newItems = [...items];
        const [movedItem] = newItems.splice(dragIndex, 1);
        newItems.splice(hoverIndex, 0, movedItem);

        updateOrderInStore(newItems);

        return newItems;
      });
    },
    [sortedItems, updateOrderInStore],
  );

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
            onDragStart={onDragStart}
            onDragEnd={() => setIsDragging(false)}
            onDragCancel={onDragCancel}
            moveItem={moveItem}
            resetTempItems={() => setTempItems(null)}
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
