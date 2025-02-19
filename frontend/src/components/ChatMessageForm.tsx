import { Send } from "lucide-react";
import Button from "./Button";
import { useSocket } from "../context/SocketContext";
import {  FormEvent, useState } from "react";


import { useSearchParams } from "react-router-dom";

function ChatMessageForm() {
  const socket = useSocket();

 const [content,setContent]=useState("")
 const [searchParams] = useSearchParams();


const handleSubmit = (e:FormEvent)=>{
e.preventDefault()
socket?.emit("message",searchParams.get("chatId"),content)

setContent("")

}

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-slate-50 shadow-lg dark:bg-zinc-900 fixed p-3 gap-2 bottom-0  flex"
    >
      <input
        type="text"
        onChange={(e)=>{
         
           
            socket?.emit("typing",searchParams.get("chatId"))    
            
          
          setContent(e.target.value)
        }}
        value={content}
        className=" p-3 dark:bg-zinc-800  grow rounded-md dark:outline-zinc-500  "
      />
      <Button
        disabled={content===""}
      >
        <Send />
      </Button>
    </form>
  );
}

export default ChatMessageForm;
