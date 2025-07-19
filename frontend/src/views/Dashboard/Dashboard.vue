<script setup>
import { ArrowLeft, EllipsisVertical, Heart, MessageCircle, Plus, Share2, Camera, Trash2 } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import DashboardPresenter from '../../presenters/DashboardPresenter';
import data from '../../models/data';
import { onMounted, reactive, ref } from 'vue';

const voice = new Audio('/vioce/doraemon_mamikos.mp3');
const postings = ref([]);
const refImage = ref();
const state = reactive({
    user: null,
    loading: false,
    showLoadingPosting: false,
    progress: 0,
    showCreatePosting: false,
    content: '',
    previewImages: [],
    images: []
});
const presenter = new DashboardPresenter({
    model: new data(),
    view: {
        postings: (value) => postings.value = value,
        loading: (value) => state.loading = value,
        user: (value) => state.user = value,
        showLoadingPosting: (value) => state.showLoadingPosting = value,
        showCreatePosting: (value) => state.showCreatePosting = value,
        progress: (value) => state.progress = value,
        images: (value) => state.images.push(value),
        previewImages: (value) => state.previewImages.push(value)
    }
});
function handleChangeImage(e) {
    presenter.handleChangeImages(e.target.files);
}
function handleDeleteImage(index) {
    state.previewImages = state.previewImages.filter((va, ind) => index !== ind);
    state.images = state.images.filter((va, ind) => index !== ind);
}
function isLike(likes) {
    return presenter.isLike(likes, state.user);
}
function createPosting() {
    presenter.createPosting(state.content, state.images);
}
function parseContent(content) {
    const newContent = content.split(/(#\w+)/g);
    console.log(newContent);
    return newContent;
}
function likePosting(id) {
    presenter.handleActionsLike(id, postings.value, state.user?.user_id);
}
onMounted(() => {
    presenter.getPostings();
    presenter.getUser();
});
</script>
<template>
    <div class="flex justify-center p-3" v-if="state.showCreatePosting">
        <div class="w-2xl p-5 rounded-md bg-gray-100">
            <div class="flex items-center px-2 py-4">
                <button @click="() => state.showCreatePosting = false">
                    <ArrowLeft class="w-6 h-6" />
                </button>
                <h2 class="w-full text-center text-2xl font-bold">Create Story</h2>
            </div>
            <form @submit.prevent="createPosting">
                <div class="p-2">
                    <textarea name="content" id="content" v-model="state.content"
                        class="px-2 p-1 w-full h-50 border-1 border-gray-400 rounded-md focus:outline focus:outline-orange-500"></textarea>
                    <span class="text-xs text-gray-700">Ceritakan semua yang ingin anda ceritakan</span>
                </div>
                <div class="flex items-center flex-wrap gap-2 p-2">
                    <div class="group relative w-20 h-20" v-for="(image, index) in state.previewImages"
                        @click="handleDeleteImage(index)" :key="index">
                        <img :src="image" alt="preview image"
                            class="absolute left-0 top-0 w-full h-full rounded-md group-hover:brightness-80 border-1 border-gray-400">
                        <div class="absolute hidden group-hover:flex items-center justify-center h-full w-full">
                            <Trash2 class="w-5 h-5 text-gray-100" />
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <input type="file" name="image" id="image" ref="refImage" @change="handleChangeImage" multiple
                        hidden>
                    <button type="button" @click="() => refImage.click()"
                        class="flex items-center justify-center gap-1 w-60 border-1 border-orange-500 rounded-md p-2">
                        <Camera class="w-5 h-5" /> Gambar
                    </button>
                    <button type="submit"
                        class="p-2 w-full border-1 border-gray-100 bg-orange-400 rounded-md text-gray-100">Create
                        Posting</button>
                </div>
            </form>
        </div>
    </div>
    <div class="w-2xl p-2" v-else>
        <button @click="() => state.showCreatePosting = true" class="flex items-center w-full text-start gap-2">
            <div class="w-full p-2">
                <h2 class="text-xl font-semibold">Buat Postingan</h2>
                <p class="text-xs text-gray-800">ceritakan pengalamanmu yang berharga</p>
            </div>
            <div class="p-2 rounded-full text-center bg-orange-600">
                <Plus class="w-6 h-6 text-gray-100 fill-gray-100" />
            </div>
        </button>
        <div v-if="state.loadingCreatePosting" class="flex items-center gap-3">
            <img src="/images/tuanCrabs.jpeg" alt="" class="w-10 h-10 rounded-full object-cover">
            <div class="w-full">
                <div class="font-semibold pb-1">Upload</div>
                <div class="h-[6px] bg-gray-600 rounded-full">
                    <div class="h-full bg-orange-600 rounded-full" :class="`w-[${parseInt(state.progress)}%]`"></div>
                </div>
            </div>
        </div>
        <div v-for="(posting, index) in postings" :key="posting?.posting_id" class="px-2">
            <div class="flex items-center gap-3 p-2" :class="[index === 0 ? 'border-t-1 border-gray-600' : '']">
                <div class="w-10 h-10 shrink-0">
                    <img src="/images/tuanCrabs.jpeg" alt="" class="w-full h-full object-cover rounded-full border-1">
                </div>
                <div class="w-full">
                    <h2 class="text-lg font-semibold">{{ posting?.user.profile?.name }}</h2>
                    <p class="text-sm text-gray-600">{{ posting?.user.username }}</p>
                </div>
                <button>
                    <EllipsisVertical class="w-6 h-6" />
                </button>
            </div>
            <div class="w-full">
                <p class="text-gray-800 py-2">
                    <span v-for="content in parseContent(posting?.content)">
                        <RouterLink :to="`/search/${content.slice(1)}`" v-if="content.startsWith('#')"
                            class="text-blue-600 hover:underline">{{ content }}</RouterLink>
                        <span v-else>{{ content }}</span>
                    </span>
                </p>
                <!-- untuk gambar kurang dari 2 -->
                <div v-if="posting?.images.length < 1" class="flex flex-wrap justify-around items-center">
                    <div class="flex items-center w-200 h-200 bg-black">
                        <img v-for="image in posting.images" :src="image.image" :key="image.image_id"
                            alt="image posting" class="w-full h-auto object-cover border-1">
                    </div>
                </div>
                <!-- untuk gambar 2 -->
                <div v-if="posting?.images.length < 3" class="flex flex-wrap justify-center items-center">
                    <div class="grid grid-cols-2 w-200 h-200 bg-black">
                        <img v-for="image in posting.images" :src="image.image" :key="image.image_id"
                            alt="image posting" class="w-full h-full object-cover border-1">
                    </div>
                </div>
                <!-- untuk gambar lebih dari 2 -->
                <div v-if="posting?.images.length > 2" class="flex items-center justify-center">
                    <div class="grid grid-cols-3 grid-rows-2 w-200 bg-black h-150">
                        <img v-for="(image, indexImage) in posting.images.slice(0, 3)" :key="image.image_id"
                            :src="image.image" alt="image posting" class="h-full object-cover"
                            :class="[indexImage === 0 ? 'col-span-2 row-span-1 row-span-2' : '']">
                    </div>
                </div>
                <div class="flex items-center gap-2 text-sm">
                    <button>{{ posting?.likes?.length }} likes</button>
                    <button>{{ posting?.comments.length }} comments</button>
                    <button>111 shares</button>
                </div>
                <div class="flex items-center py-2 border-b-1 border-gray-600">
                    <button @click="likePosting(posting?.posting_id)" class="p-2 cursor-pointer">
                        <Heart class="w-6 h-6"
                            :class="[isLike(posting?.likes) ? 'fill-orange-600 text-orange-600' : 'text-gray-800']" />
                    </button>
                    <RouterLink :to="`/comments/${posting?.posting_id}`" class="p-2">
                        <MessageCircle class="w-6 h-6 text-gray-800" />
                    </RouterLink>
                    <button class="p-2">
                        <Share2 class="w-6 h-6 text-gray-800" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>