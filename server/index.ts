import express from "express"; // to set up basic HTTP server
import http from "http"; // for creating a raw HTTP server which socket.io will hook into
import { Server } from "socket.io"; // for real-time communication between server and client
import cors from "cors"; // to allow requests from frontend (built on React)
import { Message } from "./models/Message";
import { connectDB } from "./config/db";


const app = express(); //creates an express application
const server = http.createServer(app); //sets up an HTTP server afterwards

app.use(cors()); //this allows cross-origin requests for frontend


connectDB().then(() => {
    // only starts the server on succesful 
    server.listen(3000, () => {
        console.log("🚀 Server running on http://localhost:3000");
    });
});

const io = new Server(server, {   //socket.io initialization, attaching it to server
    cors: {
        origin: "http://localhost:5173", //frontend server port
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {  //listens for new connections and logs it
    console.log(`New client connected:  ${socket.id}`);

    socket.on("send_message", async (data: { content: string, sender: string }) => {    //listens for new messages, broadcasts it to all other clients
        const saved = await Message.create({
            content: data.content,
            sender: data.sender,
        });
        io.emit("receive_message", saved);
    });

    socket.on("join", async (username: string) => { //on connecting to server, sends chat history (50 messages)
        console.log(`Socket ${socket.id} joined the chat as ${username}`); //console broadcast for test purposes/Socket ID
        socket.broadcast.emit("receive_message", { //system broadcasts username joining the chat
            content: `${username} joined the chat.`,
            sender: "System"
        });
        const messages = await Message.find().sort({ timestamp: 1 }).limit(50); //limited to 50 messages
        messages.forEach((m) => {
            socket.emit("receive_message", { content: m.content, sender: m.sender });  //this maps out received messages
        });
    });


    socket.on("disconnect", () => {  //listens for client disconnects then logs it it
        console.log(`Client disconnected: ${socket.id}`);
    });
});

