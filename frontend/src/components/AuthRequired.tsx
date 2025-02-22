import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../state/authStore.ts";
import { isAuthorized } from "../lib/utils.ts";

function AuthRequired({ roles }: { roles: ("Admin" | "Staff" | "User")[] }) {
  const location = useLocation();
  const auth = useAuthStore();

  return isAuthorized(roles) ? (
    <Outlet />
  ) : auth.accessToken ? (
    <Navigate to={"/unauthorized"} state={{ from: location }} replace />
  ) : (
    <Navigate to={"/login"} state={{ from: location }} replace />
  );
}

export default AuthRequired;
