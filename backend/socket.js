import jwt from "jsonwebtoken";
import { insertMessage } from "./services/Messagesservice.js";
import { findNotif, insertNotif } from "./services/NotificationsService.js";

const cache = new Map();

export const defineSocket = (io) => {
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        try {
            const verify = jwt.verify(token, process.env.SECRET_JWT);
            socket.user = verify;
            next();
        } catch (err) {
            console.log(err);
            next(new Error("unauthorized"));
        }
    })
    io.on("connection", (socket) => {
        const { user_id } = socket.user;
        console.log("user telah connect", user_id);
        cache.set(user_id, socket.id);
        socket.on("private_message", async ({ id_target, message }) => {
            const target = cache.get(id_target);
            const user = cache.get(user_id);
            console.log(message);
            message.sended = true;
            if (target) {
                io.to(target).emit("private_message", ({ from: user_id, message: message }));
            }
            io.to(user).emit("message_sended", ({ id: message.message_id, is_message: true }));
            await insertMessage(message);
        });
        socket.on("user_active", ({ id, is_active }) => {
            const target = cache.get(id);
            const user = cache.get(user_id);
            is_active = target ? true : false;
            io.to(user).emit("user_active", ({ id, is_active }))
        });
        socket.on("notifications", async ({ id, receiver_id, actor_id, object_id, verb, message, user, data }) => {
            if (receiver_id === actor_id) return;
            const notif = await findNotif(receiver_id, object_id);
            if (notif && verb === 'like') return;
            const target = cache.get(actor_id);
            const is_read = "false";
            if (target) {
                io.to(target).emit("notifications", ({ id, receiver_id, actor_id, object_id, verb, is_read, message, receiver: user, data: JSON.stringify(data) }));
            }
            await insertNotif(id, receiver_id, actor_id, verb, object_id, message, is_read, data);
        });
        socket.on("notification_comment", async ({ id, receiver_id, actors, object_id, verb, message, user, data }) => {
            if (receiver_id === actor_id) return;
            const notif = await findNotif(receiver_id, object_id);
            if (notif && verb === 'like') return;
            const target = cache.get(actor_id);
            const is_read = "false";
            if (target) {
                io.to(target).emit("notifications", ({ id, receiver_id, actor_id, object_id, verb, is_read, message, receiver: user, data: JSON.stringify(data) }));
            }
            await insertNotif(id, receiver_id, actor_id, verb, object_id, message, is_read, data);
        })
    });
}