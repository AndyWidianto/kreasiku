import { nanoid } from "nanoid";
import { getConverstation, getConverstations, getMessages, setCoverstation, setMessages } from "../models/database";
import CryptoJS from "crypto-js";

export default class ChatPresenter {
    #model;
    #view;
    converstations = [];

    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }

    async getConverstations() {
        try {
            const converstation = await getConverstations();
            if (converstation.length > 0) {
                const sort = this.sortConverstions(converstation);
                this.#view.users.value = sort;
                this.#view.CopyUsers.value = sort;
                this.converstations = sort;
                return;
            }
            const res = await this.#model.getConverstations();
            this.#view.users.value = res.data;
            this.converstations = res.data;
            res.data.forEach(async (value) => {
                value.guest = false;
                await setCoverstation(value.id, value);
            });
        } catch (err) {
            console.error(err);
        }
    }

    async guestConverstation(username, converstations) {
        try {
            const res = await this.#model.getUserFromUsername(username);
            const findIndex = converstations.findIndex(conv => conv.user.user_id === res.data.user_id);
            if (findIndex < 0) {
                const my_id = converstations[converstations.length - 1].my_id;
                const newConverstation = {
                    id: nanoid(),
                    user_id1: my_id,
                    user_id2: res.data.user_id,
                    unread_count: 0,
                    last_message: null,
                    my_id: my_id,
                    user: res.data,
                    guest: true
                }
                this.#view.users.value = [...converstations, newConverstation];
                this.converstations = [...this.converstations, newConverstation];
            }
        } catch (err) {
            console.error(err);
        }
    }

    async getSecret() {
        try {
            const res = await this.#model.getSecret();
            this.#view.secret.value = res.secret;
        } catch (err) {
            console.error(err);
        }
    }
    sortConverstions(converstations) {
        const sortConverstions = converstations.sort((a, b) => {
            if (a.unread_count > 0 && b.unread_count === 0) return -1;
            if (a.unread_count === 0 && b.unread_count > 0) return 1;
            return new Date(b.last_message?.createdAt) - new Date(a.last_message?.createdAt);
        })
        return sortConverstions;
    }
    async getMessages(id, user, users, socket) {
        try {
            this.#view.message.value = "";
            this.#view.userActive.value = user;
            this.updateMessageUnread(id, users, socket);
            const messages = await getMessages(id);
            socket.emit("join_private_chat", ({ partnerId: user.user.user_id }));
            socket.emit("user_active", ({ id: user.user.user_id, is_active: false }));
            if (messages) {
                return this.#view.messages.value = messages;
            }
            const res = await this.#model.getMessages(id);
            this.#view.messages.value = res.data;
            await setMessages(id, res.data);
        } catch (err) {
            console.error(err);
        } finally {
            const converstation = await getConverstation(id);
            if (converstation) {
                converstation.unread_count = 0;
                await setCoverstation(id, converstation);
            }
        }
    }
    async updateMessageUnread(id, users, socket) {
        const findIndex = users.findIndex(user => user.id === id);
        const unread_count = users[findIndex].unread_count;
        users[findIndex].unread_count = 0;
        try {
            this.#view.users.value = users;
            await this.#model.updateMessagesUnread(users[findIndex].user.user_id);
            socket.emit("private_message_read", ({ id: users[findIndex].id, target_id: users[findIndex].user.user_id }));
        } catch (err) {
            console.error(err);
        }
    }
    async sendMessage(user, message, secret, users, socket) {
        try {
            const date = new Date().toISOString();
            const encrypt = this.encryptMessage(message, secret);
            const data = {
                converstation_id: user.id,
                message_id: nanoid(),
                sender_id: user.my_id,
                receiver_id: user.user.user_id,
                content: encrypt,
                sended: "pending",
                createdAt: date,
                updatedAt: date
            }
            this.#view.messages.value = [...this.#view.messages.value, data];
            this.#view.message.value = '';
            const findIndex = users.findIndex(value => value.id === user.id);
            users[findIndex].last_message = data;
            const messages = await getMessages(user.id);
            this.converstations[findIndex].last_message = data;
            if (user?.guest) {
                const res = await this.#model.createConverstation(user.id, user.user_id2);
                console.log(res);
                users[findIndex].guest = false;
                this.converstations[findIndex].guest = false;
                await setCoverstation(user.id, this.converstations[findIndex]);
            } else {
                await setCoverstation(user.id, this.converstations[findIndex]);
            }
            this.#view.users.value = this.sortConverstions(users);
            await setMessages(user.id, [...messages, data]);
            socket.emit("private_message", ({ id_target: user.user.user_id, user: user.me, message: data }));
        } catch (err) {
            console.error(err);
        }
    }

    async handleMessageSended(messages, data) {
        const findIndex = messages.findIndex(message => message.message_id === data.id);
        console.log(messages[findIndex]);
        if (findIndex > -1) {
            messages[findIndex] = data.data;
            this.#view.messages.value = messages;
        }
    }
    async handleMessagesSended(data, messages) {
        const datas = data.datas;
        datas.forEach(item => {
            const findIndex = messages.findIndex(message => message.message_id === item.message_id);
            messages[findIndex] = item;
            messages[findIndex].is_read = data.is_read;
        });
        this.#view.messages.value = messages;
    }
    async handlePrivateMessagesRead(data, userActive, messages) {
        if (userActive.id === data.id) {
            const newMessages = messages.map(message => {
                message.is_read = "true";
                return { ...message };
            });
            this.#view.messages.value = newMessages;
        }
    }
    encryptMessage(message, secret) {
        const encrypted = CryptoJS.AES.encrypt(message, secret).toString();
        return encrypted;
    }
    decryptMessage(encrypted, secret) {
        const bytes = CryptoJS.AES.decrypt(encrypted, secret);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted;
    }
}