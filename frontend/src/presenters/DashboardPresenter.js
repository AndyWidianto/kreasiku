export default class DashboardPresenter {
    #model;
    #view;
    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }
    async getPostings() {
        this.#view.loading(true);
        try {
            const res = await this.#model.getPostings();
            console.log(res);
            this.#view.postings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            this.#view.loading(false);
        }
    }
    handleChangeImages(images) {
        Array.from(images).map(image => {
            this.#view.images(image);
            const blobImage = URL.createObjectURL(image);
            this.#view.previewImages(blobImage);
        })
    }
    async createPosting(content, images) {
        this.#view.showCreatePosting(false);
        this.#view.showLoadingPosting(true);
        try {
            this.#view.progress(1 / 2 * 100);
            const res = await this.#model.createPosting(content);
            console.log(res.data);
            this.#view.progress(2 / 2 * 100);
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
            this.#view.progress(0);
            this.#view.showLoadingPosting(false);
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