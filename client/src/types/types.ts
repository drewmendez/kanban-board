import { z } from "zod";

export const SignUpFormSchema = z.object({
  firstname: z.string().trim().min(1, "This field is required"),
  lastname: z.string().trim().min(1, "This field is required"),
  email: z.string().trim().min(1, "This field is required").email(),
  password: z.string().trim().min(6, "At least 6 characters"),
});

export type SignUpForm = z.infer<typeof SignUpFormSchema>;

export const SignInFormSchema = z.object({
  email: z.string().trim().min(1, "This field is required").email(),
  password: z.string().trim().min(6, "At least 6 characters"),
});

export type SignInForm = z.infer<typeof SignInFormSchema>;

export const TaskFormSchema = z.object({
  title: z.string().trim().min(1, "This field is required"),
  content: z.string().trim().min(1, "This field is required"),
  status_id: z.number(),
});

export type TaskForm = z.infer<typeof TaskFormSchema>;

export interface Task {
  task_id: number;
  author: string;
  title: string;
  content: string;
  order_id: number;
  status_id: number;
}

export type TaskPost = TaskForm & {
  user_id: number;
};

export interface ApiResponse {
  success: boolean;
  error?: string;
  message: string;
}

export type CurrentUser = {
  user_id: number;
  user: string;
};

export type Status = {
  status_id: number;
  status_title: string;
};
