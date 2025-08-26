import { defineStore } from "pinia";
import data from "../models/data";
import { nanoid } from "nanoid";

const api = new data();

export const useDashboardStore = defineStore('post', {
    state: () => ({
        posts: [],
        fetched: false,
        loading: false,
        hasMore: true,
        limit: 5,
        postings: [],
        images: [],
        previewImages: [],
        content: '',
        user: {},
        showCreatePosting: false,
        showLoadingPosting: false
    }),
    actions: {
        async getPostings() {
            if (!this.hasMore) return;
            try {
                const offset = this.postings.length;
                const res = await api.getPostings(offset, this.limit);
                if (res.data.length < this.limit) {
                    this.hasMore = false;
                }
                res.data.map(data => {
                    const showSetting = false;
                    const showShare = false;
                    const share = false;
                    const icon_share = false;
                    return {
                        showSetting,
                        showShare,
                        share,
                        icon_share,
                        ...data
                    }
                });
                this.postings = [...this.postings, ...res.data];
                console.log(this.postings);
            } catch (err) {
                console.error(err);
            }

            return this.postings;
        },
        handleClick(e, itemsRef, itemsRefShare) {
            this.postings.forEach((post, index) => {
                const elRef = itemsRef.value[post.posting_id];
                const elRefShare = itemsRefShare.value[post.posting_id];
                if (elRef && !elRef.contains(e.target)) {
                    this.postings[index].showSetting = false;
                }
                if (elRefShare && !elRefShare.contains(e.target)) {
                    this.postings[index].showShare = false;
                }
            })
        },
        handleUpdateShow(index) {
            this.postings[index].showSetting = !this.postings[index].showSetting;
        },
        handleUpdateShowShare(index) {
            this.postings[index].showShare = !this.postings[index].showShare;
        },
        handleDeleteImage(index) {
            this.previewImages = this.previewImages.filter((va, ind) => index !== ind);
            this.images = this.images.filter((va, ind) => index !== ind);
        },
        handleChangeImages(files) {
            Array.from(files).map(image => {
                this.images.push(image);
                const blobImage = URL.createObjectURL(image);
                this.previewImages.push(blobImage);
            })
        },
        async createPosting() {
            this.showCreatePosting = false;
            this.showLoadingPosting = true;
            try {
                const res = await api.createPosting(this.content);
                console.log(res.data);
                const formData = new FormData();
                this.images.map(image => {
                    formData.append("images", image);
                });
                formData.append("posting_id", res.data.posting_id);
                const image = await api.createImagesPosting(formData);
                console.log(image);
                this.images = [];
                this.previewImages = [];
                this.getPostings();
            } catch (err) {
                console.error(err);
            } finally {
                this.showLoadingPosting = false;
            }
        },
        async getUser() {
            try {
                const res = await api.getUser();
                this.user = res.data;
                console.log(res);
            } catch (err) {
                console.error(err);
            }
        },
        async createLike(posting_id, id) {
            try {
                const res = await api.createLike(posting_id, id);
                console.log(res);
            } catch (err) {
                console.error(err);
            }
        },
        async deleteLike(id) {
            try {
                await api.deleteLikePosting(id);
            } catch (err) {
                console.error(err);
            }
        },
        async handleActionsLike(posting, user_id_posting, socket) {
            const findIndex = this.postings.findIndex(value => value.posting_id === posting.posting_id);
            if (!this.postings[findIndex].is_like) {
                const id = nanoid();
                this.postings[findIndex].is_like = true;
                this.postings[findIndex].total_likes = this.postings[findIndex].total_likes + 1;
                this.postings[findIndex].like = {
                    id: id,
                    user_id: this.user.user_id,
                    posting_id: posting.posting_id
                };
                console.log(this.postings);
                const message = "menyukai postingan anda";
                const verb = "like";
                const id_notif = nanoid();
                socket.emit("notifications", (
                    {
                        id: id_notif,
                        receiver_id: this.user.user_id,
                        actor_id: user_id_posting,
                        object_id: posting.posting_id,
                        data: posting,
                        verb: verb,
                        message: message,
                        user: this.user
                    }
                ));
                await this.createLike(posting.posting_id, id);
            } else {
                this.postings[findIndex].is_like = false;
                const { id } = this.postings[findIndex].like;
                this.postings[findIndex].total_likes = this.postings[findIndex].total_likes - 1;
                await this.deleteLike(id);
            }
        },
        async createShare(posting_id) {
            try {
                const findIndex = this.postings.findIndex(posting => posting.posting_id === posting_id);
                if (findIndex > -1) {
                    await navigator.clipboard.writeText(`${window.location.href}posting/${posting_id}`);
                    this.postings[findIndex].icon_share = true;
                    if (!this.postings[findIndex].share) {
                        this.postings[findIndex].total_shares = this.postings[findIndex].total_shares + 1;
                        const id = nanoid();
                        const res = await api.createShare(id, posting_id);
                        console.log(res);
                    }
                    setTimeout(() => {
                        this.postings[findIndex].icon_share = false;
                    }, 3000);
                    this.postings[findIndex].share = true;
                }
            } catch (err) {
                console.error(err);
            }
        }
    }
})