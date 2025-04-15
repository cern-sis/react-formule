import { memo, useRef, ReactNode } from "react";
import { useDrop, useDrag, XYCoord } from "react-dnd";

interface DragItem {
  index: number;
  id: number;
}

interface SortableBoxProps {
  children: ReactNode;
  parent: string;
  id: number;
  index: number;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragCancel: () => void;
  updateVisualOrder: (dragIndex: number, hoverIndex: number) => void;
  moveItem: () => void;
}

function SortableBox({
  children,
  parent,
  id,
  index,
  onDragStart,
  onDragEnd,
  onDragCancel,
  moveItem,
  updateVisualOrder,
}: SortableBoxProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag<
    DragItem,
    void,
    { isDragging: boolean }
  >({
    type: `RE-${parent}`,
    item: () => {
      onDragStart();
      return { index, id };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (_, monitor) => {
      onDragEnd();

      // Handle drag cancellation (escape key press or drop outside container)
      if (!monitor.didDrop()) {
        onDragCancel();
      }
    },
  });

  const [, drop] = useDrop<DragItem, void, void>({
    accept: `RE-${parent}`,
    hover: (item: DragItem, monitor) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset() as XYCoord;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      updateVisualOrder(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    drop: () => {
      moveItem();
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        color: "white",
        textAlign: "center",
        height: "100%",
        opacity: isDragging ? 0.25 : 1,
        cursor: "move",
      }}
    >
      {children}
    </div>
  );
}

export default memo(SortableBox);
