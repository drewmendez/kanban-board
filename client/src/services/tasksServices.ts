import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import { Task, TaskForm, TaskPost } from "../types/types";

export const useGetAllTask = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await apiClient.get("/tasks/all");
      return response.data as Task[];
    },
  });
};

export const useGetTaskById = (task_id: number) => {
  return useQuery({
    queryKey: ["task", task_id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/tasks/${task_id}`);
      return data as Task;
    },
  });
};

export const useGetTasksByStatus = (status: string) => {
  return useQuery({
    queryKey: ["tasks", status],
    queryFn: async () => {
      const response = await apiClient.get(`/tasks?status=${status}`);
      return response.data as Task[];
    },
  });
};

export const useAddTask = () => {
  return useMutation({
    mutationFn: async (data: TaskPost) => {
      return await apiClient.post("/tasks", data);
    },
  });
};

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: async (task_id: number) => {
      return await apiClient.delete(`/tasks/${task_id}`);
    },
  });
};

export const useUpdateTask = () => {
  return useMutation({
    mutationFn: async ({
      task_id,
      data,
    }: {
      task_id: number;
      data: TaskForm;
    }) => {
      return await apiClient.put(`/tasks/${task_id}`, data);
    },
  });
};

export const useUpdateTaskStatus = () => {
  return useMutation({
    mutationFn: async ({
      task_id,
      data,
    }: {
      task_id: number;
      data: { status: string };
    }) => {
      return await apiClient.patch(`/tasks/${task_id}`, data);
    },
  });
};
