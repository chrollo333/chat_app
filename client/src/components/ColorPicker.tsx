import { SketchPicker } from 'react-color';
import axios from "axios";
import { useSocket } from "../context/SocketContext";
import debounce from "lodash/debounce";
import { useCallback } from "react";

interface Props {
    username: string;
    color: string;
    setColor: (color: string) => void;
}

function ColorPicker({ username, color, setColor }: Props) {
    const socket = useSocket();

    // debounced function to save color to backend, using this so each color slide doesnt send POST requests constantly for performance
    const debouncedSaveColor = useCallback(
        debounce(async (hex: string) => {
            try {
                const res = await axios.post("http://localhost:3000/api/user/color", {
                    username,
                    color: hex,
                });

                if (res.status === 200) {
                    if (socket) {
                        socket.emit("update_color", { username, color: hex });
                    }
                } else {
                    console.error("Failed to save color on backend");
                }
            } catch (err) {
                console.error("Error saving color:", err);
            }
        }, 500), //can adjust debounce delay as needed for performance, this seemed like a sweet spot for my laptop
        [username, socket]
    );

    const handleChange = (newColor: any) => {
        setColor(newColor.hex);
        debouncedSaveColor(newColor.hex);
    };

    return (
        <div className="p-4 bg-zinc-800 rounded-lg text-white w-fit">
            <p className="mb-2 text-sm">Choose your chat color:</p>
            <SketchPicker color={color} onChange={handleChange} />
        </div>
    );
}

export default ColorPicker;