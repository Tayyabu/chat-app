import { SubmitHandler, useForm } from "react-hook-form";

import { Link, useNavigate } from "react-router-dom";
import { register as registerUser } from "../state/authStore.ts";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../components/Button.tsx";
import { customToastError } from "../lib/utils.ts";
export type RegisterFormInputs = {
  email: string | null;
  password: string | null;
};
function Register() {
 
  const navigate = useNavigate();
  const client = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<RegisterFormInputs>();
  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      await registerUser(data);
      reset();
      client.invalidateQueries({ queryKey: ["chatGroups", "users"] });

      navigate("/");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      reset();
      if (typeof error.status === "number") {
        if (error.status === 409) {
          customToastError(
            `Conflict - User with email ${data.email} already Exists`
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
    <main className="w-full flex  h-full overflow-hidden items-center justify-center">
      <form
        className="shadow-md min-w-[500px]  flex flex-col dark:bg-zinc-900 rounded-lg  gap-3 p-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl font-semibold">Register</h1>
  
        <div className="flex flex-col justify-center">
          <label className="absolute  translate-x-[10000px]" htmlFor="email">
            Email
          </label>
          <input
            className="w-full dark:bg-zinc-800 px-2 outline-green-400 py-3"
            id="email"
            placeholder="Email"
            {...register("email", {
              required: { value: true, message: "this field is required" },
            })}
            type="email"
          />
          {errors.email && (
            <p className="text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <label className="absolute translate-x-[10000px]" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="w-full px-2 dark:bg-zinc-800  outline-green-400 py-3"
            placeholder="Password"
            type="password"
            {...register("password", {
              required: { value: true, message: "this field is required" },
            })}
          />
          {errors.password && (
            <p className="text-red-600">{errors.password.message}</p>
          )}
        </div>
        <div>
          Already have an account{" "}
          <Link className="font-semibold underline" to={"/login"}>
            Sign in
          </Link>
        </div>
        <div className="flex justify-end">
          <Button disabled={isSubmitting && isSubmitted}>
            {!isSubmitting ? "Submit" : "Submitting"}
          </Button>
        </div>
      </form>
    </main>
  );
}

export default Register;
