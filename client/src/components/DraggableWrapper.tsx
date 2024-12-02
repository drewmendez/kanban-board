import { useDraggable } from "@dnd-kit/core";

import React, { ReactElement } from "react";

interface DraggableProps {
  id: number | string;
  children: ReactElement;
}

export default function DraggableWrapper({ id, children }: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform, setActivatorNodeRef } =
    useDraggable({
      id: id,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style}>
      {React.cloneElement(children, {
        listeners: listeners,
        attributes: attributes,
        setActivatorNodeRef: setActivatorNodeRef,
      })}
    </div>
  );
}
