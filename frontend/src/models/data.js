import instance from ".";

export default class data {
    
    token = localStorage.getItem('kreasiku');

    async Login(username, password) {
        const res = await instance.post('/login', {
            username: username,
            password: password
        });
        return res.data;
    }
    async getPostings() {
        const res = await instance.get('/postings');
        return res.data;
    }
    async getPosting(id) {
        const res = await instance.get(`/posting/${id}`);
        return res.data;
    }
    async createComment(posting_id, content) {
        const res = await instance.post('/comment', {
            posting_id,
            content
        }, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        return res.data;
    }
    async createPosting(content) {
        const res = await instance.post('/posting', {
            content: content
        }, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        return res.data;
    }
    async createImagesPosting(data) {
        const res = await instance.post('/images/posting', data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return res.data;
    }
    async getLikes(id) {
        const res = await instance.get(`/likes/${id}`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        return res.data;
    }
    async createLike(id) {
        const res = await instance.post('/like', {
            posting_id: id
        }, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        return res.data;
    }
    async deleteLikePosting(id) {
        const res = await instance.delete(`/likes/${id}`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        return res.data;
    }
    async getUser() {
        const res = await instance.get('/user', {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        return res.data;
    }
    async getUsersFromUsername(username) {
        const res = await instance.get(`/users?username=${username}`);
        return res.data;
    }
    async geNotifNotRead() {
        const res = await instance.get('/notifications/read_false', {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        return res.data;
    }
    async getNotifications() {
        const res = await instance.get('/notifications', {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        return res.data;
    }
}