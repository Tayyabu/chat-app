import { create } from "zustand";

export type Store = {
  isOpen: boolean;
};

const useSidebarStateStore = create<Store>(() => ({
  isOpen: false,
}));

export const openSidebar = () => {
  useSidebarStateStore.setState({ isOpen: true });
};
export const closeSidebar = () => {
  useSidebarStateStore.setState({ isOpen: false });
};
export default useSidebarStateStore;
