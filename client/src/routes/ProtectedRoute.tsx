import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function ProtectedRoute() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
