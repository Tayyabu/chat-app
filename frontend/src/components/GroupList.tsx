import { User } from "../hooks/useUsers.ts";
import ChatGroup from "./ChatGroup.tsx";

type GroupListProps = {
  chats: {
    id: string;
    title: string;
    adminId?: string;
    users: User[];
  }[];
};

export function GroupList({ chats }: GroupListProps) {
  if (!chats.length) return "No chats found.";
  return chats?.map((chat) => {
    return <ChatGroup key={chat.id} chat={chat} />;
  });
}
