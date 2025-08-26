import { getConverstation, getMessages, setCoverstation, setMessages } from "../models/database";
import CryptoJS from "crypto-js";

export default class AppPresenter {
    #model;
    #view;

    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }
    async handleMessageSended(data) {
        const messages = await getMessages(data.converstation_id);
        if (messages) {
            const findIndex = messages.findIndex(message => message.message_id === item.message_id);
            messages[findIndex] = data.message;
            await setMessages(data.converstation_id, messages);
        }
    }
    handleDecrypted(content, secret) {
        const bytes = CryptoJS.AES.decrypt(content, secret);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted;
    }
    async getSecret() {
        try {
            const res = await this.#model.getSecret();
            this.#view.secret.value = res.secret;
        } catch (err) {
            console.error(err);
        }
    }
    async handlePrivateMessage(data, secret) {
        console.log("private message dari app ", data);
        const messages = await getMessages(data.message.converstation_id);
        const converstation = await getConverstation(data.message.converstation_id);
        if (converstation) {
            converstation.last_message = data.message;
            converstation.unread_count = data.message.is_read === "true" ? converstation.unread_count : converstation.unread_count + 1;
            await setCoverstation(data.message.converstation_id, converstation);
        }
        if (!converstation) {
            const res = await this.#model.getConverstation(data.message.converstation_id);
            await setCoverstation(res.data.id, res.data);
        }
        if (messages) {
            const newMessages = [...messages, data.message];
            await setMessages(data.message.converstation_id, newMessages);
        }
        new Notification(data.user.username, {
            icon: data.user.profile.profile_picture || '/images/book.jpg',
            body: this.handleDecrypted(data.message.content, secret)
        });
    }
    async handlePrivateMessages(datas, secret) {
        for (const data of datas.datas) {
            const converstation = await getConverstation(data.message.converstation_id);
            const messages = await getMessages(data.message.converstation_id);
            if (converstation) {
                converstation.last_message = data.message;
                converstation.unread_count = data.message.is_read === "true" ? converstation.unread_count : converstation.unread_count + 1;
                await setCoverstation(data.message.converstation_id, converstation);
            }
            if (!converstation) {
                const res = await this.#model.getConverstation(data.message.converstation_id);
                await setCoverstation(res.data.id, res.data);
            }
            if (messages) {
                const newMessages = [...messages, data.message];
                await setMessages(data.message.converstation_id, newMessages);
            }
        }
        const data = datas.datas[datas.datas.length - 1];
        new Notification(data.user.username, {
            icon: data.user.profile.profile_picture || '/images/book.jpg',
            body: this.handleDecrypted(data.message.content, secret)
        });
    }
    async handlePrivateMessagesRead(data) {
        const messages = await getMessages(data.id);
        if (messages) {
            const newMessages = messages.map(message => {
                message.is_read = "true";
                return { ...message };
            });
            await setMessages(data.id, newMessages);
        }
    }
    async handleMessagesSended(data) {
        const datas = data.datas;
        const messages = await getMessages(data.id);
        for (const item of datas) {
            const findIndex = messages.findIndex(message => message.message_id === item.message_id);
            messages[findIndex] = item;
            messages[findIndex].is_read = data.is_read;
        }
        await setMessages(data.id, messages);
    }
}