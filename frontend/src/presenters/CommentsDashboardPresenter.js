export default class CommentsDashboardPresenter {
    #model;
    #view;
    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }
    async getPosting(id) {
        try {
            const res = await this.#model.getPosting(id);
            console.log(res.data);
            this.#view.posting(res.data);
        } catch (err) {
            console.error(err);
        }
    }
    async getUser() {
        try {
            const res = await this.#model.getUser();
            console.log(res);
            this.#view.user(res.data);
        } catch (err) {
            console.error(err);
        }
    }
    async createLike(id) {
        try {
            await this.#model.createLike(id);
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
    async handleActionsLike(id, posting, user_id) {
        const findLike = posting.likes.findIndex(like => like.user_id === user_id && like.posting_id === id);
        if (findLike < 0) {
            posting.likes.push({
                user_id: user_id,
                posting_id: id
            })
            await this.createLike(id, user_id);
        } else {
            posting.likes = posting.likes.filter((like, index) => index !== findLike);
            await this.deleteLike(id);
        }
        this.#view.posting(posting);
    }
    async handleSelectKey(content) {
        const mantionMatch = content.match(/@(\w*)$/);
        if (mantionMatch) {
            this.#view.showDropdownUser(true);
            const query = mantionMatch[1].toLowerCase();
            setTimeout(async () => {
                const res = await this.#model.getUsersFromUsername(query);
                this.#view.suggestions(res.data);
            }, 100);
        } else {
            this.#view.showDropdownUser(false);
        }
    }
    async createComment(posting, user, content) {
        try {
            const state = {
                user_id: user.user_id,
                posting: posting.posting_id,
                content: content,
                user: user,
            }
            posting.comments.push(state);
            this.#view.posting(posting);
            this.#view.content('');
            const res = await this.#model.createComment(posting.posting_id, content);
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    }
}