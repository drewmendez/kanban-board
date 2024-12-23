import { Edit, Move, Trash } from "lucide-react";
import { useDeleteTask } from "../services/tasksServices";
import { Link } from "react-router-dom";
import { type Task } from "../types/types";
import { CSS } from "@dnd-kit/utilities";

import { useSortable } from "@dnd-kit/sortable";

interface TaskProps extends React.HTMLAttributes<HTMLDivElement> {
  task: Task;
  isOverlay?: boolean;
}

export default function TaskCard({ task, isOverlay }: TaskProps) {
  const { task_id, title, content, status_id } = task;

  const { mutate: deleteTask } = useDeleteTask();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.task_id,
    data: {
      type: "task",
      task,
    },
    transition: {
      duration: 115,
      easing: "",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteTask = () => {
    deleteTask({ task_id, status_id });
  };

  return (
    <div
      className={`relative divide-y rounded-md bg-bgWhite p-4 shadow-md ${isDragging && "opacity-30"} ${isOverlay && "shadow-2xl outline outline-1 outline-gray-200"}`}
      ref={isOverlay ? undefined : setNodeRef}
      style={isOverlay ? undefined : style}
    >
      <p className="flex justify-between py-2 font-semibold text-slate-500 first:pt-0">
        <span>{title}</span>
        <button
          {...(isOverlay ? {} : listeners)}
          {...(isOverlay ? {} : attributes)}
          className="touch-none active:cursor-grabbing"
        >
          <Move />
        </button>
      </p>
      <p className="whitespace-pre-wrap py-2 text-slate-400">{content}</p>
      <div className="flex items-center justify-end py-2 last:pb-0">
        <div className="flex items-center gap-2">
          <Link
            className="rounded-full p-1.5 transition-all hover:bg-blue-200"
            to={`/tasks/update-task/${task_id}`}
          >
            <Edit size={15} />
          </Link>
          <button
            className="rounded-full p-1.5 transition-all hover:bg-red-200"
            onClick={handleDeleteTask}
          >
            <Trash size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
