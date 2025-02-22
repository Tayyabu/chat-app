import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import useAuthStore from "../state/authStore.ts";
import { AxiosError } from "axios";
import {api} from "../api/api.ts";
import { Loading } from "./Loading.tsx";

function PersistLogin() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [loading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true);
    async function verifyRefresh() {
      const refresh = async () => {
        try {
          const response = await api.get("/api/auth/refresh", {
            withCredentials: true,
          });
      if(!response.data.accessToken) return navigate("/")
      
          useAuthStore.setState((pre) => ({
            ...pre,
            accessToken: response.data.accessToken,
            id: response.data.id,
            roles:response.data.roles
          }));
      
          return response.data.accessToken;
        } catch (err) {
          return (err as AxiosError).status;
        }
      };

      try {
         await refresh();
        
        
      } catch (error) {
        navigate("/login");

        console.log(error, "trr");
      } finally {
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !accessToken ? verifyRefresh() : setIsLoading(false);
  }, [accessToken, navigate]);

  if (loading) return <div className="h-full mt-5 w-full grid place-content-center">
                <div className="text-2xl">
                  <Loading />
                </div>
              </div>;

  return <Outlet />;
}

export default PersistLogin;
