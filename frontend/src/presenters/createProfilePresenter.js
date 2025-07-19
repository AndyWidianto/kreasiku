
export default class CreateProfilePresenter {
    #model;
    #view;
    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }

    async getUser() {
        try {
            const res = await this.#model.getUser();
            console.log(res);
            this.#view.user(res.data);
            this.#view.name(res.data.username);
        } catch (err) {
            console.error(err);
            this.#view.router.push("/Register");
        }
    }
    async CreateProfile(data) {
        this.#view.loading(true);
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                console.log("Ini Key:", key, "dan ini valuenya:", value);
                formData.append(key, value);
            })
            const res = await this.#model.CreateProfile(formData);
            console.log(res);
            this.#view.router.push("/");
        } catch (err) {
            console.error(err);
        } finally {
            this.#view.loading(false);
        }
    }
}