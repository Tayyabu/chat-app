import { Edit2, Trash2 } from "lucide-react";
import Button from "../../components/Button";
import { Loading } from "../../components/Loading";
import useAllChats from "../../hooks/admin/useAllChats";
import useAllMessages from "../../hooks/admin/useAllMessages";
import { useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customToast, customToastError, isAuthorized } from "../../lib/utils";
import MessageEditForm, {
  MessageEditFormInputs,
} from "../../components/admin/MessageEditForm";
import { Message } from "../../hooks/useChatMessaages";
import { SubmitHandler } from "react-hook-form";
import { api } from "../../api/api";

function Messages() {
  const [message, setMessage] = useState<Message>();
  const { data, isLoading } = useAllMessages();
  const { data: users } = useUsers();
  const { data: chats } = useAllChats();
  const client = useQueryClient();
  const deleteMessageMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/messages/${id}`),
    onSuccess() {
      client.invalidateQueries({ queryKey: ["chatMessages"] });
      customToast("Message Delete Successfully");
      setMessage(undefined);
    },
    onError() {
      customToastError(
        updateMessageMutation.error?.message ?? "Something Went Wrong"
      );
      deleteMessageMutation.reset();
    },
  });
  const updateMessageMutation = useMutation({
    mutationFn: (data: MessageEditFormInputs) =>
      api.put(`/api/messages/${message?.id}`, data),
    onSuccess() {
      client.invalidateQueries({ queryKey: ["chatMessages"] });
      customToast("Message Updated Successfully");
      setMessage(undefined);
    },
    onError() {
      customToastError(
        updateMessageMutation.error?.message ?? "Something Went Wrong"
      );
      updateMessageMutation.reset();
    },
  });
  const onSubmit: SubmitHandler<MessageEditFormInputs> = (data) => {
    updateMessageMutation.mutate(data);
  };
  const messagesRows = data?.map((message) => {
    const sender = users?.find((user) => user.id === message.senderId);
    const chat = chats?.find((chat) => chat.id === message.chatId);

    return (
      <tr key={message.id}>
        <td className={`px-3  text-center border `}>
          {message.id.substring(0, 5)}
        </td>
        <td className="px-3 text-center border ">
          {message.content.substring(0, 30)}...
        </td>
        <td className="px-3 text-center border ">{sender?.email}</td>
        <td className="px-3 text-center border ">{chat?.title}</td>
        <td className="px-3 flex justify-center items-center gap-2 py-1 text-center border ">
          {isAuthorized(["Admin"]) && (
            <Button
              onClick={() => {
                deleteMessageMutation.mutate(message.id);
                console.log(deleteMessageMutation.status);
              }}
              className="bg-red-500 px-3 hover:bg-red-400"
            >
              <Trash2 />
            </Button>
          )}

          <Button onClick={() => setMessage(message)}>
            <Edit2 />
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <div className="h-screen  ">
      <div className="container flex justify-center ">
        <h2 className="text-4xl mt-5 font-semibold px-5">Messages</h2>
      </div>
      {message && chats?.length && users?.length && (
        <MessageEditForm
          onSubmit={onSubmit}
          users={users}
          chats={chats}
          setMessage={setMessage}
          message={message}
        />
      )}
      {!data?.length && isLoading ? (
        <div className="h-full m-7 w-full grid place-content-center">
          <div className="text-2xl">
            <Loading />
          </div>
        </div>
      ) : !data?.length && !isLoading ? (
        <div className="container bg-zinc-800 w-full flex h-full items-center justify-center ">
          <h1>No Message Found</h1>
        </div>
      ) : (
        <div className="w-full bg-zinc-800  ">
          <div className="w-full p-3 flex justify-center">
            <table className="bg-zinc-800  ">
              <thead>
                <tr className="">
                  <th className=" bg-green-500 border-0 rounded-tl-2xl ">#</th>
                  <th className=" bg-green-500 border-0 ">content</th>
                  <th className=" bg-green-500 border-0 ">Sender Email</th>
                  <th className=" bg-green-500 border-0  ">Chat Name</th>
                  <th className=" bg-green-500 border-0  rounded-tr-2xl">
                    Edit/Delete
                  </th>
                </tr>
              </thead>
              <tbody>{messagesRows}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
