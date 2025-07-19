
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
    async Logout() {
        if (!confirm("Apakah anda yakin ingin Logout?")) return;
        try {
            localStorage.removeItem("kreasiku");
            const res = await this.#model.logout();
            console.log(res);
            this.#view.router.push("/login");
        } catch (err) {
            console.error(err);
        }
    }
}