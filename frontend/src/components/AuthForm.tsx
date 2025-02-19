import { SubmitHandler, useForm } from "react-hook-form";
import Button from "./Button";
import { ReactNode } from "react";

export type LoginFormInputs = {
  email: string | null;
  password: string | null;
};

function AuthForm({
  onSubmit,
  title,
  metaData,
}: {
  onSubmit: SubmitHandler<LoginFormInputs>;
  title: string;
  metaData: ReactNode;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  return (
    <form
      className="shadow-md min-w-[500px]  flex flex-col dark:bg-zinc-900 rounded-lg  gap-3 p-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-2xl font-semibold">{title}</h1>
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
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
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
      {metaData}
      <div className="flex justify-end">
        <Button>Submit</Button>
      </div>
    </form>
  );
}

export default AuthForm;
