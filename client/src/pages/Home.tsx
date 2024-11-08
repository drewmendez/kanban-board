import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated()) {
    return <Navigate to="/tasks" replace />;
  }

  return (
    <>
      <Navbar />
      <main className="h-screen bg-bgWhite py-[96px]">
        <div className="container flex h-full items-center justify-center">
          <div className="flex flex-col items-center justify-center space-y-7 text-center text-textBlack">
            <h1 className="text-6xl font-bold">Stay Organized, Achieve More</h1>
            <p className="w-full max-w-[850px]">
              Simplify your workflow with our intuitive task management app.
              Keep track of tasks, set priorities, and stay focused on what
              matters most—whether you're working solo or with a team. Get more
              done effortlessly!
            </p>
            <Link to="/sign-in">
              <button className="gap flex items-center gap-2 rounded-xl bg-primary px-6 py-4 font-semibold tracking-wider text-white">
                Get Started <ArrowRight />
              </button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
