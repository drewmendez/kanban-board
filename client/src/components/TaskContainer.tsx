import { useDroppable } from "@dnd-kit/core";
import { Status, Task } from "../types/types";
import TaskCard from "./TaskCard";
import { SortableContext } from "@dnd-kit/sortable";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

interface TasksContainerProp {
  tasks: Task[];
  container: Status;
}

export default function TasksContainer({
  tasks,
  container,
}: TasksContainerProp) {
  const { setNodeRef } = useDroppable({
    id: container.status_id + container.status_title,
    data: {
      type: "container",
      container,
    },
  });

  return (
    <>
      <SortableContext items={tasks.map((task) => task.task_id)}>
        <div
          className="scrollbar flex max-h-[620px] min-h-[173px] flex-col gap-4 overflow-y-auto overflow-x-hidden rounded-bl-xl rounded-br-xl bg-slate-200 p-4 shadow-lg"
          ref={setNodeRef}
        >
          {tasks.length ? (
            tasks.map((task) => <TaskCard key={task.task_id} task={task} />)
          ) : (
            <div className="flex h-full w-full flex-1 items-center justify-center text-gray-400 outline-dashed outline-2 outline-gray-400">
              No task here
            </div>
          )}
        </div>
      </SortableContext>
      <Link
        to={`/tasks/add-task/${container.status_id}`}
        className="flex w-full justify-center gap-2 rounded-bl-xl rounded-br-xl bg-gray-300 px-6 py-3 font-bold text-white transition hover:brightness-75"
      >
        Add Task <Plus />
      </Link>
    </>
  );
}
