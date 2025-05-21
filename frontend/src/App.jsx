import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useContext, useEffect } from "react";
import { UserContext } from "./context/UserContext";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import { Loader } from "lucide-react";  
import CreateGroupPage from "./pages/CreateGroupPAge";
import GroupDetails from "./pages/GroupDetails";

function App() {
    const {authUser,checkAuth, isCheckingAuth,onlineUsers}=useContext(UserContext)

  useEffect(() => {
    checkAuth();    
  }, []);


  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  return (
    <>
 <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/register"
          element={!authUser ? <RegisterPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />

        <Route path="/groups">
       < Route path="create" element={<CreateGroupPage/>}/>
       < Route path="group/:groupId" element={<GroupDetails/>}/>
        </Route>
      </Routes>
    </>
  );
}

export default App;
