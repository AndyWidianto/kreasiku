
export default class LoginPresenter {
    #model;
    #view;
    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }

    async Login(username, password) {
        this.#view.loading(true);
        try {
            const res = await this.#model.Login(username, password);
            if ("Storage" in window) {
                console.log("Apakah iya");
                localStorage.setItem("kreasiku", res.token)
            }
            console.log(res);
            this.#view.navigate.push("/");
        } catch (err) {
            console.error(err);
        } finally {
            this.#view.loading(false);
        }
    }
}