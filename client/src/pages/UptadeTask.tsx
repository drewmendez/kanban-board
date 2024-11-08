import { ArrowLeftCircle } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormField from "../components/FormField";
import FormTextArea from "../components/FormTextArea";
import FormSelect from "../components/FormSelect";
import { useForm } from "react-hook-form";
import { TaskForm, TaskFormSchema } from "../types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useGetTaskById, useUpdateTask } from "../services/tasksServices";

export default function UptadeTask() {
  const { task_id } = useParams();
  const parsedTask_id = parseInt(task_id!);
  const { data: task } = useGetTaskById(parsedTask_id);
  const { mutate: updateTask } = useUpdateTask();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskForm>({
    resolver: zodResolver(TaskFormSchema),
  });

  useEffect(() => {
    reset({
      title: task?.title,
      content: task?.content,
      status: task?.status,
    });
  }, [task, reset]);

  const onSubmit = (data: TaskForm) => {
    updateTask(
      { task_id: parsedTask_id, data },
      { onSuccess: () => navigate("/tasks", { replace: true }) },
    );
  };

  return (
    <main className="h-screen bg-bgWhite pt-[96px]">
      <div className="container flex h-full flex-col items-center justify-center">
        <Link
          className="mr-auto flex items-center gap-2 rounded-md border border-black bg-gray-200 p-2 hover:underline"
          to="/tasks"
        >
          <ArrowLeftCircle /> Back
        </Link>
        <form
          className="w-full max-w-[500px] space-y-3 rounded-xl bg-white p-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="text-center text-3xl font-bold text-textBlack">
            Edit Task
          </h3>
          <FormField
            label="Title"
            {...register("title")}
            error={errors.title?.message}
          />
          <FormTextArea
            label="Description"
            rows={6}
            {...register("content")}
            error={errors.content?.message}
          />
          <FormSelect
            label="Status"
            {...register("status")}
            error={errors.status?.message}
          />
          <button className="w-full rounded-md bg-primary py-3 font-bold tracking-wider text-white">
            Update
          </button>
        </form>
      </div>
    </main>
  );
}
