import { useEffect, useRef } from "react";
import ChatMessageForm from "../components/ChatMessageForm";
import { useSearchParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { useTyping } from "../hooks/useTyping.ts";
import { MessageList } from "../components/MessageList.tsx";
import { customToast, debounce } from "../lib/utils.ts";
import { useChatMessage } from "../hooks/useChatMessaages.ts";
import { Loading } from "../components/Loading.tsx";
import Typing from "../components/Typing.tsx";

function Home() {
  const container = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const chatId = searchParams.get("chatId");
  const client = useQueryClient();
  const [isTyping, setIsTyping] = useTyping(30000);

  const socket = useSocket();

  const { data, isLoading, isError } = useChatMessage(chatId || "");

  useEffect(() => {
    const chatId = searchParams.get("chatId");
    if (chatId && socket) {
      socket?.emit("join-chat", chatId);
    }
  }, [searchParams, socket]);

  useEffect(() => {
    const debouncedSetIsTyping = debounce(() => {
      setIsTyping(true);
    }, 300);
    if (socket) {
      socket.on("leave-chat", (email) => {
        customToast(`${email} left the chat`);
      });
      socket.on("chat-deleted", (title) => {
        client.invalidateQueries({ queryKey: ["chatGroups"] });
        customToast(`Chat with title="${title} has been deleted by admin"`);
        setSearchParams({});
      });
      socket.on("join-chat", (email) => {
        customToast(`${email} joined the chat`);
      });

      socket.on("typing", () => {
        debouncedSetIsTyping();
      });
      socket.on("message", (chatId) => {
        
        client.invalidateQueries({ queryKey: ["chatMessages", chatId] });
      });
      socket.on("delete-message", () => {
        
        client.invalidateQueries({ queryKey: ["chatMessages", chatId] });
      });
      socket.on("edit-message", () => {
        
        client.invalidateQueries({ queryKey: ["chatMessages", chatId] });
      });
      
      return () => {
        socket.off("join-chat");
        socket.off("chat-deleted");
        socket.off("message");
        socket.off("delete-message")
        socket.off("edit-message")
        socket.off("leave-chat");
        socket.off("leave-chat");
        socket?.off("typing");
      };
    }
  }, [socket, client, setIsTyping, setSearchParams, chatId]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsTyping(false);
    }, 3000);

    return () => {
      clearTimeout(timeOut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping]); //

  useEffect(() => {
    const domNode = container.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  });

  return (
    <main className="dark:bg-zinc-800">
      <div ref={container} className="rounded-lg mt-14  p-4">
        {isTyping && <Typing />}
        {chatId &&
          (!data?.length && isLoading && !isError ? (
            <div className="h-full mt-5 w-full grid place-content-center">
              <div className="text-2xl">
                <Loading />
              </div>
            </div>
          ) : (
            <MessageList messages={data} />
          ))}
      </div>

      <ChatMessageForm />
    </main>
  );
}

export default Home;
