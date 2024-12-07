import { Link, useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import FormSelect from "../components/FormSelect";
import FormTextArea from "../components/FormTextArea";
import { ArrowLeftCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskForm, TaskFormSchema } from "../types/types";
import { useAddTask } from "../services/tasksServices";

export default function AddTask() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskForm>({
    resolver: zodResolver(TaskFormSchema),
  });

  const navigate = useNavigate();
  const { mutate: addTask } = useAddTask();

  const onSubmit = (data: TaskForm) => {
    addTask(data, { onSuccess: () => navigate("/tasks", { replace: true }) });
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
            Add New Task
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
            className="pointer-events-none max-w-max rounded-lg border p-2 uppercase outline-none"
            tabIndex={-1}
            {...register("status_id", { valueAsNumber: true })}
          />
          <button className="w-full rounded-md bg-primary py-3 font-bold tracking-wider text-white">
            Add
          </button>
        </form>
      </div>
    </main>
  );
}
