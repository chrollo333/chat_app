import { SketchPicker } from 'react-color';
import { useState } from 'react';
import axios from "axios";

interface Props {
    username: string;
}

function ColorPicker ({ username }: Props) {
    const [color, setColor] = useState("#ffffff"); //defaults to white
    const [status, setStatus] = useState("");

    const handleChangeComplete = async (newColor: any) => {
        setColor(newColor.hex);


        try {
            const res = await axios.post("http://localhost:3000/api/user/color", {
                username,
                color: newColor.hex,
            });

            if (res.status === 200) {
                setStatus("✅ Color saved!");
            } else {
                setStatus("❌ Failed to save.");
            }
        } catch (err) {
            console.error(err);
            setStatus("❌ Error saving color.");
        }
    }

    return (
        <div className="p-4 bg-zinc-800 rounded-lg text-white w-fit">
            <p className="mb-2 text-sm">Choose your chat color:</p>
            <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
            <p className="mt-2 text-sm">{status}</p>
        </div>
    );
};

export default ColorPicker;