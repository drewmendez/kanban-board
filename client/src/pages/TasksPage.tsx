import { Edit, Move, Plus, Trash } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { type Task } from "../types/types";
import {
  useDeleteTask,
  useGetAllTask,
  useUpdateTaskStatus,
} from "../services/tasksServices";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  UniqueIdentifier,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";

export default function TasksPage() {
  const containers = ["todo", "in-progress", "completed"];
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const { data: initialTasks, isFetching } = useGetAllTask();
  const { mutate: updateStatus } = useUpdateTaskStatus();

  useEffect(() => {
    if (!isFetching) {
      setTasks(initialTasks!);
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

    setIsDragging(false);
    setActiveId(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
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

                <TasksContainer
                  container={container}
                  tasks={tasks}
                  isDragging={isDragging}
                  activeId={activeId}
                />
              </div>
            ))}
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

interface TasksContainerProp {
  container: string;
  tasks: Task[];
  isDragging: boolean;
  activeId: UniqueIdentifier | null;
}

function TasksContainer({
  container,
  tasks,
  isDragging,
  activeId,
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
          <Task
            key={task.task_id}
            {...task}
            isDragging={isDragging}
            activeId={activeId}
          />
        ))}
    </div>
  );
}

type TaskProps = Task & {
  isDragging: boolean;
  activeId: UniqueIdentifier | null;
};

function Task({
  task_id,
  author,
  title,
  content,
  isDragging,
  activeId,
}: TaskProps) {
  const { currentUser } = useAuth();
  const { mutate: deleteTask } = useDeleteTask();
  const queryClient = useQueryClient();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task_id,
  });
  const [width, setWidth] = useState("");
  const widthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWidth(`${widthRef.current?.offsetWidth}px`);

    const handleResize = () => {
      setWidth(`${widthRef.current?.offsetWidth}px`);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        width: width,
      }
    : undefined;

  const handleDeleteTask = () => {
    deleteTask(task_id, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });
  };

  return (
    <div
      className={`z-10 cursor-default rounded-md bg-white shadow-md ${isDragging && activeId === task_id && "fixed"}`}
      style={style}
      {...attributes}
      ref={setNodeRef}
    >
      <div className="divide-y p-4" ref={widthRef}>
        <p className="flex justify-between py-2 font-semibold text-slate-500 first:pt-0">
          <span>{title}</span>{" "}
          <Move className="cursor-pointer" {...listeners} />
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
    </div>
  );
}
