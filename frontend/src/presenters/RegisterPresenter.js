
export default class RegisterPresenter {
    #model;
    #view;

    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }
    
    async Register(username, email, password, confirmPassword) {
        if (password !== confirmPassword) return this.#view.message("masukan password yang sama untuk confirm password");
        this.#view.loading(true);
        try {
            const regis = await this.#model.register({ username, email, password });
            console.log(regis);
            localStorage.setItem("kreasiku", regis.token);
            this.#view.router.push("/create/profile");
        } catch (err) {
            console.error(err);
        } finally {
            this.#view.loading(false);
        }
    }
}