import {useQuery} from "@tanstack/react-query";
import api from "../api/axiosInterceptor.ts"
import { User } from "./useUsers.ts";
export type ChatGroup = {
    id: string;
    title: string;
    adminId?:string;
    users:User[]
};
export function useChatGroup() {
    return useQuery({
        queryKey: ["chatGroups"],
        refetchInterval:3000,
        queryFn: async () => {
            const response = await api.get("/api/chats");
            return response.data as ChatGroup[];
        },
    });
}