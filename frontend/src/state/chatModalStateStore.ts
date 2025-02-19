import { create } from "zustand";
export type Store = {
  isOpen: boolean;

  id: string | null;
  title: string | null;

  users: { id: string; email: string }[] | null;
};

const useModalStateStore = create<Store>(() => ({
  isOpen: false,
  id: null,
  title: null,
  users: null,
}));

export const openModal = (
  id: string | null = null,
  title: string | null = null,
  users: { id: string; email: string }[] | null = null
) => {
  useModalStateStore.setState({ isOpen: true, id, title, users });

  
  
};
export const closeModal = () => {
  useModalStateStore.setState({ isOpen: false,id:null, title:null, users:null  });
};
export default useModalStateStore;
