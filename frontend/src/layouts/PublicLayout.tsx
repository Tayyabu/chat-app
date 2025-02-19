import { Outlet } from "react-router-dom";
import Header from "../components/Header";

import "react-toastify/ReactToastify.css";

const PublicLayout = () => {
  return (
    <>
      <Header />

      <Outlet />
    </>
  );
};

export default PublicLayout;
