import { nanoid } from "nanoid";
import { getConverstation, getConverstations, setCoverstation } from "../models/database";


export default class ProfilePresenter {
    #model;
    #view;
    user;
    constructor({ model, view }) {
        this.#view = view;
        this.#model = model;
    }
    async getUser(username) {
        this.#view.loading.value = true;
        try {
            const res = await this.#model.getUserFromUsername(username);
            this.#view.user.value = res.data;
            this.user = res.data;
            console.log(res);
            this.getPostingsUser(res.data.user_id);
        } catch (err) {
            console.error(err);
        } finally {
            this.#view.loading.value = false;
        }
    }
    async getPostingsUser(id) {
        this.#view.loading.value = true;
        try {
            const res = await this.#model.getPostingsUser(id);
            this.#view.postings.value = res.data;
            console.log(res);
        } catch (err) {
            console.error(err);
        } finally {
            this.#view.loading.value = false;
        }
    }
    async createLike(id) {
        try {
            const res = await this.#model.createLike(id);
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    }
    async deleteLike(id) {
        try {
            const res = await this.#model.deleteLikePosting(id);
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    }
    async handleActionsLike(posting_id, postings, user_id) {
        console.log(postings);
        const findIndex = postings.findIndex(posting => posting.posting_id === posting_id);
        if (!postings[findIndex].like) {
            const id = nanoid();
            postings[findIndex].is_like = true;
            postings[findIndex].total_likes = postings[findIndex].total_likes + 1;
            postings[findIndex].like = {
                id: id,
                user_id: user_id,
                posting_id: posting_id
            }
            await this.createLike(posting_id, user_id);
        } else {
            const { id } = postings[findIndex].like;
            postings[findIndex].like = null;
            postings[findIndex].is_like = false;
            postings[findIndex].total_likes = postings[findIndex].total_likes - 1;
            await this.deleteLike(id);
        }
        this.#view.postings.value = postings;
    }

    async createFollow(id, user) {
        try {
            user.my_following = true;
            this.#view.user.value = user;
            const follow_id = nanoid();
            await this.#model.createFollow(follow_id, id);
            if (user.user_follow_me) {
                const converstation_id = nanoid();
                const res = await this.#model.createConverstation(converstation_id, user.user_id);
                console.log(res);
                const converstation = await getConverstation(res.data.id);
                if (!converstation) {
                    const data = res.data;
                    data.unread_count = 0;
                    data.last_message = null;
                    data.user = this.user;
                    data.my_id = res.data.user_id1 !== user.user_id ? res.data.user_id1 : res.data.user_id2;
                    await setCoverstation(res.data.id, data);
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    async deleteFollow(id, user) {
        try {
            user.my_following = false;
            this.#view.user.value = user;
            const res = await this.#model.deleteFollow(id);
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    }

}