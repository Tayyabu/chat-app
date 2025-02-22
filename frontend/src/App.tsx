import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PublicLayout from "./layouts/PublicLayout";
import AuthRequired from "./components/AuthRequired";
import PersistLogin from "./components/PersistLogin";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Unauthorized from "./components/Unauthorized";
import AdminLayout from "./layouts/AdminLayout";
import Users from "./pages/admin/Users";
import Dashboard from "./pages/admin/Dashboard";
import Messages from "./pages/admin/Messages";
import Chats from "./pages/admin/Chats";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route element={<PersistLogin />}>
          <Route element={<AuthRequired roles={["User"]}/>}>
            <Route element={<Home />} index />
            <Route element={<Profile />} path="/profile" />
          </Route>
        </Route>
      </Route>
      <Route element={<Unauthorized />} path="/unauthorized" />
      <Route path="/admin" element={<AdminLayout />}>
        <Route element={<PersistLogin />}>
          <Route element={<AuthRequired roles={["Staff"]}/>}>
            <Route element={<Dashboard />} index />
            <Route element={<Users />} path="users" />
            <Route element={<Messages />} path="messages" />
            <Route element={<Chats />} path="chats" />
          </Route>
        </Route>
      </Route>
     
      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />
    </Routes>
  );
}

export default App;
