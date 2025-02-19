import { useEffect, useState } from "react";
import { User } from "./useUsers";
import useAuthStore from "../state/authStore";
import useSingleUser from "./useSingleUser";

export function useCurrentUser() {
  const userId = useAuthStore((state) => state.id);
  const { data, isLoading, isError } = useSingleUser(userId as string);
  const [currentUser, setCurrentUser] = useState<User>(
   
  );

  useEffect(()=>{
    setCurrentUser(data)
  },[data,userId])
  return { currentUser, setCurrentUser, isError, isLoading } as {
    currentUser: typeof currentUser;
    setCurrentUser: typeof setCurrentUser;
    isLoading: boolean;
    isError: boolean;
  };
}
