import { data } from "@/data";
import { io } from "socket.io-client";

const socket = io(data.apiUrl);

export default socket;
