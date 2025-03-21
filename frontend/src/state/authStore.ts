import { create } from "zustand";
import { api } from "../api/api.ts";
import { RegisterFormInputs } from "../pages/Register.tsx";
export type Auth = {
  accessToken: string | null;
  id: string | null;
  roles: ("Admin" | "Staff" | "User")[];
};

const useAuthStore = create<Auth>(() => ({
  accessToken: null,
  id: null,
  roles: [],
}));

export async function login(data: {
  email: string | null;
  password: string | null;
}) {
  try {
    const response = await api.post("/api/auth", data);

    useAuthStore.setState((pre) => {
      return {
        ...pre,
        accessToken: response.data.accessToken,
        id: response.data.id,
        roles: response.data.roles,
      };
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}
export async function register(data: RegisterFormInputs) {
  await api.post("/api/register", data);
  return await login(data);
}

export async function logOut() {
  await api.get("/api/auth", { withCredentials: true });

  useAuthStore.setState((pre) => ({
    ...pre,
    accessToken: null,
    id: null,
    roles: [],
  }));
}

export default useAuthStore;
