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
            onJoin(trimmed);
        }
    };


    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-cobane">
            <h1 className="text-4xl font-bold mb-6">💬 Welcome to Lounge Chat</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Enter your username"
                    className="p-3 rounded text-black w-72"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-white text-purple-700 font-semibold px-6 py-2 rounded hover:bg-purple-200"
                >
                    Join Chat
                </button>
            </form>

        </div>
    );
}