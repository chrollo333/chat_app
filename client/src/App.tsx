import { useState, useEffect } from "react";
import ChatApp from "./pages/ChatApp";
import LandingPage from "./pages/LandingPage";

function App() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);
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