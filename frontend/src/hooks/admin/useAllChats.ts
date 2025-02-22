import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/api';
import { ChatGroup } from '../useChatGroup';

export default function useAllChats() {
  return  useQuery({
    queryKey: ["chatGroups"],
    refetchInterval:3000,
    queryFn: async () => {
        const response = await api.get("/api/chats/all");
        return response.data as ChatGroup[];
    },
});
}
