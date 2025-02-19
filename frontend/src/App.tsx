import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PublicLayout from "./layouts/PublicLayout";
import LoginRequired from "./components/LoginRequired";
import PersistLogin from "./components/PersistLogin";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {


  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route element={<PersistLogin/>}>
          <Route element={<LoginRequired />}>
            <Route element={<Home />} path="/" />
            <Route element={<Profile />} path="/profile" />
            </Route>
         
          </Route>
          <Route element={<Login />} path="/login" />
          <Route element={<Register />} path="/register" />
      </Route>
      
    </Routes>
  );
}

export default App;
