import Button from "../Button";

import { User } from "../../hooks/useUsers";
import { useForm } from "react-hook-form";
const possibleRoles: Record<"User" | "Staff" | "Admin", string[]> = {
  User: ["User"],
  Staff: ["User", "Staff"],
  Admin: ["User", "Staff", "Admin"],
};
export type UserFormInputs = {
  email: string;
  roles: string;
};
function UserForm({
  user: { email, roles },
  onSubmit,
  setUser,
}: {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  onSubmit: (data: UserFormInputs) => void;
}) {
  const { register, handleSubmit } = useForm<UserFormInputs>({
    values: { email, roles:roles.join(',') },
  });
  return (
    <div className="flex justify-center w-full items-center p-3 m-2">
      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit(onSubmit)}
        className="w-[70%] flex-col items-center gap-2 flex justify-center"
      >
        <label htmlFor="message" className="translate-x-[10000px] absolute">
          Email
        </label>
        <input
          type="text"
          id="message"
          className="bg-zinc-700 rounded-2xl  w-[70%]  p-3 "
          {...register("email", { required: true })}
        />
        <label htmlFor="user" className="translate-x-[10000px] absolute">
          Roles
        </label>
        <select
          id="user"
          className="bg-zinc-700 rounded-2xl  w-[70%]  p-3"
          {...register("roles", { required: true })}
        >
          {Object.keys(possibleRoles).map((key) => (
            <option
              value={possibleRoles[key as keyof typeof possibleRoles]}
              key={key}
            >
              {key}
            </option>
          ))}
        </select>

        <div className="w-[70%]  flex gap-2">
          <Button type="submit" className="grow">
            Save
          </Button>
          <Button
            type="button"
            onClick={() => {
              setUser(undefined);
            }}
            className="bg-teal-500 grow hover:bg-teal-400 "
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;
