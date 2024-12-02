import { Edit, Move, Trash } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDeleteTask } from "../services/tasksServices";
import { Link } from "react-router-dom";
import { type Task } from "../types/types";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { DraggableAttributes } from "@dnd-kit/core";

type TaskProps = Task & {
  listeners?: SyntheticListenerMap | undefined;
  attributes?: DraggableAttributes;
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
};

export default function TaskCard({
  task_id,
  author,
  title,
  content,
  listeners,
  attributes,
  setActivatorNodeRef,
}: TaskProps) {
  const { currentUser } = useAuth();
  const { mutate: deleteTask } = useDeleteTask();

  const handleDeleteTask = () => {
    deleteTask(task_id);
  };

  return (
    <div className="divide-y rounded-md bg-bgWhite p-4 shadow-md">
      <p className="flex justify-between py-2 font-semibold text-slate-500 first:pt-0">
        <span>{title}</span>{" "}
        <button
          {...listeners}
          {...attributes}
          ref={setActivatorNodeRef}
          className="touch-none"
        >
          <Move />
        </button>
      </p>
      <p className="py-2 text-slate-400">{content}</p>
      <div className="flex items-center justify-between py-2 last:pb-0">
        <p className="text-xs text-slate-400">
          Added by: {currentUser?.user === author ? "You" : author}
        </p>
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
