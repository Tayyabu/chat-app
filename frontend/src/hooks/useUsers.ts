import api from '../api/axiosInterceptor.ts'
import {useQuery} from "@tanstack/react-query";
export type User = {
    id: string;
    email: string;
    profilePic:string
};
export function useUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await api.get("/api/users");

            return response.data as User[];
        },
    });
}
