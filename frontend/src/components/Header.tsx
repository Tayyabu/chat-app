import { MenuIcon } from "lucide-react";
import Button from "./Button";
import DarkModeButton from "./DarkModeButton";
import Sidebar from "./Sidebar";
import { ToastContainer } from "react-toastify";
import useAuthStore, { logOut } from "../state/authStore.ts";
import useSidebarStateStore, {
  closeSidebar,
} from "../state/sidebarStateStore.ts";

import { useQueryClient } from "@tanstack/react-query";
import { customToast, isAuthorized } from "../lib/utils.ts";

import ProfileImage from "./ProfileImage.tsx";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser.ts";

function Header() {
  const { accessToken} = useAuthStore();
  const {currentUser} =useCurrentUser()
  const client = useQueryClient();
  return (
    <header className=" w-full dark:bg-zinc-900 bg-white dark:text-white dark:shadow-zinc-700 z-40  flex p-4 items-center  shadow-md top-0 ">
      {accessToken && (
        <Button
          onClick={() =>
            useSidebarStateStore.setState((state) => ({
              ...state,
              isOpen: !state.isOpen,
            }))
          }
        >
          <MenuIcon />
        </Button>
      )}
      <h1 className="grow text-center font-bold text-2xl">Chat App</h1>
      {isAuthorized(["Staff"]) && <Link to={"/admin"}>Admin</Link>}
      {accessToken && (
        <Button
          className="m-2"
          onClick={async () => {
            await logOut();
            customToast(`You are logged out`);
            closeSidebar();
            client.invalidateQueries({ queryKey: ["chatGroups", "users"] });
          }}
        >
          Sign Out
        </Button>
      )}
      <Link to={`/profile`}>
        {" "}
     {currentUser?.profilePic &&   <ProfileImage
          src={currentUser.profilePic}
          size={50}
        />}
      </Link>{" "}
      <DarkModeButton />
      <Sidebar />
      <ToastContainer />
    </header>
  );
}

export default Header;
