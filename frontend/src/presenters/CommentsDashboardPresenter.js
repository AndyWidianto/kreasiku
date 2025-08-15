import { nanoid } from "nanoid";


export default class CommentsDashboardPresenter {
    #model;
    #view;
    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }
    async getPosting(id) {
        this.#view.loading.value = true;
        try {
            const res = await this.#model.getPosting(id);
            console.log(res.data);
            this.#view.posting.value = res.data;
        } catch (err) {
            console.error(err);
        } finally {
            this.#view.loading.value = false;
        }
    }
    async getUser() {
        try {
            const res = await this.#model.getUser();
            this.#view.user.value = res.data;
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
    async handleActionsLike(posting, user_id) {
        const findLike = posting.likes.findIndex(like => like.user_id === user_id && like.posting_id === posting.posting_id);
        if (findLike < 0) {
            const id = nanoid();
            posting.likes.push({
                id: id,
                user_id: user_id,
                posting_id: posting.posting_id
            })
            posting.is_like = true;
            await this.#model.createLike(posting.posting_id, id);
        } else {
            const like = posting.likes[findLike];
            posting.likes = posting.likes.filter(value => value.id !== like.id);
            posting.is_like = false;
            await this.#model.deleteLike(like.id);
        }
        this.#view.posting.value = posting;
    }
    async handleSelectKey(content) {
        const mantionMatch = content.match(/@(\w*)$/);
        if (mantionMatch) {
            this.#view.showDropdownUser.value = true;
            const query = mantionMatch[1].toLowerCase();
            setTimeout(async () => {
                const res = await this.#model.getUsersFromUsername(query);
                this.#view.suggestions.value = res.data;
            }, 100);
        } else {
            this.#view.showDropdownUser.value = false;
        }
    }
    async createComment(socket, posting, user, content) {
        try {
            const comment_id = nanoid();
            const state = {
                comment_id: comment_id,
                user_id: user.user_id,
                posting: posting.posting_id,
                content: content,
                user: user,
            }
            posting.comments.push(state);
            this.#view.posting.value = posting;
            this.#view.content.value = '';
            await this.#model.createComment(comment_id, posting.posting_id, content);
            const id = nanoid();
            const verb = "comment";
            const message = "mengomentari postingan anda";
            socket.emit("notifications", ({ id, receiver_id: user.user_id, actor_id: posting.user.user_id, object_id: posting.posting_id, data: state, verb, message, user }));
        } catch (err) {
            console.error(err);
        }
    }
    async createMention(socket, comment_id, comments, user, content, mentions) {
        try {
            const mention_id = nanoid();
            const state = {
                id: mention_id,
                comment_id: comment_id,
                user_id: user.user_id,
                content: content,
                user: user,
            }
            const findIndex = comments.findIndex(comment => comment.comment_id === comment_id);
            if (!comments[findIndex].mentions) {
                comments[findIndex].mentions = [];
            }
            comments[findIndex].mentions.push(state);
            comments[findIndex].total_mentions = comments[findIndex].total_mentions + 1;
            this.#view.comments.value = comments;
            this.#view.content.value = '';
            await this.#model.createMention(mention_id, comment_id, content);
            mentions.map(mention => {
                const id = nanoid();
                const verb = "mention";
                const message = "menyebut anda dalam postingan";
                socket.emit("notifications", ({ id, receiver_id: user.user_id, actor_id: mention.id, object_id: comments[findIndex].posting_id, data: state, verb, message, user }));
            })
        } catch (err) {
            console.error(err);
        }
    }
    async getComments(limit, page, posting_id, hasMore, comments, target) {
        if (!hasMore) return;
        try {
            const offset = (page - 1) * limit;
            const res = await this.#model.getComments(posting_id, offset, limit, target);
            if (res.data.length < limit) {
                this.#view.hasMore.value = false;
            }
            this.#view.comments.value = [...comments, ...res.data];
            this.#view.page.value = page + 1;
        } catch (err) {
            console.error(err);
        }
    }
    async getMentions(id, limit, comments, mention_id) {
        this.#view.loadingMentions.value = true;
        try {
            const findIndex = comments.findIndex(value => value.comment_id === id);
            if (!comments[findIndex].mentions) {
                comments[findIndex].mentions = [];
            }
            const offset = mention_id ? comments[findIndex].mentions.length - 1 : comments[findIndex].mentions.length;
            const res = await this.#model.getMentions(id, offset, limit);
            console.log(res);
            const mentions = res.data.filter(value => value.id !== comments[findIndex].mentions[0]?.id);
            comments[findIndex].mentions = [...comments[findIndex].mentions, ...mentions];
            this.#view.comments.value = comments;
        } catch (err) {
            console.error(err);
        } finally {
            this.#view.loadingMentions.value = false;
        }
    }
    async getMention(comment_id, mention_id, comments) {
        this.#view.loadingMentions.value = true;
        try {
            const findIndex = comments.findIndex(value => value.comment_id === comment_id);
            const res = await this.#model.getMention(mention_id);
            comments[findIndex].mentions = [res.data];
            this.#view.comments.value = comments;
        } catch (err) {
            console.error(err);
        } finally {
            this.#view.loadingMentions.value = false;
        }
    }
}