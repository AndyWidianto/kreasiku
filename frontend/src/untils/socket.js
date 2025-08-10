import { io } from "socket.io-client";

const token = localStorage.getItem("kreasiku");
export const socket = io("http://localhost:3000", {
  auth: {
    token: token
  }
});