import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRoute() {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    const redirectUrl = location.pathname + location.search;
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }

  return <Outlet />;
}
