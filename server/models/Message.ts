import { Schema, model } from "mongoose";

const messageSchema = new Schema ({
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export const Message = model("Message", messageSchema);