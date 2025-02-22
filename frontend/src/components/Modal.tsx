import { ComponentProps, FormEvent, useEffect, useRef, useState } from "react";
import { cn, customToast } from "../lib/utils";
import Button from "./Button";
import {  useUsers } from "../hooks/useUsers.ts";
import { XIcon } from "lucide-react";
import ReactSelect from "react-select";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../state/authStore.ts";
import { useSocket } from "../context/SocketContext.tsx";
import useModalStateStore, {
  closeModal,
} from "../state/chatModalStateStore.ts";

type ModalProps = ComponentProps<"dialog"> 
const Modal = (props: ModalProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams();
  const { data } = useUsers();
  const socket = useSocket();
  const modalProps = useModalStateStore()
  const [title, setTitle] = useState<string | null>('');
  const [users, setUsers] = useState<{ id: string; email: string }[]>( []);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [errors, setErrors] = useState<
    { message: string; field: string }[] | null
  >(null);
  const client = useQueryClient();
  const { isOpen } = useModalStateStore();
  const id = useAuthStore((state) => state.id);
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    socket?.emit(`chat-${modalProps.title && modalProps.users?.length ? "updated":"created"}`, { title, users,id:modalProps.id });
    setUsers([]);
    setTitle("");
  }
useEffect(()=>{
if(modalProps.title && modalProps.users){
 setTitle(modalProps.title)
 setUsers(modalProps.users)

}else{
  setTitle("")
 setUsers([])
}

},[modalProps.title,modalProps.users])
  useEffect(() => {
    if (!isOpen) {
      dialogRef.current?.close();
    } else {
      dialogRef.current?.showModal();
    }
  }, [isOpen]);

  useEffect(() => {
    if (socket) {
      socket.on(`chat-${modalProps.title && modalProps.users?.length ? "updated":"created"}`, async (data) => {
        if (data.errors) {
          return setErrors(data.errors);
        }

        customToast(`Chat with title = "${data.chat.title}" is ${modalProps.title && modalProps.users?.length ? "updated":"created"}`);

        setSearchParams({ chatId: data.chat.id });

        closeModal();

        client.invalidateQueries({ queryKey: ["chatGroups"] });
      });
      return () => {
        socket.off(`chat-${modalProps.title && modalProps.users?.length ? "updated":"created"}`);
      };
    }
  }, [client, errors, id, modalProps.title, modalProps.users?.length, setSearchParams, socket, users]);

  return (
    <dialog
      {...props}
      ref={dialogRef}
      className={cn(
        "w-fit h-fit dark:bg-zinc-900 dark:text-white",
        props.className
      )}
    >
      <div className="w-full flex py-3  justify-end">
        <button
          onClick={() => closeModal()}
          className="dark:hover:bg-zinc-700  hover:bg-gray-100 p-2 rounded-full"
        >
          <XIcon />
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-3 dark:text-white flex flex-col justify-center items-center gap-3 dark:bg-zinc-900"
      >
        <div className="w-full flex gap-4">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="w-full dark:bg-zinc-800 px-2  py-3"
            id="title"
            value={title as string}
           
            onChange={(e) => {
              setErrors([]);
              setTitle(e.target.value);
            }}
          />
        </div>
        {errors?.map((err, index) =>
          err.field === "title" ? (
            <p key={index} className="text-red-500">
              {err.message}
            </p>
          ) : null
        )}
        <div className="w-full flex gap-4">
          <label htmlFor="users">Friends</label>
          <ReactSelect
            value={users.map((user) => ({
              value: user.id,
              label: user.email,
            }))}
         
            isMulti
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "#27272a",
              }),

              menuList: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "#27272a",
              }),
              valueContainer: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "#27272a",
              }),
            }}
            onChange={(t) => {
              setUsers(t.map((tag) => ({ id: tag.value, email: tag.label })));
            }}
            placeholder="Search Tags"
            className="dark:bg-zinc-800 "
            id="users"
            options={data
              ?.filter((user) => user.id !== id)
              .map((user) => {
                return { label: user.email, value: user.id };
              })}
          />
        </div>
        {errors?.map((err, index) =>
          err.field === "users" ? (
            <p key={index} className="text-red-500">
              {err.message}
            </p>
          ) : null
        )}
        <div className="flex w-full justify-end">
          <Button>{modalProps.title && modalProps.users?.length ? "Update":"Create"}</Button>
        </div>
      </form>
    </dialog>
  );
};
export default Modal;
