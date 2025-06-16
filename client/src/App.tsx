import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
    const[message, setMessage] = useState(""); //message is empty on mount
    const[chat, setChat] = useState<string[]>([]); //chat is empty on mount

    useEffect(() => {
      const socket = io("http://localhost:3000"); //in useeffect to prevent double render due to react strictmode
        socket.emit("join");

        socket.on("receive_message", (data: string) => { //event listener for messages from server
            setChat((prev) => [...prev, data]); //adds received message to the chat array, making sure to preserve previous messages
        });

        return () => {
            socket.off("receive_message"); //cleanup
        };
    }, []); 
    

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            socket.emit("send_message", message);
            setChat((prev) => [...prev, message]);
            setMessage("");
        }
    };

    return(
    <div className="p-8 font-cobane">
      <h1 className="text-2xl font-bold mb-4">💬 Lounge Chat</h1>
      <form onSubmit={sendMessage} className="flex gap-4">
        <input
          type="text"
          value={message}
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 w-80 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
        >
          Send
        </button>
      </form>

      <ul className="mt-8 space-y-2">
        {chat.map((msg, index) => (
          <li key={index} className="bg-gray-100 p-2 rounded">
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;