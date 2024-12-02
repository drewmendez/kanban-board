import { useDroppable } from "@dnd-kit/core";
import { Task } from "../types/types";
import DraggableWrapper from "./DraggableWrapper";
import TaskCard from "./TaskCard";

interface TasksContainerProp {
  container: string;
  tasks: Task[];
}

export default function TasksContainer({
  container,
  tasks,
}: TasksContainerProp) {
  const { setNodeRef } = useDroppable({
    id: container,
  });

  return (
    <div
      className="h-full max-h-[585px] gap-4 space-y-4 overflow-y-auto overflow-x-hidden rounded-bl-xl rounded-br-xl bg-slate-200 p-4 shadow-lg"
      ref={setNodeRef}
    >
      {tasks
        ?.filter((task) => task.status === container)
        .map((task) => (
          <DraggableWrapper key={task.task_id} id={task.task_id}>
            <TaskCard {...task} />
          </DraggableWrapper>
        ))}
    </div>
  );
}
