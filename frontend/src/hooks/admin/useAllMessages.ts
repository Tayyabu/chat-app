import { useQuery } from "@tanstack/react-query";
import api from "../../api/axiosInterceptor";
import { Message } from "../useChatMessaages";


function useAllMessages() {
    return useQuery({
        queryKey: ["chatMessages"],
        queryFn: async () => {
          try {
            const response = (await api.get(
              `/api/messages/all`
            )) ;
            return response.data as  Message[];
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error:unknown) {
            return null;
          }
        },
      });
}

export default useAllMessages
