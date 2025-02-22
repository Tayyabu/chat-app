import { useState } from "react";
import { ChatGroup } from "../../hooks/useChatGroup";

import useAllChats from "../../hooks/admin/useAllChats";
import Button from "../../components/Button";
import { Edit2, Trash2 } from "lucide-react";
import ChatForm, { ChatFormInputs } from "../../components/admin/ChatForm";
import { useUsers } from "../../hooks/useUsers";
import { Loading } from "../../components/Loading";
import { SubmitHandler } from "react-hook-form";
import { customToast, customToastError, isAuthorized } from "../../lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";

function Chats() {
  const [chat, setChat] = useState<ChatGroup>();
  const { data, isLoading } = useAllChats();
  const { data: users } = useUsers();
  const client = useQueryClient();
  const deleteChatMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/chats/${id}`),
    onSuccess() {
      client.invalidateQueries({ queryKey: ["chatGroups"] });
      customToast("Chat Delete Successfully");
      setChat(undefined);
    },
    onError() {
      customToastError(
        deleteChatMutation.error?.message ?? "Something Went Wrong"
      );
      console.log(deleteChatMutation.error);
      
      deleteChatMutation.reset();
    },
  });
  const updateChatMutation = useMutation({
    mutationFn: (data: ChatFormInputs) => {
      const dataToSend={
        ...data,
        users: data.users.map((id) => users?.find((u) => u.id === id)),
      }
      console.log(dataToSend);
      
      return api.put(`/api/chats/${chat?.id}`, dataToSend);
    },
    onSuccess() {
      client.invalidateQueries({ queryKey: ["chatGroups"] });
      customToast("Chat Updated Successfully");
      setChat(undefined);
    },
    onError() {
      customToastError(
        updateChatMutation.error?.message ?? "Something Went Wrong"
      );
      updateChatMutation.reset();
    },
  });
  const onSubmit: SubmitHandler<ChatFormInputs> = (data) => {
    updateChatMutation.mutate(data);
  };
  const chatsRows = data?.map((chat) => {
   

    return (
      <tr key={chat.id}>
        <td className={`px-3  text-center border `}>
          {chat.id.substring(0, 5)}
        </td>
        <td className="px-3 text-center border ">{chat.title}</td>
        <td className="px-3 text-center border ">
          {users?.find((user) => user.id === chat.adminId)?.email}
        </td>
        <td className="px-3 text-center border ">
          {chat.users?.map((u) => u.email).join(", ")}
        </td>
        <td className="px-3   text-center border ">
          {isAuthorized(["Admin"]) && (
            <>
              <Button
                onClick={() => {
                  deleteChatMutation.mutate(chat.id);
                }}
                className="bg-red-500 mr-1 px-3 hover:bg-red-400"
              >
                <Trash2 />
              </Button>
            </>
          )}
          <Button onClick={() => setChat(chat)}>
            <Edit2 />
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <div className="h-screen  ">
      <div className="container flex justify-center ">
        <h2 className="text-4xl mt-5 font-semibold px-5">Chats</h2>
      </div>
      {chat && users?.length && (
        <ChatForm
          onSubmit={onSubmit}
          setChat={setChat}
          chat={chat}
          users={users}
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
          <h1>No Chat Found</h1>
        </div>
      ) : (
        <div className="w-full bg-zinc-800  ">
          <div className="w-full p-3 flex justify-center">
            <table className="bg-zinc-800  ">
              <thead>
                <tr>
                  <th className=" bg-green-500 border-0 rounded-tl-2xl ">#</th>
                  <th className=" bg-green-500 border-0 ">title</th>
                  <th className=" bg-green-500 border-0 ">Admin User</th>
                  <th className=" bg-green-500 border-0  ">User</th>
                  <th className=" bg-green-500 border-0  rounded-tr-2xl">
                    Edit/Delete
                  </th>
                </tr>
              </thead>
              <tbody>{chatsRows}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chats;
