
export default class ProfilePresenter {
    #model;
    #view;
    constructor({ model, view }) {
        this.#view = view;
        this.#model = model;
    }
    async getUser() {
        try {
            const res = await this.#model.getUser();
            this.#view.user(res.data);
            this.getPostingsUser(res.data.user_id);
        } catch (err) {
            console.error(err);
        }
    }
    async getPostingsUser(id) {
        this.#view.loading(true);
        try {
            const res = await this.#model.getPostingsUser(id);
            console.log(res.data);
            this.#view.posting(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            this.#view.loading(false);
        }
    }
    isLike(likes, user) {
        console.log(user);
        console.log("total", likes);
        const findLike = likes?.findIndex(value => value.user_id === user?.user_id);
        if (findLike === -1) {
            return false;
        }
        return true;
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
    async handleActionsLike(id, postings, user_id) {
        const findPosting = postings.findIndex(posting => posting.posting_id === id);
        const findLike = postings[findPosting].likes.findIndex(like => like.user_id === user_id && like.posting_id === id);
        if (findLike < 0) {
            postings[findPosting].likes.push({
                user_id: user_id,
                posting_id: id
            })
            await this.createLike(id, user_id);
        } else {
            postings[findPosting].likes = postings[findPosting].likes.filter((like, index) => index !== findLike);
            await this.deleteLike(id);
        }
        this.#view.postings(postings);
    }
}