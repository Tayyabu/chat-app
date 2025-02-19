import { SubmitHandler } from "react-hook-form";
import type { LoginFormInputs } from "../components/AuthForm";
import LoginForm from "../components/AuthForm";
import useAuthStore from "../state/authStore.ts";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../state/authStore.ts";
import { useQueryClient } from "@tanstack/react-query";
import { customToast, customToastError } from "../lib/utils.ts";
function Login() {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const client = useQueryClient();
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      await login(data);
      client.invalidateQueries({ queryKey: ["chatGroups", "users"] });
      if (accessToken) {
        customToast(`You are logged in as ${data.email}`);
      }
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (typeof error.status === "number") {
        customToast(`${error.status}`)
        
        if (error?.status === 401) {
          customToastError(
            `You are unauthorized person`
          );
        } else if (error.status === 400) {
          customToastError(`Invalid data`);
        } else {
          customToastError("Something went wrong");
        }
      } else {
        customToastError("Something went wrong");
      }
    }
  };
  return (
    <main className="w-full flex  h-screen items-center justify-center">
      <LoginForm
        title="Login"
        onSubmit={onSubmit}
        metaData={
          <>
            Not have an account{" "}
            <Link className="font-semibold underline" to={"/register"}>
              Create one
            </Link>
          </>
        }
      />
    </main>
  );
}

export default Login;
