import { useState } from "react";
import {
  useGetAllTask,
  useGetStatuses,
  useUpdateTaskStatusAndReorder,
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
import { useTasks } from "../hooks/useTasks";

export default function TasksPage() {
  const { data: containers } = useGetStatuses();
  const { data: initialTasks } = useGetAllTask();
  const { mutate: updateStatusAndReorder } = useUpdateTaskStatusAndReorder();

  const { tasks, setTasks } = useTasks(initialTasks);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [targetStatusId, setTargetStatusId] = useState<number | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);
    setTargetStatusId(null);
    setOrderId(null);

    const activeTaskId = active.id;
    const overId = over?.id;

    if (!orderId) return;

    // Update status and reorder in database
    updateStatusAndReorder({
      task_id: activeTask?.task_id!,
      data: {
        status_id: targetStatusId!,
        order_id: orderId!,
        old_status_id: activeTask?.status_id!,
      },
    });

    if (!over) return;

    if (activeTaskId === overId) return;

    const isOverATask = over.data.current?.type === "task";

    if (isOverATask) {
      setTasks((data) => {
        const tasks = [...data];

        const activeTaskIndex = tasks.findIndex(
          (task) => task.task_id === activeTaskId,
        );
        const overTaskIndex = tasks.findIndex(
          (task) => task.task_id === overId,
        );

        return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });
    } else {
      setTasks((data) => {
        const tasks = [...data];

        const activeTaskIndex = tasks.findIndex(
          (task) => task.task_id === activeTaskId,
        );

        tasks[activeTaskIndex].status_id =
          over.data.current?.container.status_id;

        return arrayMove(tasks, activeTaskIndex, activeTaskIndex);
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    // Spread the active task object to have a separate reference from the tasks array.
    setActiveTask({ ...event.active.data.current?.task });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTaskId = active.id;
    const overId = over.id;

    const targetOverStatusId =
      over.data.current?.task?.status_id ||
      over.data.current?.container?.status_id;

    setTargetStatusId(targetOverStatusId);

    if (activeTaskId === overId) return;

    const isOverATask = over.data.current?.type === "task";

    if (isOverATask) {
      setTasks((data) => {
        const tasks = [...data];

        const activeTaskIndex = tasks.findIndex(
          (task) => task.task_id === activeTaskId,
        );
        const overTaskIndex = tasks.findIndex(
          (task) => task.task_id === overId,
        );

        setOrderId(tasks[overTaskIndex].order_id);

        tasks[activeTaskIndex].status_id = tasks[overTaskIndex].status_id;

        return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });
    }

    const isOverAContainer = over.data.current?.type === "container";

    if (isOverAContainer) {
      setTasks((data) => {
        const tasks = [...data];
        const activeTaskIndex = tasks.findIndex(
          (task) => task.task_id === activeTaskId,
        );

        const currentOverStatusId = over.data.current?.container.status_id;

        const numOfTask = tasks.filter(
          (task) => task.status_id === currentOverStatusId,
        ).length;

        tasks[activeTaskIndex].status_id = currentOverStatusId;

        setOrderId(numOfTask || 1);

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
