
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
            this.#view.NotificationsNotRead.value = res.data;
        } catch (err) {
            console.error(err);
        }
    }
    async getNotifications() {
        this.#view.loading.value = true;
        try {
            const res = await this.#model.getNotifications();
            this.#view.notifications.value = res.data;
        } catch (err) {
            console.error(err);
        } finally {
            this.#view.loading.value = false;
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
    async updateNotif(id, notifications, NotificationsNotRead) {
        try {
            const findIndex = notifications.findIndex(notif => notif.id === id);
            notifications[findIndex].is_read = "true";
            this.#view.NotificationsNotRead.value = NotificationsNotRead.filter(notif => notif.id !== id);
            await this.#model.updateNotif(id, notifications[findIndex].is_read);
        } catch (err) {
            console.error(err);
        }
    }
}