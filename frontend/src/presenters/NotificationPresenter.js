export default class NotificationPresenter {
    #model;
    #view;

    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }

    async getNotifications() {
        this.#view.loading.value = true;
        try {
            const res = await this.#model.getNotifications();
            console.log(res);
            this.#view.notifications.value = res.data;
        } catch (err) {
            console.error(err);
        } finally {
            this.#view.loading.value = false;
        }
    }
}