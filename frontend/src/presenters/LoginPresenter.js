
export default class LoginPresenter {
    #model;
    #view;
    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }

    async Login(username, password, socket) {
        this.#view.loading.value = true;
        try {
            const res = await this.#model.Login(username, password);
            if ("Storage" in window) {
                localStorage.setItem("kreasiku", res.token)
            }
            socket.auth = { token: res.token };
            socket.connect();
            this.#view.navigate.push("/");
        } catch (err) {
            console.error(err);
            this.#view.error.value = err.response.data.error;
            this.#view.message.value = err.response.data.message;
        } finally {
            this.#view.loading.value = false;
        }
    }
}