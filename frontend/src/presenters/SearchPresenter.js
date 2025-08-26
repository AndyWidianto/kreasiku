import { nanoid } from "nanoid";

export default class SearchPresenter {
    #model;
    #view;
    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }

    async SearchPostings(search, limit, hasMore, postings) {
        if (!hasMore) return;
        try {
            const offset = postings.length;
            const res = await this.#model.searchPostings(search, limit, offset);
            if (res.data.length < limit) {
                this.#view.hasMore.value = false;
            }
            res.data.map(data => {
                const showSetting = false;
                return {
                    showSetting,
                    ...data
                }
            });
            this.#view.postings.value = [...postings, ...res.data];
        } catch (err) {
            console.error(err);
        }
    }

    async searchUsersFromUsername(search, limit, users) {
        try {
            const offset = users.length;
            const res = await this.#model.searchUsersFromUsername(search, limit, offset);
            this.#view.countUsers.value = res.count - users.length - limit;
            this.#view.users.value = [...users, ...res.data];
        } catch (err) {
            console.error(err);
        }
    }

    async getUser() {
        try {
            const res = await this.#model.getUser();
            this.#view.user.value = res.data;
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    }

    async createFollow(id, users) {
        try {
            const findIndex = users.findIndex(user => user.user_id === id);
            if (findIndex < 0) return;
            users[findIndex].my_following = true;
            this.#view.users.value = users;
            const follow_id = nanoid();
            const res = await this.#model.createFollow(follow_id, id);
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    }

    async deleteFollow(id, users) {
        try {
            const findIndex = users.findIndex(user => user.user_id === id);
            if (findIndex < 0) return;
            users[findIndex].my_following = false;
            this.#view.users.value = users;
            const res = await this.#model.deleteFollow(id);
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    }

    async handleActionsLike(posting, postings, user, user_id_posting, socket) {
        const findIndex = postings.findIndex(value => value.posting_id === posting.posting_id);
        if (!postings[findIndex].is_like) {
            const id = nanoid();
            postings[findIndex].is_like = true;
            postings[findIndex].total_likes = postings[findIndex].total_likes + 1;
            postings[findIndex].like = {
                id: id,
                user_id: user.user_id,
                posting_id: posting.posting_id
            };
            console.log(user);
            const message = "menyukai postingan anda";
            const verb = "like";
            const id_notif = nanoid();
            socket.emit("notifications", (
                { 
                    id: id_notif, 
                    receiver_id: user.user_id, 
                    actor_id: user_id_posting, 
                    object_id: posting.posting_id, 
                    data: posting, 
                    verb: verb, 
                    message: message, 
                    user: user 
                }
            ));
            await this.createLike(posting.posting_id, id);
        } else {
            postings[findIndex].is_like = false;
            const { id } = postings[findIndex].like;
            postings[findIndex].total_likes = postings[findIndex].total_likes - 1;
            await this.deleteLike(id);
        }
        this.#view.postings.value = postings;
    }

    async createLike(posting_id, id) {
        try {
            const res = await this.#model.createLike(posting_id, id);
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    }
    async deleteLike(id) {
        try {
            await this.#model.deleteLikePosting(id);
        } catch (err) {
            console.error(err);
        }
    }
}