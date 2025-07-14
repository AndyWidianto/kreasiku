
export default class NavbarDashboardPresenter {
    #model;
    #view;
    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }
    async getNotificationNotRead() {
        try {
            const res = await this.#model.geNotifNotRead();
            this.#view.NotificationsNotRead(res.data);
        } catch (err) {
            console.error(err);
        }
    }
    async getNotifications() {
        try {
            const res = await this.#model.getNotifications();
            console.log(res);
            this.#view.notifications(res.data);
        } catch (err) {
            console.error(err);
        }
    }
}