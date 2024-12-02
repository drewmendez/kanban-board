import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { useGetAllTask, useUpdateTaskStatus } from "../services/tasksServices";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";

import { useEffect, useState } from "react";
import { Task } from "../types/types";
import TaskCard from "../components/TaskCard";
import TasksContainer from "../components/TaskContainer";

export default function TasksPage() {
  const containers = ["todo", "in-progress", "completed"];
  const [tasks, setTasks] = useState<Task[]>([]);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const { data: initialTasks, isFetching } = useGetAllTask();
  const { mutate: updateStatus } = useUpdateTaskStatus();

  useEffect(() => {
    if (!isFetching && initialTasks) {
      setTasks(initialTasks);
    }
  }, [isFetching]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as number;
    const newStatus = over.id as Task["status"];

    setTasks(() =>
      tasks.map((task) =>
        task.task_id === taskId ? { ...task, status: newStatus } : task,
      ),
    );

    // update status in database
    updateStatus({ task_id: taskId, data: { status: newStatus } });

    setActiveId(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  return (
    <main className="h-screen bg-bgWhite py-[96px]">
      <div className="container h-full pb-20 pt-14">
        <div className="grid h-full grid-cols-3 gap-5">
          <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            {containers.map((container) => (
              <div key={container}>
                <p
                  className={`rounded-tl-xl rounded-tr-xl py-3 text-center font-bold uppercase tracking-wider text-white ${container === "todo" ? "bg-red-400" : container === "in-progress" ? "bg-blue-400" : "bg-green-400"}`}
                >
                  {container}
                </p>

                <TasksContainer container={container} tasks={tasks} />
              </div>
            ))}

            <DragOverlay>
              {activeId ? (
                <TaskCard
                  {...tasks.find((task) => task.task_id === activeId)!}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        <Link
          to="/tasks/add-task"
          className="mx-auto mt-16 flex max-w-max gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white"
        >
          Add Task <Plus />
        </Link>
      </div>
    </main>
  );
}
