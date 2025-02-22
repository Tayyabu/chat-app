import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import useAuthStore from "../state/authStore";
import { api } from "../api/api";
import { AxiosError } from "axios";
import { Bounce, toast } from "react-toastify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeToInt(time: string) {
  return parseFloat(time.replace(":", "."));
}
export const classNames = (...className: string[]) => {
  // Filter out any empty class names and join them with a space
  return className.filter(Boolean).join(" ");
};

export const debounce = (func: (...args: unknown[]) => void, delay: number) => {
  let timeoutId: number;
  return (...args: unknown[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const refresh = async () => {
  try {
    const response = await api.get("/api/auth/refresh", {
      withCredentials: true,
    });

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

export function customToast(text: string) {
  return toast(text, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: isDarkMode() ? "dark" : "light",
    transition: Bounce,
  });
}
export function customToastError(text: string) {
  return toast.error(text, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: isDarkMode() ? "dark" : "light",
    transition: Bounce,
  });
}
export function isDarkMode() {
  return localStorage.getItem("dark-mode") === "true";
}
export function isAuthorized(roles: ("Admin" | "User" | "Staff")[]) {
  const auth = useAuthStore.getState();
 
  
  return auth.roles.length && auth.roles.some((role) => roles.includes(role));
}
export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
