import { useEffect, useState } from "react";
import { Task } from "../types/types";

export const useTasks = (initialTasks: Task[] | undefined) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (initialTasks) {
      setTasks(initialTasks);
    }
  }, [initialTasks]);

  return { tasks, setTasks };
};
