import { useState } from "react";
import ChatApp from "./pages/ChatApp";
import LandingPage from "./pages/LandingPage";

function App() {
  const [username, setUsername] = useState<string | null>(null);

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