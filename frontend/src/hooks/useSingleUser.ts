import { useQuery } from "@tanstack/react-query";

import {api} from "../api/api";
import { User } from "./useUsers";



function useSingleUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await api.get(`/api/users/${id}`);

      return response.data as User;
    },
  });
}

export default useSingleUser;
