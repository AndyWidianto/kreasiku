
export default class SearchPresenter {
    #model;
    #view;
    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }

    async SearchPostings(search) {
        this.#view.loading(true);
        try {
            const res = await this.#model.searchPostings(search);
            console.log(res);
            this.#view.postings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            this.#view.loading(false);
        }
    }
}