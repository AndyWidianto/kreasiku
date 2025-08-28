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
            const findIndex = messages.findIndex(message => message.message_id === data.id);
            messages[findIndex] = data.data;
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
        new Notification(data.user.username, {
            icon: data.user.profile.profile_picture || '/images/book.jpg',
            body: this.handleDecrypted(data.message.content, secret)
        });
        const messages = await getMessages(data.message.converstation_id);
        if (messages) {
            const newMessages = [...messages, data.message];
            return await setMessages(data.message.converstation_id, newMessages);
        }
        await setMessages(data.message.converstation_id, data.message);
    }
    async handlePrivateMessages(datas, secret) {
        const data = datas.datas[datas.datas.length - 1];
        new Notification(data.user.username, {
            icon: data.user.profile.profile_picture || '/images/book.jpg',
            body: this.handleDecrypted(data.message.content, secret)
        });
        for (const data of datas.datas) {
            console.log("data ", data);
            const messages = await getMessages(data.message.converstation_id);
            if (messages) {
                const newMessages = [...messages, data.message];
                await setMessages(data.message.converstation_id, newMessages);
            }
        }
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
        if (messages) {
            datas.forEach(item => {
                console.log(item);
                const findIndex = messages.findIndex(message => message.message_id === item.message_id);
                item.is_read = data.is_read;
                messages[findIndex] = item;
            });
            await setMessages(data.id, messages);
        }
    }
}