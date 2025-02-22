import Button from "../Button";
import { ChatGroup } from "../../hooks/useChatGroup";

import { User } from "../../hooks/useUsers";
import { useForm } from "react-hook-form";
export type ChatFormInputs = {
  title: string;
  adminId?: string;
  users: string[];
};
function ChatForm({
  chat,
  users,
  onSubmit,
  setChat,
}: {
  users: User[];
  setChat: React.Dispatch<React.SetStateAction<ChatGroup | undefined>>;
  chat: ChatGroup;
  onSubmit: (data: ChatFormInputs) => void;
}) {
  const { register, handleSubmit } = useForm<ChatFormInputs>({
    values: {
      title: chat.title,
      users: chat.users.map(({ id }) => id),
      adminId: chat.adminId,
    },
  });
  return (
    <div className="flex justify-center w-full items-center p-3 m-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[70%] flex-col items-center gap-2 flex justify-center"
      >
        <label htmlFor="title" className="translate-x-[10000px] absolute">
          Title
        </label>
        <input
          type="text"
          id="title"
          className="bg-zinc-700 rounded-2xl  w-[70%]  p-3 "
          {...register("title", { required: true })}
        />
        <label htmlFor="admin" className="translate-x-[10000px] absolute">
          Admin
        </label>
        <select
          id="admin"
          className="bg-zinc-700 rounded-2xl  w-[70%]  p-3"
          {...register("adminId", { required: true })}
        >
          {users.map((user) => (
            <option value={user.id} key={user.id}>
              {user.email}
            </option>
          ))}
        </select>
        <label htmlFor="users" className="translate-x-[10000px] absolute">
          Users
        </label>
        <select
          id="users"
          multiple
          className="bg-zinc-700 rounded-2xl  w-[70%] pb-0  p-3"
          {...register("users", { required: true })}
        >
          {users
            
            .map((user) => (
              <option value={user.id} key={user.id}>
                {user.email}
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
              setChat(undefined);
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

export default ChatForm;
