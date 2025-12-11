import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // If not logged in → redirect
  if (!user) return <Navigate to="/login" replace />;

  // If logged in but NOT admin → redirect to homepage
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}
