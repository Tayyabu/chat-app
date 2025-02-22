import Button from "../Button";
import { ChatGroup } from "../../hooks/useChatGroup";
import { Message } from "../../hooks/useChatMessaages";
import { User } from "../../hooks/useUsers";
import { useForm } from "react-hook-form";
export type MessageEditFormInputs = {
  content: string;
  senderId: string;
  chatId: string;
};
function MessageEditForm({
  message: { content, senderId, chatId },
  users,
  chats,
  onSubmit,
  setMessage,
}: {
  message: Message;
  users: User[];
  setMessage: React.Dispatch<React.SetStateAction<Message | undefined>>;
  chats: ChatGroup[];
  onSubmit: (data: MessageEditFormInputs) => void;
}) {
  const { register, handleSubmit } = useForm({
    values: { content, senderId, chatId },
  });
  return (
    <div className="flex justify-center w-full items-center p-3 m-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[70%] flex-col items-center gap-2 flex justify-center"
      >
        <label htmlFor="message" className="translate-x-[10000px] absolute">
          Message
        </label>
        <input
          type="text"
          id="message"
          className="bg-zinc-700 rounded-2xl  w-[70%]  p-3 "
          {...register("content", { required: true })}
        />
        <label htmlFor="user" className="translate-x-[10000px] absolute">
          User
        </label>
        <select
          id="user"
          className="bg-zinc-700 rounded-2xl  w-[70%]  p-3"
          {...register("senderId", { required: true })}
        >
          {users.map((user) => (
            <option value={user.id} key={user.id}>
              {user.email}
            </option>
          ))}
        </select>
        <select
          id="chat"
          className="bg-zinc-700 rounded-2xl  w-[70%]  p-3"
          {...register("chatId", { required: true })}
        >
          {chats.map((chat) => (
            <option key={chat.id} value={chat.id}>
              {chat.title}
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
              setMessage(undefined);
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

export default MessageEditForm;
