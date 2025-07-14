
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
            console.log("ini dari layout", res);
            this.#view.user(res.data);
        } catch (err) {
            console.error(err);
        }
    }
}