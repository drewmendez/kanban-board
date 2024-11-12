import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { signOut, currentUser, getCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(undefined, {
      onSuccess: () => {
        getCurrentUser();
        navigate("/", { replace: true });
      },
    });
  };

  return (
    <header className="fixed top-0 w-full bg-bgWhite py-6 shadow-lg">
      <nav className="container flex items-center justify-between">
        <Logo />
        {currentUser ? (
          <div className="flex items-center gap-6">
            <p className="text-slate-500">
              Signed in as:{" "}
              <span className="text-black">{currentUser.user}</span>
            </p>
            <button
              className="rounded-xl bg-gray-200 px-7 py-3 font-bold text-textBlack"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="space-x-5">
            <button className="rounded-xl bg-gray-200 px-7 py-3 font-bold text-textBlack">
              <Link to="/sign-up">Sign Up</Link>
            </button>
            <button className="rounded-xl bg-primary px-7 py-3 font-bold text-white">
              <Link to="/sign-in">Sign In</Link>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
