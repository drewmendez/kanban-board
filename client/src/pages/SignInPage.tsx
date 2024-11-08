import { Link, Navigate, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import FormField from "../components/FormField";
import { useForm } from "react-hook-form";
import { SignInForm, SignInFormSchema } from "../types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import axios, { AxiosError } from "axios";

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(SignInFormSchema),
  });

  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data: SignInForm) => {
    signIn(data, {
      onError: (error: Error | AxiosError) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.data.error === "email") {
            setError("email", {
              type: "server",
              message: error.response?.data.message,
            });
          } else {
            setError("password", {
              type: "server",
              message: error.response?.data.message,
            });
          }
        }
      },
      onSuccess: () => navigate("/tasks", { replace: true }),
    });
  };

  if (isAuthenticated()) {
    return <Navigate to="/tasks" replace />;
  }

  return (
    <main className="h-screen bg-bgWhite">
      <div className="container flex h-full items-center justify-center">
        <div className="w-full max-w-[450px] rounded-xl bg-white p-10 text-textBlack">
          <div className="mb-5 flex flex-col items-center justify-between gap-2">
            <Logo />
            <h2 className="text-center text-sm font-semibold">
              Sign in to continue
            </h2>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              label="Email"
              placeholder="Enter you email"
              {...register("email")}
              error={errors.email?.message}
            />
            <FormField
              label="Password"
              type="password"
              {...register("password")}
              error={errors.password?.message}
            />
            <button className="w-full rounded bg-primary py-3 font-semibold text-white">
              Sign In
            </button>
          </form>
          <p className="mt-3 text-center text-sm text-primary hover:underline">
            <Link to="/sign-up">Don't have an account yet? Sign up</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
