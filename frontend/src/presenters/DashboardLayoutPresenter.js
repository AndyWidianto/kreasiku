
export default class DashboardLayoutPresenter {
    #model;
    #view;
    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }
    async getUser() {
        try {
            const res = await this.#model.getUser();
            if (!res.data.profile) {
                this.#view.router.push("/create/profile");
            }
            this.#view.user(res.data);
        } catch (err) {
            console.error(err);
        }
    }
}