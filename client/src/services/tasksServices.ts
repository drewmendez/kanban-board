import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import { Status, Task, TaskForm, TaskPost } from "../types/types";

export const useGetAllTask = () => {
  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await apiClient.get("/tasks/all");
      return response.data;
    },
    staleTime: Infinity,
  });
};

export const useGetTaskById = (task_id: number) => {
  return useQuery<Task>({
    queryKey: ["task", task_id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/tasks/${task_id}`);
      return data;
    },
  });
};

export const useGetTasksByStatusId = (status_id: number) => {
  return useQuery<Task[]>({
    queryKey: ["tasks", status_id],
    queryFn: async () => {
      const response = await apiClient.get(`/tasks?status=${status_id}`);
      return response.data;
    },
  });
};

export const useAddTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TaskPost) => {
      return await apiClient.post("/tasks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      task_id,
      status_id,
    }: {
      task_id: number;
      status_id: number;
    }) => {
      return await apiClient.delete(`/tasks/${task_id}/${status_id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      task_id,
      data,
    }: {
      task_id: number;
      data: TaskForm & { old_status_id: number };
    }) => {
      return await apiClient.put(`/tasks/${task_id}`, data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
};

export const useUpdateTaskStatusAndReorder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      task_id,
      data,
    }: {
      task_id: number;
      data: { status_id: number; order_id: number; old_status_id: number };
    }) => {
      return await apiClient.patch(`/tasks/${task_id}`, data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
};

export const useGetStatuses = () => {
  return useQuery<Status[]>({
    queryKey: ["statuses"],
    queryFn: async () => {
      const { data } = await apiClient.get("/statuses");
      return data;
    },
    staleTime: Infinity,
  });
};
