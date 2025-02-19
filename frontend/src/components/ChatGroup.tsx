import { Edit2, Trash2 } from "lucide-react";
import { ChatGroup as ChatGroupProps } from "../hooks/useChatGroup.ts";
import Button from "./Button";
import { cn } from "../lib/utils";
import useAuthStore from "../state/authStore.ts";
import { Link, useSearchParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext.tsx";
import { closeSidebar } from "../state/sidebarStateStore.ts";
import { openModal } from "../state/chatModalStateStore.ts";
function ChatGroup({ chat }: { chat: ChatGroupProps }) {
  const [searchParams] = useSearchParams();
   
   
  const socket = useSocket();
  const currentUserId = useAuthStore((state) => state.id);

  function handleClick() {
    
    socket?.emit("join-chat", chat.id);
    closeSidebar();
  }

  return (
    <Link to={`/?chatId=${chat.id}`}>
      <div
        onClick={handleClick}
        key={chat.id}
        role="button"
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            handleClick();
          }
        }}
        tabIndex={0}
        className={cn(
          "flex cursor-pointer  items-center w-full p-3 dark:hover:bg-zinc-700  hover:bg-gray-100 dark:focus:bg-zinc-700   focus:bg-gray-100  dark:active:bg-zinc-700  active:bg-gray-100 rounded-lg justify-self-center ",
          searchParams.get("chatId") === chat.id && "bg-zinc-700"
        )}
      >
        <p className="grow">{chat.title}</p>
        {currentUserId === chat.adminId && (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                socket?.emit("delete-chat", {
                  adminId: chat.adminId,
                  id: chat.id,
                });
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 color="white" />
            </Button>
             <Button
             onClick={() => {
            
               openModal(chat.id,chat.title,chat.users)
             }}
             className="bg-green-500 hover:bg-green-600"
                     >
             <Edit2 color="white" />
                     </Button>
          </div>
        )}
      </div>
    </Link>
  );
}

export default ChatGroup;
