import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";


interface Props {
    username: string;
}


function ChatApp({ username }: Props) {
    const [message, setMessage] = useState(""); //message is empty on mount
    const [chat, setChat] = useState<string[]>([]); //chat is empty on mount
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io("http://localhost:3000"); //connection to socket is in useeffect to prevent double render due to react strictmode

        socketRef.current.on("connect", () => { //wait until socket is connected before sending username
            socketRef.current?.emit("join", username);
        });


        socketRef.current.on("receive_message", (data: { content: string, sender: string }) => { //this handles incoming messages
            setChat((prev) => [...prev, `${data.sender}: ${data.content}`]); //adds received message to the chat array, making sure to preserve previous messages
        });

        return () => { //cleanup on component unmount
            socketRef.current?.disconnect();
        };
    }, [username]);


    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && socketRef.current) {
            socketRef.current.emit("send_message", {
                content: message,
                sender: username,
            });
            setMessage("");
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center px-4 py-6">
            <div className="p-8 font-cobane text-white w-[30%] ">
                <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">💬 Lounge Chat</h1>
                <form onSubmit={sendMessage} className="flex mt-4 gap-2">
                    <input
                        type="text"
                        value={message}
                        placeholder="Type a message..."
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-grow bg-zinc-800 text-white placeholder-zinc-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                        type="submit"
                        className=" text-white rounded px-4 py-2 duration-300 bg-emerald-700 hover:bg-emerald-500"
                    >
                        Send
                    </button>
                </form>

                <ul className="mt-8 space-y-2">
                    {chat.map((msg, index) => (
                        <li key={index} className="max-w-md bg-zinc-700 rounded-xl px-4 py-2 text-white shadow-sm break-words hover:bg-zinc-700/70 transition-colors">
                            {msg}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
export default ChatApp;