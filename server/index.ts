import express from "express"; // to set up basic HTTP server
import http from "http"; // for creating a raw HTTP server which socket.io will hook into
import { Server } from "socket.io"; // for real-time communication between server and client
import cors from "cors"; // to allow requests from frontend (built on React)

