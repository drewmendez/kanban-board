import { useEffect, useState } from "react";
import {
  useGetAllTask,
  useGetStatuses,
  useUpdateTaskStatus,
} from "../services/tasksServices";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Task } from "../types/types";
import TaskCard from "../components/TaskCard";
import TasksContainer from "../components/TaskContainer";

export default function TasksPage() {
  const { data: containers } = useGetStatuses();
  const [tasks, setTasks] = useState<Task[]>([]);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const { data: initialTasks, isFetching } = useGetAllTask();
  const { mutate: updateStatus } = useUpdateTaskStatus();

  useEffect(() => {
    if (!isFetching && initialTasks) {
      setTasks(initialTasks);
    }
  }, [isFetching]);

  const handleDragEnd = (event: DragEndEvent) => {
    // update status in database
    // updateStatus({ task_id: taskId, data: { status_id: newStatus } });
    const { active, over } = event;

    if (!over) return;

    const activeTaskId = active.id;
    const overId = over.id;

    if (activeTaskId === overId) return;

    const isOverATask = over.data.current?.type === "task";

    if (isOverATask) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex(
          (task) => task.task_id === activeTaskId,
        );
        const overTaskIndex = tasks.findIndex(
          (task) => task.task_id === overId,
        );

        tasks[activeTaskIndex].status_id = tasks[overTaskIndex].status_id;

        return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });
    } else {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex(
          (task) => task.task_id === activeTaskId,
        );

        tasks[activeTaskIndex].status_id =
          over.data.current?.container.status_id;

        return arrayMove(tasks, activeTaskIndex, activeTaskIndex);
      });
    }

    setActiveTask(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(event.active.data.current?.task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTaskId = active.id;
    const overId = over.id;

    if (activeTaskId === overId) return;

    const isOverATask = over.data.current?.type === "task";

    if (isOverATask) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex(
          (task) => task.task_id === activeTaskId,
        );
        const overTaskIndex = tasks.findIndex(
          (task) => task.task_id === overId,
        );

        tasks[activeTaskIndex].status_id = tasks[overTaskIndex].status_id;

        return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });
    } else {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex(
          (task) => task.task_id === activeTaskId,
        );

        tasks[activeTaskIndex].status_id =
          over.data.current?.container.status_id;

        return arrayMove(tasks, activeTaskIndex, activeTaskIndex);
      });
    }
  };

  return (
    <main className="h-screen bg-bgWhite pt-[96px]">
      <div className="container h-full pt-10">
        <DndContext
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
        >
          <div className="flex gap-5">
            {containers?.map((container) => (
              <div key={container.status_id} className="flex-1">
                <p
                  className={`rounded-tl-xl rounded-tr-xl py-3 text-center font-bold uppercase tracking-wider text-white ${container.status_title === "todo" ? "bg-red-400" : container.status_title === "in-progress" ? "bg-blue-400" : "bg-green-400"}`}
                >
                  {container.status_title}
                </p>

                <TasksContainer
                  tasks={tasks.filter(
                    (task) => task.status_id === container.status_id,
                  )}
                  container={container}
                />
              </div>
            ))}
          </div>

          {createPortal(
            <DragOverlay>
              {activeTask && <TaskCard task={activeTask} isOverlay />}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>
      </div>
    </main>
  );
}
