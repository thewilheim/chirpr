import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const location = useLocation();

  const { userToken } = useSelector(state => state.auth);

  if (!userToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
