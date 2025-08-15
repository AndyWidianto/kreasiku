import { nanoid } from "nanoid";

export default class NotFollowingPresenter {
    #model;
    #view;

    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }

    async getFollowersNotFollowing() {
        this.#view.loading.value = true;
        try {
            const res = await this.#model.getFollowersNotFollowing();
            console.log(res);
            this.#view.followers.value = res.data;
        } catch (err) {
            console.error(err);
        } finally {
            this.#view.loading.value = false;
        }
    }
    async handleActionFollow(id, followers) {
        const findIndex = followers.findIndex(follower => follower.id === id);
        const user_id = followers[findIndex].follower.user_id;
        console.log(user_id);
        if (followers[findIndex].folback) {
            followers[findIndex].folback = false;
            this.deleteFollow(user_id);
        } else {
            followers[findIndex].folback = true;
            this.createFollow(user_id);
        }
    }
    async createFollow(following_id) {
        try {
            const id = nanoid();
            const res = await this.#model.createFollow(id, following_id);
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    }
    async deleteFollow(id) {
        try {
            const res = await this.#model.deleteFollow(id);
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    }
}