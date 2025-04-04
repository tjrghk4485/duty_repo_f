import { Navigate, Outlet } from "react-router-dom";

const isLogin = !!localStorage.getItem("bagtoken");

const PrivateRoute = () => {
  return isLogin ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;