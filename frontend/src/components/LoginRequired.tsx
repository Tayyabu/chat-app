import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../state/authStore.ts";

function LoginRequired() {
  const location = useLocation();
const accessToken  = useAuthStore(state=>state.accessToken)
  return !accessToken ? (
    <Navigate to={"/login"} state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
}

export default LoginRequired;
