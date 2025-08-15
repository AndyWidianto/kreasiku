<script setup>
import { ArrowLeft, EllipsisVertical, Heart, MessageCircle, Plus, Share2, Camera, Trash2, Flag } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import DashboardPresenter from '../../presenters/DashboardPresenter';
import data from '../../models/data';
import { inject, nextTick, onMounted, reactive, ref, watch } from 'vue';
import Loading from '../components/loadings/Loading.vue';

const cachePostings = sessionStorage.getItem("postings");
const cachePage = sessionStorage.getItem("postings");
const socket = inject("socket");
const postings = ref(cachePostings ? JSON.parse(cachePostings) : []);
const refImage = ref();
const page = ref(cachePage ? cachePage : 1);
const limit = 5;
const loadMore = ref(null);
const hasMore = ref(true);
const user = ref();
const loading = ref(false);
const showLoadingPosting = ref(false);
const progress = ref(0);
const showCreatePosting = ref(false);
const content = ref('');
const itemsRef = ref({});
const indexPostings = ref({});
const state = reactive({
    previewImages: [],
    images: []
});
const presenter = new DashboardPresenter({
    model: new data(),
    view: {
        postings: postings,
        loading: loading,
        user: user,
        showLoadingPosting: showLoadingPosting,
        showCreatePosting: showCreatePosting,
        progress: progress,
        images: state.images,
        previewImages: state.previewImages,
        hasMore: hasMore,
        page: page,
        indexPostings: indexPostings
    }
});
function handleChangeImage(e) {
    presenter.handleChangeImages(e.target.files);
}
function handleDeleteImage(index) {
    state.previewImages = state.previewImages.filter((va, ind) => index !== ind);
    state.images = state.images.filter((va, ind) => index !== ind);
}
function likePosting(posting, id_user_posting) {
    presenter.handleActionsLike(posting, postings.value, user.value, id_user_posting, socket);
}
function createPosting() {
    presenter.createPosting(content, state.images);
}
function parseContent(content) {
    const newContent = content.split(/(#\w+)/g);
    return newContent;
}
function SetItemRef(el, id) {
    if (el) {
        itemsRef.value[id] = el;
    }
}
function handleClick(e) {
    postings.value.forEach((post, index) => {
        const elRef = itemsRef.value[post.posting_id];
        if (elRef && !elRef.contains(e.target)) {
            postings.value[index].showSetting = false;
        }
    })
}
function handleUpdateShow(index) {
    postings.value[index].showSetting = !postings.value[index].showSetting;
}
let observer = null;
onMounted(async () => {
    await presenter.getPostings(limit, page.value, postings.value, hasMore.value);
    await presenter.getUser();
    observer = new IntersectionObserver((enteries) => {
        enteries.forEach(entry => {
            if (entry.isIntersecting) {
                presenter.getPostings(limit, page.value, postings.value, hasMore.value);
            }
        })
    });
    if (loadMore.value) {
        observer.observe(loadMore.value);
    }
    await nextTick();
    window.addEventListener('click', handleClick);
});
</script>
<template>
    <div class="flex justify-center p-3" v-if="showCreatePosting">
        <div class="w-full lg:w-2xl lg:p-5 rounded-md bg-gray-100">
            <div class="flex items-center px-2 py-4">
                <button @click="() => showCreatePosting = false">
                    <ArrowLeft class="w-6 h-6" />
                </button>
                <h2 class="w-full text-center text-2xl font-bold">Create Story</h2>
            </div>
            <form @submit.prevent="createPosting">
                <div class="p-2">
                    <textarea name="content" id="content" v-model="content"
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
                        class="p-2 w-full border-1 border-gray-100 bg-orange-400 rounded-md text-gray-100">
                        CreatePosting
                    </button>
                </div>
            </form>
        </div>
    </div>
    <div class="w-full lg:w-2xl px-0 md:px-2" v-else>
        <button @click="() => showCreatePosting = true" class="flex items-center w-full text-start gap-2">
            <div class="w-full p-2">
                <h2 class="text-xl font-semibold">Upload posting</h2>
                <p class="text-xs text-gray-800">ceritakan pengalamanmu yang berharga</p>
            </div>
            <div class="p-2 mx-2 md:mx-0 rounded-full text-center bg-orange-600">
                <Plus class="w-6 h-6 text-gray-100 fill-gray-100" />
            </div>
        </button>
        <div v-for="(posting, index) in postings" :key="posting?.posting_id" class="px-0 md:px-2">
            <div class="flex items-center p-2" :class="[index === 0 ? 'border-t-1 border-gray-600' : '']">
                <RouterLink :to="`/profile/${posting?.user.username}`" class="flex items-center gap-2 w-full">
                    <div class="w-10 h-10 shrink-0">
                        <img :src="posting?.user.profile.profile_picture ? posting?.user.profile.profile_picture : '/images/book.jpg'"
                            alt="" class="w-full h-full object-cover rounded-full border-1">
                    </div>
                    <div class="w-full">
                        <h2 class="text-lg font-semibold">{{ posting?.user.profile?.name }}</h2>
                        <p class="text-sm text-gray-600">{{ posting?.user.username }}</p>
                    </div>
                </RouterLink>
                <div class="relative" :ref="el => SetItemRef(el, posting.posting_id)">
                    <button @click="handleUpdateShow(index)">
                        <EllipsisVertical class="w-6 h-6" />
                    </button>
                    <ul class="absolute right-0 w-30 bg-white border border-gray-100"
                        :class="[posting.showSetting ? 'block' : 'hidden']">
                        <li class="w-full" v-if="posting.mine">
                            <button class="flex items-center gap-1 bg-red-100 p-2 w-full font-semibold text">
                                <Trash2 class="w-4 h-4" />
                                Delete
                            </button>
                        </li>
                        <li class="w-full" v-if="!posting.mine">
                            <button class="flex items-center gap-1 p-2 font-semibold text">
                                <Flag class="w-4 h-4 text-gray-600" />
                                Laporkan
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="w-full">
                <p class="text-gray-800 py-2 px-1 md:px-0">
                    <span v-for="content in parseContent(posting?.content)">
                        <RouterLink :to="`/search/${content.slice(1)}`" v-if="content.startsWith('#')"
                            class="text-blue-600 hover:underline">{{ content }}</RouterLink>
                        <span v-else>{{ content }}</span>
                    </span>
                </p>
                <!-- untuk gambar kurang dari 2 -->
                <div v-if="posting?.images.length == 1" class="flex flex-wrap justify-around items-center">
                    <div class="flex items-center w-full bg-black">
                        <img v-for="image in posting.images" :src="image.image" :key="image.image_id"
                            alt="image posting" class="w-full max-h-150 object-cover">
                    </div>
                </div>
                <!-- untuk gambar 2 -->
                <div v-if="posting?.images.length < 3 && posting?.images.length > 1"
                    class="flex flex-wrap justify-center items-center">
                    <div class="grid grid-cols-2 gap-[1px] w-full max-h-150">
                        <img v-for="image in posting.images" :src="image.image" :key="image.image_id"
                            @click="handleShowImage(posting.images, image.image_id)" alt="image posting"
                            class="w-full h-full object-cover">
                    </div>
                </div>
                <!-- untuk gambar lebih dari 2 -->
                <div v-if="posting?.images.length > 2" class="flex items-center justify-center">
                    <div class="grid grid-cols-3 gap-1 grid-rows-2 w-full max-h-150">
                        <img v-for="(image, indexImage) in posting.images.slice(0, 3)" :key="image.image_id"
                            @click="handleShowImage(posting.images, image.image_id)" :src="image.image"
                            alt="image posting" class="h-full w-full object-cover"
                            :class="[indexImage === 0 ? 'col-span-2 row-span-1 row-span-2' : '']">
                    </div>
                </div>
                <div class="px-1 md:px-0 flex items-center gap-2 text-sm">
                    <button>{{ posting?.likes?.length }} likes</button>
                    <button>{{ posting.total_comments + posting.total_mentions }} comments</button>
                    <button>111 shares</button>
                </div>
                <div class="flex items-center py-2 border-b-1 border-gray-600">
                    <button @click="likePosting(posting, posting?.user.user_id)" class="p-2 cursor-pointer">
                        <Heart class="w-6 h-6"
                            :class="[posting.is_like ? 'fill-orange-600 text-orange-600' : 'text-gray-800']" />
                    </button>
                    <RouterLink :to="`/posting/${posting?.posting_id}`" class="p-2">
                        <MessageCircle class="w-6 h-6 text-gray-800" />
                    </RouterLink>
                    <button class="p-2">
                        <Share2 class="w-6 h-6 text-gray-800" />
                    </button>
                </div>
            </div>
        </div>
        <div class="flex justify-center" ref="loadMore" v-if="hasMore">
            <Loading :size="9" :borderSize="4" />
        </div>
        <div class="text-center" v-else-if="!hasMore">no more data</div>
    </div>
</template>