import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";


import "react-toastify/ReactToastify.css";

const AdminLayout = () => {
  return (
    <main className="h-screen bg-zinc-800" >
    <ToastContainer />
    <h1 className="text-5xl text-center font-bold">Admin Panel</h1>
      <Outlet />

    </main>
  );
};

export default AdminLayout;