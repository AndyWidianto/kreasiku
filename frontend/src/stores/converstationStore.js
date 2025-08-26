import { defineStore } from "pinia";
import data from "../models/data";
import { nanoid } from "nanoid";

const api = new data();

export const useConverstationStore = defineStore('converstations', {
    state: () => ({
        converstations: []
    }),
    actions: {
        async getConverstation() {
            if (this.converstations.length > 0) return this.converstations;
            try {
                const res = await api.getConverstation();
                console.log(res);
                this.converstations = [...res.data];
            } catch (err) {
                console.error(err);
            }
        },
        async createConverstation(user) {
            try {
                const id = nanoid();
                const res = await api.createConverstation(id, user.user_id);
                console.log(res);
                if (this.converstations.length > 0) {
                    const findIndex = this.converstations.findIndex(value => value.user.user_id === user.user_id);
                    if (findIndex < 0) {
                        const converstation = res.data;
                        converstation.unread_count = 0;
                        converstation.last_message = null;
                        converstation.user = user;

                    }
                }
            } catch (err) {
                console.error(err);
            }
        }
    }
});