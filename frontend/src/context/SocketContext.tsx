import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { io, Socket } from "socket.io-client";

import useAuthStore from "../state/authStore.ts";
import { refresh } from "../lib/utils.ts";

type ContextType = {
  socket: Socket | undefined;
};
const SocketContext = createContext<ContextType>(null!);

export const useSocket = () => {
  const state = useContext(SocketContext);

  return state.socket;
};

function SocketContextProvider({ children }: PropsWithChildren) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [socket, setSocket] = useState<Socket>();
  useEffect(() => {
    if (!socket?.connected) {
      let _socket: Socket | null = null;

      async function connectWithToken() {
        try {
          const newToken = await refresh();

          _socket = io("http://localhost:3000", {
            extraHeaders: {
              authorization: `Bearer ${newToken}`,
            },
          });

          setSocket(_socket);
        } catch (err) {
          console.log(err);
        }
      }

      if (!accessToken) {
        connectWithToken();
      } else {
        _socket = io("http://localhost:3000", {
          extraHeaders: {
            authorization: `Bearer ${accessToken}`,
          },
        });

        setSocket(_socket);
      }

      return () => {
        socket?.disconnect();

        setSocket(undefined);
      };
    }
  }, []);
  useEffect(() => {
    if (socket) {
      socket.on("message", onMessage);
      console.log("runned");

      function onConnect() {
        console.log("connected ll");
      }
      function onMessage(m: any) {
        console.log(m);
      }
      function onDisconnect() {
        console.log("disconnected");
      }
      socket?.on("connect", onConnect);
      socket?.on("disconnect", onDisconnect);

      return () => {
        socket.off("disconnect", onDisconnect);
        socket.off("message", onMessage);
        socket.off("connect", onConnect);
      };
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketContextProvider;
