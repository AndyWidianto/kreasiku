export default  class CreateCoverPresenter {
    #model;
    #view;

    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
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
    async updateCover(id, image) {
        this.#view.loading.value = true;
        try {
            const formData = new FormData();
            formData.append('cover', image);
            const res = await this.#model.updateCoverProfile(id, formData);
            alert(res.message);
        } catch (err) {
            console.error(err);
        } finally {
            this.#view.loading.value = false;
        }
    }
}