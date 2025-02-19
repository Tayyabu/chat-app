import { Loader, PlusIcon, XIcon } from "lucide-react";
import SearchForm from "./SearchForm";
import Button from "./Button";

import { cn } from "../lib/utils";
import Modal from "./Modal";
import { useState, useMemo } from "react";
import { useChatGroup } from "../hooks/useChatGroup";

import { openModal } from "../state/chatModalStateStore";
import useSidebarStateStore, { closeSidebar } from "../state/sidebarStateStore";
import { GroupList } from "./GroupList.tsx";

const Sidebar = () => {
  const { isOpen } = useSidebarStateStore();
  
  const { data, isError, isLoading } = useChatGroup();
  const [searchText, setSearchText] = useState<string>("");

  const searchedResult = useMemo(
    () =>
      data?.filter(
        (chat) =>
          chat.title.toLowerCase().includes(searchText.toLowerCase()) || ""
      ),
    [data, searchText]
  );

  return (
    <div
      className={cn(
        "fixed shadow-lg dark:shadow-none lg:w-auto w-screen  h-screen duration-300 bg-white  dark:bg-zinc-900  dark:text-white top-0 min-w-fit p-3 transition-all left-0",
        !isOpen && "-translate-x-[100%] "
      )}
    >
      <div className="w-full flex py-3  justify-end">
        <button
          onClick={() => closeSidebar()}
          className="dark:hover:bg-zinc-700  hover:bg-gray-100 p-2 rounded-full"
        >
          <XIcon />
        </button>
      </div>
      <SearchForm setSearchText={setSearchText} />
      <div className="w-full overflow-y-scroll flex py-3 px-2 mt-3 gap-2 flex-col justify-center">
        {isLoading && (
          <div className="w-full flex justify-center">
            <Loader size={50} className="dark:text-zinc-600  animate-spin" />
          </div>
        )}
        {isError && <h1>Something went wrong</h1>}
        {!isError && !isLoading && Array.isArray(searchedResult) && (
          <GroupList chats={searchedResult} />
        )}
      </div>
      <Modal   />
      <Button
        onClick={() => {
          openModal();
        }}
        className="w-full flex px-2 py-3 mt-3 mr-2 justify-center "
      >
        <PlusIcon />
      </Button>
    </div>
  );
};

export default Sidebar;
