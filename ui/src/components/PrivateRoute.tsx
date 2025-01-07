import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "../utils/Auth/authService";

const PrivateRoute = () => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;