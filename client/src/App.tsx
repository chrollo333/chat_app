import { useState } from "react";
import ChatApp from "./pages/ChatApp";
import LandingPage from "./pages/LandingPage";

function App() {
const [username, setUsername] = useState(() => localStorage.getItem("username") || "");

  return (
    <>
    {!username ? (
      <LandingPage onJoin={ setUsername } />
    ) : (
      <ChatApp username={username} />
    )}
    </>
  );
}

export default App;