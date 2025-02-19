import { Edit2Icon, Trash2Icon } from "lucide-react";
import { Message } from "../hooks/useChatMessaages";
import { customToastError, formatDate } from "../lib/utils";
import { useSocket } from "../context/SocketContext";
import { useState } from "react";
import useSingleUser from "../hooks/useSingleUser";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "./Button";
import ProfileImage from "./ProfileImage";

type ChatMessageProps = {
  isSender: boolean;
} & Partial<Message>;
export const ChatMessage = ({
  id,
  senderId,
  content,
  isSender,
  createdAt,
  updatedAt

}: ChatMessageProps) => {
  const socket = useSocket();
  const [isEditable, setEditable] = useState(false);
  const {data:user} = useSingleUser(senderId ?? "")
  const { register, handleSubmit } = useForm<{ content: string }>();
  const onSubmit: SubmitHandler<{ content: string }> = (data) => {
    try {
      if (content !== data.content) {
        socket?.emit("edit-message", { id, content: data.content });
        
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      customToastError("Something went wrong");
    }
    setEditable(false)
  };
  return (
    <div className={`flex ${!isSender ? "justify-start" : "justify-end"} mb-2`}>
     <div>{ !isSender && <ProfileImage size={50} src={user?.profilePic as string}/>}</div>
      <div
        className={`flex    rounded-lg flex-col px-1 pt-1 ${
          isSender ? "bg-green-400 " : "bg-gray-400"
        }`}
      >
        {isEditable ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={` container grow w-full  flex rounded-lg $ bg-green-500 text-white`}
          >
            <input
              defaultValue={content}
              {...register("content", {
                required: { value: true, message: "Please Enter Something" },
              })}
              className="  grow p-3  rounded-tl-lg rounded-bl-lg $ bg-green-500 text-white"
            />
            <Button className="bg-green-600 rounded-tl-lg rounded-bl-lg m-0 h-full">
              Save
            </Button>
          </form>
        ) : (
          <div
            className={` text-wrap grow p-3 rounded-lg ${
              !isSender
                ? "bg-gray-300 text-gray-900"
                : "bg-green-500 w-full text-white"
            }`}
          >
            {content}
          </div>
        )}
        <div className="flex justify-between gap-6 px-3 py-1">
          {isSender && (
            <div className="flex justify-between gap-2">
              <button onClick={() => setEditable((pre) => !pre)}>
                <Edit2Icon />
              </button>
              <button
                onClick={() => {
                  socket?.emit("delete-message", id);
                }}
                className="text-red-500"
              >
                <Trash2Icon />
              </button>
            </div>
          )}
          <span>{updatedAt && formatDate(new Date(updatedAt))}</span>
          {(new Date(createdAt as string).valueOf() !== new Date(updatedAt as string).valueOf() ) && <span>(edited)</span>}
        </div>
      </div>
      <div>{ isSender && <ProfileImage size={50} src={user?.profilePic as string}/>}</div>
    </div>
  );
};
