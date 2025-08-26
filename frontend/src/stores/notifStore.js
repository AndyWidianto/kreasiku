import { defineStore } from "pinia";
import data from "../models/data";
import { useRouter } from "vue-router";

const api = new data();

export const useNotifStore = defineStore('notif', {
    state: () => ({
        notifications: [],
        loading: false,
        NotificationsNotRead: [],
        search: '',
        hasMore: true,
        limit: 15
    }),
    actions: {
        async getNotifications() {
            if (!this.hasMore) return;
            try {
                const offset = this.notifications.length;
                const res = await api.getNotifications(this.limit, offset);
                if (res.data.length < this.limit) {
                    this.hasMore = false;
                }
                this.notifications = [...this.notifications, ...res.data];
            } catch (err) {
                console.error(err);
            }

            return this.notifications;
        },
        async getNotificationNotRead() {
            try {
                const res = await api.geNotifNotRead();
                this.NotificationsNotRead = res.data;
            } catch (err) {
                console.error(err);
            }
        },
        async updateNotif(index) {
            try {
                this.notifications[index].is_read = "true";
                this.NotificationsNotRead = this.NotificationsNotRead.filter(notif => notif.id !== this.notifications[index].id);
                await api.updateNotif(this.notifications[index].id, this.notifications[index].is_read);
            } catch (err) {
                console.error(err);
            }
        },
        async logout() {
            const router = useRouter();
            if (!confirm("Apakah anda yakin ingin Logout?")) return;
            try {
                localStorage.removeItem("kreasiku");
                const res = await api.logout();
                console.log(res);
                router.push("/login");
            } catch (err) {
                console.error(err);
            }
        },
        addNotif(newNotif) {
            this.notifications = [newNotif, ...this.notifications];
        },
        addNotifNotRead(newNotif) {
            this.NotificationsNotRead = [newNotif, ...this.NotificationsNotRead];
        }
    }

})