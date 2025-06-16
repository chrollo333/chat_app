import express from "express"; // to set up basic HTTP server
import http from "http"; // for creating a raw HTTP server which socket.io will hook into
import { Server } from "socket.io"; // for real-time communication between server and client
import cors from "cors"; // to allow requests from frontend (built on React)

const app = express(); //creates an express application
const server = http.createServer(app); //sets up an HTTP server afterwards

app.use(cors()); //this allows cross-origin requests for frontend

const io = new Server(server, {   //socket.io initialization, attaching it to server
    cors: {
        origin: "http://localhost:5173", //frontend server port
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {  //listens for new connections and logs it
    console.log(`New client connected:  ${socket.id}`);

    socket.on("send_message",(data) => {    //listens for new messages, broadcasts it to all other clients
        console.log("Message received from client:", data);
        
        socket.broadcast.emit("receive_message", data);
    });

    socket.on("disconnect", () => {  //listens for client disconnects then logs it it
        console.log(`Client disconnected: ${socket.id}`);
    });
});

//here we start the server
const PORT = 3000; //port we default to
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});