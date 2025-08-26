import { nanoid } from "nanoid";

export default class FollowingsPresenter {
    #model;
    #view;

    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }

    async getFollowings(username, limit, page, hasMore, followings, search) {
        if (!hasMore) return;
        this.#view.loading.value = true;
        try {
            const offset = (page - 1) * limit;
            const res = await this.#model.getFollowings(username, limit, offset, search);
            console.log(res);
            if (res.data.length < limit) {
                this.#view.hasMore.value = false;
            }
            this.#view.followers.value = [...followings, ...res.data];
            this.#view.page.value = page + 1;
        } catch (err) {
            console.error(err);
        } finally {
            this.#view.loading.value = false;
        }
    }
    async handleActionFollow(id, followers) {
        const findIndex = followers.findIndex(follower => follower.id === id);
        console.log(followers[findIndex]);
        const user_id = followers[findIndex].following.user_id;
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