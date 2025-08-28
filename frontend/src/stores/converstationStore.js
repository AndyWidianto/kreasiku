import { defineStore } from "pinia";
import data from "../models/data";
import { nanoid } from "nanoid";
import { getMessages, setMessages } from "../models/database";
import CryptoJS from "crypto-js";

const api = new data();

export const useConverstationStore = defineStore('converstations', {
    state: () => ({
        converstations: null,
        copyConverstations: [],
        secret: null,
        messages: [],
        message: '',
        userActive: null
    }),
    actions: {
        async getConverstations() {
            if (this.converstations) return;
            try {
                const res = await api.getConverstations();
                console.log(res);
                res.data.map((value) => {
                    value.guest = false;
                    return {
                        ...value
                    }
                });
                this.converstations = res.data;
                this.copyConverstations = [...res.data];
            } catch (err) {
                console.error(err);
            }
            return this.converstations;
        },
        async guestConverstation(username, socket) {
            try {
                const res = await api.getUserFromUsername(username);
                const findIndex = this.converstations.findIndex(conv => conv.user.user_id === res.data?.user_id);
                if (findIndex < 0) {
                    const my_id = this.converstations[this.converstations.length - 1].my_id;
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
                    this.converstations = [newConverstation, ...this.converstations];
                    this.copyConverstations = [newConverstation, ...this.copyConverstations];
                    await this.getMessages(newConverstation.id, newConverstation, socket);
                }
            } catch (err) {
                console.error(err);
            }
        },
        async createConverstation(user) {
            try {
                const id = nanoid();
                const res = await api.createConverstation(id, user.user_id);
                console.log(res);
                if (this.converstations.length > 0) {
                    const findIndex = this.converstations.findIndex(value => value.user.user_id === user.user_id);
                    if (findIndex < 0) {
                        const converstation = res.data;
                        converstation.unread_count = 0;
                        converstation.last_message = null;
                        converstation.user = user;

                    }
                }
            } catch (err) {
                console.error(err);
            }
        },
        async sendMessage(socket) {
            try {
                const date = new Date().toISOString();
                const encrypt = this.encryptMessage(this.message, this.secret);
                const data = {
                    converstation_id: this.userActive.id,
                    message_id: nanoid(),
                    sender_id: this.userActive.my_id,
                    receiver_id: this.userActive.user.user_id,
                    content: encrypt,
                    sended: "pending",
                    createdAt: date,
                    updatedAt: date
                }
                this.messages = [...this.messages, data];
                this.message = '';
                const findIndex = this.converstations.findIndex(value => value.id === this.userActive.id);
                this.converstations[findIndex].last_message = data;
                if (this.userActive.guest) {
                    const res = await api.createConverstation(this.userActive.id, this.userActive.user_id2);
                    console.log(res);
                    this.converstations[findIndex].guest = false;
                    this.converstations[findIndex].guest = false;
                }
                this.converstations = this.sortConverstions(this.converstations);
                const messages = await getMessages(this.userActive.id);
                await setMessages(this.userActive.id, [...messages, data]);
                socket.emit("private_message", ({ id_target: this.userActive.user.user_id, user: this.userActive.me, message: data }));
            } catch (err) {
                console.error(err);
            }
        },
        async updateMessageUnread(id, socket) {
            const findIndex = this.converstations.findIndex(user => user.id === id);
            this.converstations[findIndex].unread_count = 0;
            try {
                this.converstations = this.converstations;
                await api.updateMessagesUnread(this.converstations[findIndex].user.user_id);
                socket.emit("private_message_read", ({ id: this.converstations[findIndex].id, target_id: this.converstations[findIndex].user.user_id }));
            } catch (err) {
                console.error(err);
            }
        },
        async getSecret() {
            if (this.secret) return;
            try {
                const res = await api.getSecret();
                this.secret = res.secret;
            } catch (err) {
                console.error(err);
            }
        },
        async getMessages(id, user, socket) {
            try {
                this.message = "";
                this.userActive = user;
                this.updateMessageUnread(id, socket);
                const messages = await getMessages(id);
                socket.emit("join_private_chat", ({ partnerId: user.user.user_id }));
                socket.emit("user_active", ({ id: user.user.user_id, is_active: false }));
                if (messages) {
                    return this.messages = messages;
                }
                const res = await api.getMessages(id);
                this.messages = res.data;
                await setMessages(id, res.data);
            } catch (err) {
                console.error(err);
            }
        },
        sortConverstions(converstations) {
            const sortConverstions = converstations.sort((a, b) => {
                if (a.last_message && !b.last_message) return -1;
                if (!a.last_message && b.last_message) return 1;
                if (a.unread_count > 0 && b.unread_count === 0) return -1;
                if (a.unread_count === 0 && b.unread_count > 0) return 1;
                return new Date(b.last_message?.createdAt) - new Date(a.last_message?.createdAt);
            })
            return sortConverstions;
        },
        encryptMessage(message) {
            const encrypted = CryptoJS.AES.encrypt(message, this.secret).toString();
            return encrypted;
        },
        decryptMessage(encrypted) {
            const bytes = CryptoJS.AES.decrypt(encrypted, this.secret);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            return decrypted;
        },
        async handleMessageSended(data) {
            const findIndex = this.messages.findIndex(message => message.message_id === data.id);
            console.log(this.messages[findIndex]);
            if (findIndex > -1) {
                this.messages[findIndex] = data.data;
            }
        },
        async handleMessagesSended(data) {
            const datas = data.datas;
            datas.forEach(item => {
                const findIndex = this.messages.findIndex(message => message.message_id === item.message_id);
                this.messages[findIndex] = item;
                this.messages[findIndex].is_read = data.is_read;
            });
        },
        async handlePrivateMessagesRead(data) {
            if (this.userActive.id === data.id) {
                const newMessages = this.messages.map(message => {
                    message.is_read = "true";
                    return { ...message };
                });
                this.messages = newMessages;
            }
        },
        handlePrivateMessage(data) {
            if (this.userActive?.id === data.message.converstation_id) {
                this.messages = [...this.messages, data.message];
            }
            const findIndex = this.converstations.findIndex(user => user.id === data.message.converstation_id);
            console.log("ini find index", findIndex);
            if (findIndex > -1) {
                this.converstations[findIndex].last_message = data.message;
                const unread_count = this.converstations[findIndex].unread_count;
                this.converstations[findIndex].unread_count = data.message.is_read === "true" ? unread_count : unread_count + 1;
            }
        },
        handleDeleteActive(socket) {
            this.userActive = null;
            socket.emit("leave_private_chat");
        }
    }
});