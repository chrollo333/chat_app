import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import ColorPicker from "../components/ColorPicker";
import Modal from "../components/ColorModal";
interface Props {
    username: string;
}

interface ChatMessage {
    sender: string;
    content: string;
    color: string;
}

function ChatApp({ username }: Props) {
    const socket = useSocket();

    const [message, setMessage] = useState(""); // current typed message
    const [chat, setChat] = useState<ChatMessage[]>([]); // chat history
    const [userColors, setUserColors] = useState<{ [username: string]: string }>({}); // map username -> color
    const [myColor, setMyColor] = useState("#ffffff"); // your own color
    const [modalOpen, setModalOpen] = useState(false); //used for color modal


    useEffect(() => {
        if (!socket) return;

        // join room / announce username
        socket.emit("join", username);

        //handlers for receiveing messages and updating colors
        const handleReceiveMessage = (data: ChatMessage) => {
            setChat((prev) => [...prev, data]);
            setUserColors((prev) => ({ ...prev, [data.sender]: data.color }));
        };

        const handleColorUpdated = (data: { username: string; color: string }) => {
            setUserColors((prev) => ({ ...prev, [data.username]: data.color }));

            if (data.username === username) {
                setMyColor(data.color);
            }

            setChat((prevChat) =>
                prevChat.map((msg) =>
                    msg.sender === data.username ? { ...msg, color: data.color } : msg
                )
            );
        };

        socket.on("receive_message", handleReceiveMessage);
        socket.on("color_updated", handleColorUpdated);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("color_updated", handleColorUpdated);
        };
    }, [socket, username]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && socket) {
            socket.emit("send_message", {
                content: message,
                sender: username,
                color: myColor,
            });
            setMessage("");
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 flex flex-col items-center px-4 py-6">
            <div className="p-8 font-cobane text-white w-[30%]">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        💬 Lounge Chat
                    </h1>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-emerald-700 hover:bg-emerald-500 text-white rounded px-3 py-1 hover:scale-120 duration-500"
                        aria-label="Open color picker"
                    >
                        🎨
                    </button>
                </div>

                <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                    <ColorPicker username={username} color={myColor} setColor={setMyColor} />
                </Modal>

                <form onSubmit={sendMessage} className="flex mt-4 gap-4">
                    <input
                        type="text"
                        value={message}
                        placeholder="Type a message..."
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-grow bg-zinc-800 text-white placeholder-zinc-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                        type="submit"
                        className="text-white rounded px-4 py-2 duration-500 bg-emerald-700 hover:bg-emerald-500 hover:scale-120"
                    >
                        Send
                    </button>
                </form>

                <ul className="mt-8 space-y-2">
                    {chat.map((msg, index) => (
                        <li
                            key={index}
                            className="max-w-md bg-zinc-700 rounded-xl px-4 py-2 shadow-sm break-words hover:bg-zinc-700/70 transition-colors"
                        >
                            <span
                                style={{ color: userColors[msg.sender] || msg.color, fontWeight: "bold" }}
                            >
                                {msg.sender}:
                            </span>{" "}
                            <span className="text-white">{msg.content}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ChatApp;