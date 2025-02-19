import useAuthStore from "../state/authStore";
import { ChatMessage } from "./ChatMessage";

import type { Message } from "../hooks/useChatMessaages";
type MessageListProps = {
  messages: Message[] | null | undefined;
};

export function MessageList({ messages }: MessageListProps) {
  if (!messages?.length)
    return <h1 className="text-2xl font-bold text-center">No Message Found</h1>;
  return (
    <div className=" mx-2 mb-14 ">
      {messages?.map((message) => (
        <ChatMessage
          key={message.id}
          {...message}
          isSender={message.senderId === useAuthStore.getState().id}
        />
      ))}
    </div>
  );
}
