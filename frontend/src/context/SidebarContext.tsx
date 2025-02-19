import {
  createContext,
  Dispatch,

  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

const SidebarContext = createContext<{
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}>(null!);

// eslint-disable-next-line react-refresh/only-export-components
export function useSidebar() {
  return useContext(SidebarContext);
}

function SidebarContextProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export default SidebarContextProvider;
