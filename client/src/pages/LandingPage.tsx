import { useState } from "react";

interface Props {
    onJoin: (username: string) => void;
}


export default function LandingPage({ onJoin }: Props) {
    const [username, setUsername] = useState("");

    const handleSubmit = (e: React.FormEvent) => { //presents trimmed username on handling submit form
        e.preventDefault();
        const trimmed = username.trim(); //removes whitespace characters
        if (trimmed) {
            localStorage.setItem("username", trimmed);
            onJoin(trimmed);
        }
    };


    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-cobane">
            <h1 className="text-4xl font-bold mb-6">💬 Welcome to Lounge Chat</h1>
            <form onSubmit={handleSubmit} className="space-y-4 ">
                <input
                    type="text"
                    value={username}
                    placeholder="Enter your username"
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-3 text-white w-72 focus:outline-none focus:ring-2 focus:ring-white rounded" 
                />
                <button
                    type="submit"
                    className="bg-white text-emerald-600 font-semibold px-6 py-2 rounded hover:bg-emerald-100 hover:text-emerald-700 ml-5 hover:scale-120 duration-500"
                >
                    Join Chat
                </button>
            </form>

        </div>
    );
}