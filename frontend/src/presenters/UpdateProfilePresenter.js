export default class UpdateProfilePresenter {
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
        } catch (err) {
            console.error(err);
        }
    }
    async updateProfile(data, image) {
        this.#view.loading.value = true;
        try {
            if (image) {
                const formData = new FormData();
                formData.append("profile_picture", image);
                const res = await this.#model.updateProfilePicture(formData);
                console.log(res);
            }
            const res = await this.#model.updateProfile(data);
            console.log(res);
            this.#view.router.push(`/profile/${data.username}`);
        } catch (err) {
            console.error(err);
        } finally {
            this.#view.loading.value = false;
        }
    }
}