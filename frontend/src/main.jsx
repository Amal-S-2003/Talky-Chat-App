import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./context/UserContext.jsx";
import { ChatContextProvider } from "./context/ChatContext.jsx";
import { GroupContextProvider } from "./context/GroupContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserContextProvider>
      <ChatContextProvider>
        <GroupContextProvider>
          <App />
        </GroupContextProvider>
      </ChatContextProvider>
    </UserContextProvider>
  </BrowserRouter>
);
