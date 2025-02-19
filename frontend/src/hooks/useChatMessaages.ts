import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosInterceptor";

export type Message = {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  createdAt:string
  updatedAt:string
};

export function useChatMessage(chatId: string) {
  return useQuery({
    queryKey: ["chatMessages", chatId],
    queryFn: async () => {
      try {
        const response = (await api.get(
          `/api/messages/?chatId=${chatId}`
        )) ;
        return response.data as  Message[];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error:unknown) {
        return null;
      }
    },
  });
}
