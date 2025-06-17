import { Schema, model } from "mongoose";

const messageSchema = new Schema ({
    content: { type: String, required: true },
    sender: { type: String, required: true},
    color: { type: String, default: "#ffffff" },
    timestamp: { type: Date, default: Date.now },
});

export const Message = model("Message", messageSchema);