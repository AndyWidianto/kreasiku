<script setup>
import { ArrowLeft, EllipsisVertical, Heart, MessageCircle, Plus, Share2, Camera, Trash2, Flag, Images, Paperclip, Check } from 'lucide-vue-next';
import { RouterLink, useRoute } from 'vue-router';
import { inject, nextTick, onMounted, reactive, ref, watch } from 'vue';
import Loading from '../components/loadings/Loading.vue';
import { useDashboardStore } from '../../stores/dashboardStore';
import ShowImagePage from './ShowImagePage.vue';


const route = useRoute();
const socket = inject("socket");
const refImage = ref();
const loadMore = ref(null);
const itemsRef = ref({});
const itemsRefShare = ref({});
const posting = ref(null);
const startImage = ref(0);
const showImage = ref(false);
const origin = ref("center center");

const dashboardStore = useDashboardStore();
function handleChangeImage(e) {
    dashboardStore.handleChangeImages(e.target.files);
}
function handleDeleteImage(index) {
    dashboardStore.handleDeleteImage(index);
}
function likePosting(posting, id_user_posting) {
    dashboardStore.handleActionsLike(posting, id_user_posting, socket);
}
function createPosting() {
    dashboardStore.createPosting();
}
function parseContent(content) {
    const newContent = content.split(/(#\w+)/g);
    return newContent;
}
function handleParseDate(value) {
    const date = new Date(value);
    const newDate = new Date();
    const ms = newDate.getTime() - date.getTime();
    const seconds = ms / (1000 * 60);
    const hours = ms / (1000 * 60 * 60);
    const days = ms / (1000 * 60 * 60 * 24);
    if (seconds < 60) {
        return `${parseInt(seconds)} detik`;
    }
    else if (hours < 24) {
        return `${parseInt(hours)} jam`;
    }
    else if (days < 30) {
        return `${parseInt(days)} hari`;
    }
    return `30+ hari`;
}
function SetItemRef(el, id) {
    if (el) {
        itemsRef.value[id] = el;
    }
}
function SetItemRefShare(el, id) {
    if (el) {
        itemsRefShare.value[id] = el;
    }
}
function handleClick(e) {
    dashboardStore.handleClick(e, itemsRef, itemsRefShare);
}
function handleUpdateShow(index) {
    dashboardStore.handleUpdateShow(index);
}
function handleUpdateShowShare(index) {
    dashboardStore.handleUpdateShowShare(index);
}
function handleShowImages(e, index, indexImage) {
    showImage.value = true;
    startImage.value = indexImage;
    posting.value = dashboardStore.postings[index];
    origin.value = `${e.clientX}px ${e.clientY}px`;
}
function handleDestroyShowImages() {
    showImage.value = false;
    startImage.value = null;
    posting.value = null;
}

let observer = null;
onMounted(async () => {
    const token = route.query.token;
    if (token) {
        localStorage.setItem("kreasiku", token);
    }
    await dashboardStore.getUser();
    await dashboardStore.getPostings();
    observer = new IntersectionObserver((enteries) => {
        enteries.forEach(entry => {
            if (entry.isIntersecting) {
                dashboardStore.getPostings();
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
    <Transition name="zoom">
        <ShowImagePage v-if="showImage" :transformOrigin="origin" :start="startImage" :images="posting.images"
            :Name="posting.user.username" :goBack="handleDestroyShowImages" />
    </Transition>
    <div class="flex justify-center w-full p-3" v-if="dashboardStore.showCreatePosting">
        <div class="w-full lg:w-2xl lg:p-5 rounded-md">
            <div class="flex items-center px-2 py-4">
                <button @click="() => dashboardStore.showCreatePosting = false">
                    <ArrowLeft class="w-6 h-6" />
                </button>
                <h2 class="w-full text-center text-2xl font-bold">Create Story</h2>
            </div>
            <form @submit.prevent="createPosting">
                <div class="p-2">
                    <textarea name="content" id="content" v-model="dashboardStore.content"
                        class="px-2 p-1 w-full h-50 border-1 border-gray-400 rounded-md focus:outline focus:outline-orange-500"></textarea>
                    <span class="text-xs text-gray-700">Ceritakan semua yang ingin anda ceritakan</span>
                </div>
                <div class="flex items-center flex-wrap gap-2 p-2">
                    <div class="group relative w-20 h-20" v-for="(image, index) in dashboardStore.previewImages"
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
    <div class="w-full lg:w-2xl px-0 md:px-2" v-show="!dashboardStore.showCreatePosting">
        <button @click="() => dashboardStore.showCreatePosting = true"
            class="flex items-center w-full text-start gap-2">
            <div class="w-full p-2">
                <h2 class="text-xl font-semibold">Upload posting</h2>
                <p class="text-xs text-gray-800">ceritakan pengalamanmu yang berharga</p>
            </div>
            <div class="p-2 mx-2 md:mx-0 rounded-full text-center bg-orange-600">
                <Plus class="w-6 h-6 text-gray-100 fill-gray-100" />
            </div>
        </button>
        <div v-for="(posting, index) in dashboardStore.postings" :key="posting?.posting_id" class="px-0 md:px-2">
            <div class="flex items-center p-2" :class="[index === 0 ? 'border-t-1 border-gray-600' : '']">
                <RouterLink :to="`/profile/${posting?.user.username}`" class="flex items-center gap-2 w-full">
                    <div class="w-10 h-10 shrink-0">
                        <img :src="posting?.user.profile.profile_picture ? posting?.user.profile.profile_picture : '/images/foto_default.jpg'"
                            alt="" class="w-full h-full object-cover rounded-full border-1">
                    </div>
                    <div class="w-full">
                        <h2 class="text-lg font-semibold">{{ posting?.user.profile?.name }}<span
                                class="mx-1 text-xs font-semibold text-gray-500">{{ handleParseDate(posting.updatedAt)
                                }}</span></h2>
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
                            <button class="flex items-center text-red-500 gap-1 p-1 w-full text">
                                <Trash2 class="w-4 h-4" />
                                Delete
                            </button>
                        </li>
                        <li class="w-full" v-if="!posting.mine">
                            <button class="flex items-center gap-1 p-1 text">
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
                        <div v-for="(image, indexImage) in posting.images" class="w-full max-h-150"
                            :key="image.image_id">
                            <img :src="image.image" @click="(e) => handleShowImages(e, index, indexImage)"
                                alt="image posting" class="block w-full max-h-150 object-cover">
                        </div>
                    </div>
                </div>
                <!-- untuk gambar 2 -->
                <div v-if="posting?.images.length < 3 && posting?.images.length > 1"
                    class="flex flex-wrap justify-center items-center">
                    <div class="grid grid-cols-2 gap-[1px] w-full max-h-150">
                        <div v-for="(image, indexImage) in posting.images" class="w-full h-full" :key="image.image_id">
                            <img :src="image.image" :key="image.image_id" alt="image posting"
                                @click="(e) => handleShowImages(e, index, indexImage)"
                                class="block w-full h-full object-cover">
                        </div>
                    </div>
                </div>
                <!-- untuk gambar lebih dari 2 -->
                <div v-if="posting?.images.length > 2" class="flex flex-col items-center justify-center">
                    <div class="grid grid-cols-3 gap-1 grid-rows-2 w-full max-h-150">
                        <div v-for="(image, indexImage) in posting.images.slice(0, 3)" class="h-full w-full elative"
                            :class="[indexImage === 0 ? 'col-span-2 row-span-1 row-span-2' : '']" :key="image.image_id">
                            <img :src="image.image" alt="image posting" class="block h-full w-full object-cover"
                                @click="(e) => handleShowImages(e, index, indexImage)">
                        </div>
                    </div>
                    <div v-if="posting?.images.length - 3 !== 0" class="font-semibold text-sm">{{ posting.images.length - 3 }} gambar lainnya</div>
                </div>
                <div class="px-1 md:px-0 flex items-center gap-2 text-sm">
                    <button>{{ posting?.total_likes }} likes</button>
                    <button>{{ posting.total_comments + posting.total_mentions }} comments</button>
                    <button>{{ posting?.total_shares }} shares</button>
                </div>
                <div class="flex items-center py-2 border-b-1 border-gray-600">
                    <button @click="likePosting(posting, posting?.user.user_id)" class="p-2 cursor-pointer">
                        <Heart class="w-6 h-6"
                            :class="[posting.is_like ? 'fill-orange-600 text-orange-600' : 'text-gray-800']" />
                    </button>
                    <RouterLink :to="`/posting/${posting?.posting_id}`" class="p-2">
                        <MessageCircle class="w-6 h-6 text-gray-800" />
                    </RouterLink>
                    <div :ref="(el) => SetItemRefShare(el, posting?.posting_id)"
                        class="flex flex-col items-center relative">
                        <div v-if="posting.showShare" class="flex flex-col items-center absolute bottom-5">
                            <div class="p-1 rounded-md bg-white p-2">
                                <ul class="flex items-center gap-4">
                                    <li>
                                        <button @click="dashboardStore.createShare(posting?.posting_id)">
                                            <Paperclip v-if="!posting.icon_share" class="w-4 h-4 text-gray-600" />
                                            <Check v-else class="w-4 h-4 text-orange-500" />
                                        </button>
                                    </li>
                                    <li>
                                        <svg role="img" width="15" height="15" fill="#25D366" viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <title>WhatsApp</title>
                                            <path
                                                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                    </li>
                                </ul>
                            </div>
                            <div
                                class="w-0 border-15 border-l-transparent border-r-transparent border-b-transparent border-white">
                            </div>
                        </div>
                        <button @click="handleUpdateShowShare(index)" class="p-2">
                            <Share2 class="w-6 h-6 text-gray-800" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-center text-orange-500" ref="loadMore" v-if="dashboardStore.hasMore">
            <Loading :size="9" :borderSize="4" />
        </div>
        <div class="text-center" v-else-if="!dashboardStore.hasMore">no more data</div>
    </div>
</template>
<style>
.zoom-enter-active,
.zoom-leave-active {
    transition: transform 200ms ease-in;
}

.zoom-enter-from,
.zoom-leave-to {
    transform: scale(0.9);
    opacity: 0;
}
</style>