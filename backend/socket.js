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
        const id = socket.id;
        cache.set(user_id, id);
        console.log("user telah connect", user_id);
        // memastikan tidak ada pesan yang menumpuk
        const datasSaved = cache.get(`receiver-offline-${user_id}`);
        if (datasSaved) {
            io.to(id).emit("private_messages", ({ from: user_id, datas: datasSaved }));
            const newData = datasSaved.reduce((acc, item) => {
                if (!acc[item.message.converstation_id]) {
                    acc[item.message.converstation_id] = [];
                }
                acc[item.message.converstation_id].push(item.message);
                return acc;
            }, {});
            Object.entries(newData).forEach(([key, value]) => {
                const target = cache.get(value[value.length - 1].sender_id);
                if (target) {
                    const room = cache.get(`room:${user_id}`);
                    console.log("sedang di room", room);
                    console.log("ini usernya", value[value.length - 1].sender_id);
                    const is_read = room === value[value.length - 1].sender_id ? "true" : "false";
                    io.to(target).emit("messages_sended", ({ id: parseInt(key), datas: value, is_read }));
                } else {
                    const datasSenderOffline = cache.get(`sender-offline-${value[value.length - 1].sender_id}`);
                    const senderOffline = { id: parseInt(key), datas: value };
                    if (!datasSenderOffline) {
                        return cache.set(`sender-offline-${value[value.length - 1].sender_id}`, [senderOffline]);
                    }
                    cache.set(`sender-offline-${value[value.length - 1].sender_id}`, [...datasSenderOffline, senderOffline]);
                }
            })
            cache.delete(`receiver-offline-${user_id}`);
        }
        // memastikan jika ada notif pesan yang menumpuk
        const senders = cache.get(`sender-offline-${user_id}`);
        if (senders) {
            senders.forEach(sender => {
                const room = cache.get(`room:${user_id}`);
                const is_read = room === sender.datas[sender.datas.length - 1].sender_id ? "true" : "false";
                sender.is_read = is_read;
                io.to(id).emit("messages_sended", (sender));
            })
            cache.delete(`sender-offline-${user_id}`);
        }
        const messageRead = cache.get(`message-read-${user_id}`);
        if (messageRead) {
            io.to(id).emit("private_message_read", (messageRead));
        }
        // memantau user sedang chat dengan siapa
        socket.on("join_private_chat", ({ partnerId }) => {
            cache.delete(`room:${user_id}`);
            cache.set(`room:${user_id}`, partnerId);
        });
        socket.on("leave_private_chat", () => {
            cache.delete(`room:${user_id}`);
            console.log("berhasil hapus room");
        });
        socket.on("private_message_read", ({ id, target_id }) => {
            const target = cache.get(target_id);
            if (target) {
                io.to(target).emit("private_message_read", ({ from: user_id, id }));
            }
            cache.set(`message-read-${target_id}`, { from: user_id, id });
        })
        socket.on("private_message", async ({ id_target, user, message }) => {
            const target = cache.get(id_target);
            const room = cache.get(`room:${id_target}`);
            const is_read = room === user_id ? "true" : "false";
            message.is_read = is_read;
            if (target) {
                io.to(target).emit("private_message", ({ from: user_id, user, message }));
                message.sended = "sended";
                io.to(id).emit("message_sended", ({ converstation_id: message.converstation_id, id: message.message_id, data: message }));
            } else {
                const datas = cache.get(`receiver-offline-${id_target}`);
                message.sended = "sended";
                const data = { user, message };
                if (!datas) {
                    cache.set(`receiver-offline-${id_target}`, [data]);
                } else {
                    cache.set(`receiver-offline-${id_target}`, [...datas, data]);
                }
            }
            await insertMessage(message);
        });
        socket.on("user_active", ({ id, is_active }) => {
            const target = cache.get(id);
            is_active = target ? true : false;
            io.to(id).emit("user_active", ({ id, is_active }))
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
        });
        socket.on("disconnect", () => {
            console.log("user id telah logout", user_id);
            cache.delete(user_id);
            cache.delete(`room:${user_id}`);
            console.log(cache.get((`room:${user_id}`)));
        })
    });
}