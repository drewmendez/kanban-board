import { Link, Navigate } from "react-router-dom";
import Logo from "../components/Logo";
import { useForm } from "react-hook-form";
import FormField from "../components/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpForm, SignUpFormSchema } from "../types/types";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(SignUpFormSchema),
  });

  const { signUp, currentUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data: SignUpForm) => {
    signUp(data, {
      onError: (error) => {
        setError("email", {
          type: "server",
          message: error.response?.data.message,
        });
      },
      onSuccess: () => navigate("/sign-in", { replace: true }),
    });
  };

  if (currentUser) {
    return <Navigate to="/tasks" replace />;
  }

  return (
    <main className="h-screen bg-bgWhite">
      <div className="container flex h-full items-center justify-center">
        <div className="w-full max-w-[450px] rounded-xl bg-white p-10 text-textBlack">
          <div className="mb-5 flex flex-col items-center justify-between gap-2">
            <Logo />
            <h2 className="text-center text-sm font-semibold">
              Sign up to continue
            </h2>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              label="First Name"
              placeholder="eg. Juan Antonio"
              {...register("firstname")}
              error={errors.firstname?.message}
            />
            <FormField
              label="Last Name"
              placeholder="eg. Dela Cruz"
              {...register("lastname")}
              error={errors.lastname?.message}
            />
            <FormField
              label="Email"
              placeholder="eg. juan@gmail.com"
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
              Sign Up
            </button>
          </form>
          <p className="mt-3 text-center text-sm text-primary hover:underline">
            <Link to="/sign-in">Already have an account? Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
