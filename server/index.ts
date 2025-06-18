import express from "express"; // to set up basic HTTP server
import http from "http"; // for creating a raw HTTP server which socket.io will hook into
import { Server } from "socket.io"; // for real-time communication between server and client
import cors from "cors"; // to allow requests from frontend (built on React)
import { Message } from "./models/Message";
import { connectDB } from "./config/db";
import userRoutes from "./routes/users";
import { User } from "./models/User";

const app = express(); //creates an express application
const server = http.createServer(app); //sets up an HTTP server afterwards

app.use(express.json());
app.use(cors()); //this allows cross-origin requests for frontend
app.use("/api/user", userRoutes); //used for user routing - currently /color/

connectDB().then(() => {
    // only starts the server on successful 
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
            color: socket.data.color || "#ffffff",
        });
        io.emit("receive_message", {
            content: saved.content,
            sender: saved.sender,
            color: saved.color,
        });
    });

    socket.on("join", async (username: string) => { //on connecting to server, sends chat history (50 messages)
        socket.data.username = username;

        console.log(`Socket ${socket.id} joined the chat as ${username}`); //console broadcast for test purposes/Socket ID

        const user = await User.findOne({ username }); // get user
        if (user) {
            socket.data.color = user.color; // set the color on the socket
            socket.emit("color_updated", { username, color: user.color });
            console.log(`Set color for ${username}: ${user.color}`);
        } else {
            socket.data.color = "#ffffff"; // fallback
        }

        // listen for color updates from this socket only
        socket.on("update_color", async ({ username, color }) => {
            try {
                await User.updateOne({ username }, { color });
                socket.data.color = color;  // update color on this socket immediately

                // Broadcast color update to all other clients so they update usernames in real-time
                io.emit("color_updated", { username, color });

                console.log(`🔄 Updated ${username}'s color to ${color}`);
            } catch (err) {
                console.error("Error updating color:", err);
            }
        });

        socket.broadcast.emit("receive_message", { //notifies when somebody joins
            content: `${username} joined the chat.`,
            sender: "System",
            color: "#888888", // system messages  have a gray color
        });

        const messages = await Message.find().sort({ timestamp: 1 }).limit(50); //limited to 50 messages
        messages.forEach((m) => {
            socket.emit("receive_message", {
                content: m.content,
                sender: m.sender,
                color: m.color || "#ffffff"
            });  //this maps out received messages
        });
    });

    socket.on("disconnect", () => {  //listens for client disconnects then logs it it
        const username = socket.data.username || "Unknown";
        socket.broadcast.emit("receive_message", {
            content: `${username} left the chat.`,
            sender: "System",
            color: "#888888",
        });

        console.log(`Client disconnected: ${socket.id} / ${username}`);
    });
});