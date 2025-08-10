import { nanoid } from "nanoid";

export default class ChatPresenter {
    #model;
    #view;

    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }

    async getConverstation() {
        try {
            const res = await this.#model.getConverstation();
            console.log(res);
            this.#view.users.value = res.data;
        } catch (err) {
            console.error(err);
        }
    }
    
    async getMessages() {
        try {
            const res = await this.#model.getMessages();
            this.#view.messages.value = res.data;
        } catch (err) {
            console.error(err);
        }
    }

    async sendMessage(users, user, message, socket) {
        try {
            const data = {
                converstation_id: user.id,
                message_id: nanoid(),
                sender_id: user.my_id,
                receiver_id: user.user.user_id,
                content: message,
                sended: false
            };
            const findIndex = this.#view.users.value.findIndex(value => value.id === user.id);
            this.#view.users.value[findIndex].messages.push(data);
            this.#view.message.value = '';
            socket.emit("private_message", ({ id_target: user.user.user_id, message: data }));
        } catch (err) {
            console.error(err);
        }
    }
}