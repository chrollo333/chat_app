import { SketchPicker } from 'react-color';
import axios from "axios";
import { useSocket } from "../context/SocketContext";

interface Props {
    username: string;
    color: string;
    setColor: (color: string) => void;
}


function ColorPicker({ username, color, setColor }: Props) {
    const socket = useSocket();

    const handleChangeComplete = async (newColor: any) => {
        setColor(newColor.hex); 

        try {
            const res = await axios.post("http://localhost:3000/api/user/color", {
                username,
                color: newColor.hex,
            });

            if (res.status === 200) {
                if (socket) {
                    socket.emit("update_color", { username, color: newColor.hex });
                }
            } else {
                console.error("Failed to save color on backend");
            }
        } catch (err) {
            console.error("Error saving color:", err);
        }
    };

    return (
        <div className="p-4 bg-zinc-800 rounded-lg text-white w-fit">
            <p className="mb-2 text-sm">Choose your chat color:</p>
            <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
        </div>
    );
}

export default ColorPicker;