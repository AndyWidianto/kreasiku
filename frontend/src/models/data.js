import { PublicApi, AuthApi } from "./index.js";

export default class data {

    token = localStorage.getItem('kreasiku');

    async Login(username, password) {
        const res = await PublicApi.post('/login', {
            username: username,
            password: password
        }, {
            withCredentials: true
        });
        return res.data;
    }
    async register(formData) {
        const res = await PublicApi.post('/register', formData, {
            withCredentials: true
        });
        return res.data;
    }
    async logout() {
        const res = await PublicApi.delete('/logout', {
            withCredentials: true
        });
        return res.data;
    }
    async getPostings(offset, limit) {
        const res = await PublicApi.get(`/postings?offset=${offset}&limit=${limit}`);
        return res.data;
    }
    async searchPostings(search) {
        const res = await PublicApi.get(`/postings?search=${search}`);
        return res.data;
    }
    async getPosting(id) {
        const res = await PublicApi.get(`/posting/${id}`);
        return res.data;
    }
    async getPostingsUser(id) {
        const res = await PublicApi.get(`/postings/user/${id}`);
        return res.data;
    }
    async createComment(posting_id, content) {
        const res = await AuthApi.post('/comment', {
            posting_id,
            content
        });
        return res.data;
    }
    async createPosting(content) {
        const res = await AuthApi.post('/posting', {
            content: content
        });
        return res.data;
    }
    async createImagesPosting(data) {
        const res = await AuthApi.post('/images/posting', data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return res.data;
    }
    async getLikes(id) {
        const res = await PublicApi.get(`/likes/${id}`);
        return res.data;
    }
    async createLike(id) {
        const res = await AuthApi.post('/like', {
            posting_id: id
        });
        return res.data;
    }
    async deleteLikePosting(id) {
        const res = await AuthApi.delete(`/likes/${id}`);
        return res.data;
    }
    async getUser() {
        const res = await AuthApi.get('/user');
        return res.data;
    }
    async getUsersFromUsername(username) {
        const res = await PublicApi.get(`/users?username=${username}`);
        return res.data;
    }
    async geNotifNotRead() {
        const res = await AuthApi.get('/notifications/read_false');
        return res.data;
    }
    async getNotifications() {
        const res = await AuthApi.get('/notifications');
        return res.data;
    }
    async CreateProfile(data) {
        console.log("data", data);
        const res = await AuthApi.post('/profile', data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return res.data;
    }
}