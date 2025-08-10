import { nanoid } from "nanoid";

export default class DashboardPresenter {
    #model;
    #view;
    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }
    async getPostings(limit, page, postings, hasMore) {
        if (!hasMore) return;
        try {
            const offset = (page - 1) * limit;
            const res = await this.#model.getPostings(offset, limit);
            if (res.data.length < limit) {
                this.#view.hasMore.value = false;
            }
            this.#view.page.value = page + 1;
            this.#view.postings.value = [...postings, ...res.data];
        } catch (err) {
            console.error(err);
        }
    }
    handleChangeImages(images) {
        Array.from(images).map(image => {
            this.#view.images.push(image);
            const blobImage = URL.createObjectURL(image);
            this.#view.previewImages.push(blobImage);
        })
    }
    async createPosting(content, images) {
        this.#view.showCreatePosting.value = false;
        this.#view.showLoadingPosting.value = true;
        try {
            this.#view.progress.value = 1 / 2 * 100;
            const res = await this.#model.createPosting(content);
            console.log(res.data);
            this.#view.progress.value = 2 / 2 * 100;
            const formData = new FormData();
            images.map(image => {
                formData.append("images", image);
            })
            formData.append("posting_id", res.data.posting_id);
            const image = await this.#model.createImagesPosting(formData);
            console.log(image);
            this.getPostings();
        } catch (err) {
            console.error(err);
        } finally {
            this.#view.progress.value = 0;
            this.#view.showLoadingPosting.value = false;
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
    async handleActionsLike(posting, postings, user, user_id_posting, socket) {
        const findPosting = postings.findIndex(value => value.posting_id === posting.posting_id);
        const findLike = postings[findPosting].likes.findIndex(like => like.user_id === user.user_id && like.posting_id === posting.posting_id);
        if (findLike < 0) {
            const id = nanoid();
            postings[findPosting].is_like = true;
            postings[findPosting].likes.push({
                id: id,
                user_id: user.user_id,
                posting_id: posting.posting_id
            })
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
            await this.createLike(posting.posting_id, user.user_id);
        } else {
            postings[findPosting].is_like = false;
            const like = postings[findPosting].likes[findLike];
            postings[findPosting].likes = postings[findPosting].likes.filter(value => value.id !== like.id);
            await this.deleteLike(like.id);
        }
        this.#view.postings.value = postings;
    }
}