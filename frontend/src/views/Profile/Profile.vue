<script setup>
import { onMounted, ref, watch } from 'vue';
import { Check, CheckCheck, Copy, Edit2, EllipsisVertical, Heart, MessageCircle, Share, Share2 } from 'lucide-vue-next';
import { routerKey, RouterLink, useRoute, useRouter } from 'vue-router';
import ProfilePresenter from '../../presenters/ProfilePresenter';
import data from '../../models/data';
import Loading from '../components/loadings/Loading.vue';
import ShowImagePage from '../Dashboard/ShowImagePage.vue';
import { useConverstationStore } from '../../stores/converstationStore';

const route = useRoute();
const router = useRouter();
const { username } = route.params;
const user = ref(null);
const postings = ref([]);
const loading = ref(false);
const copy = ref(false);
const showImages = ref(false);
const images = ref({});
const name = ref('');
const startImage = ref(0);

const converstationStore = useConverstationStore();
const presenter = new ProfilePresenter({
    model: new data(),
    view: {
        user: user,
        postings: postings,
        loading: loading,
        router: router
    }
});
function likePosting(id) {
    presenter.handleActionsLike(id, postings.value, user.value?.user_id);
}
function parseContent(content) {
    const newContent = content.split(/(#\w+)/g);
    return newContent;
}
function handleUpdateProfile() {
    router.push('/update/profile');
}
function Follow() {
    presenter.createFollow(user.value.user_id, user.value);
}
function unFollow() {
    presenter.deleteFollow(user.value.user_id, user.value);
}
async function handleCopyUrl() {
    try {
        await navigator.clipboard.writeText(window.location.href);
        console.log("Berhasil di salin");
        copy.value = true;
        setTimeout(() => {
            copy.value = false;
        }, 4000);
    } catch (err) {
        console.log("Gagal menyalin")
    }
}
function handleShowImages(index, indexImage) {
    images.value = postings.value[index].images;
    console.log(postings.value[index]);
    name.value = user.value.profile.name;
    startImage.value = indexImage;
    showImages.value = true;
}
function handleDestroyShowImages() {
    images.value = [];
    showImages.value = false;
    name.value = '';
    startImage.value = 0;
}
function handleToMessages() {
    router.push(`/chat?name=${user.value.username}`);
}
onMounted(() => {
    presenter.getUser(username);
});
watch(() => route.params.username, (newUsername) => {
    presenter.getUser(newUsername);
})
</script>
<template>
    <Loading v-if="loading" :size="8" :borderSize="3" />
    <ShowImagePage v-if="showImages" :images="images" :start="startImage" :goBack="handleDestroyShowImages" :Name="name" />
    <div v-show="!loading" class="md:px-5 lg:px-30 w-full">
        <div class="flex w-full pb-5 md:pb-0 relative z-5">
            <div class="flex w-full relative right-0">
                <img :src="user?.profile.cover_picture ? user?.profile.cover_picture : '/images/book.jpg'" alt=""
                    class="w-full h-30 md:h-50 object-cover z-5">
                <RouterLink to="/edit/cover"
                    class="flex items-center absolute bg-gray-100 rounded-md bottom-0 right-0 text-gray-800 active:bg-gray-200 text-sm px-2 py-1 z-10 m-1">
                    <Edit2 class="w-4 h-4" />edit
                </RouterLink>
            </div>
            <img :src="user?.profile.profile_picture || '/images/foto_default.jpg'" alt="profile"
                class="w-15 h-15 md:w-25 md:h-25 object-cover rounded-full border-2 md:border-4 border-gray-100 absolute bottom-0 z-10">
        </div>
        <div class="pb-4 mb-1 border-b-1 border-gray-600">
            <div class="block sm:flex w-full p-2">
                <div class="w-full">
                    <h2 class="text-2xl font-bold">
                        {{ user?.profile.name }}
                    </h2>
                    <p class="text-gray-700">
                        {{ user?.profile.description }}
                    </p>
                </div>
                <div v-if="!user?.mine" class="flex justify-end items-center gap-4 p-2">
                    <button v-if="!user?.my_following" @click="Follow" class="py-1 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-sm">
                        {{ user?.user_follow_me ? 'Follback' : 'Follow' }}
                    </button>
                    <button v-else @click="unFollow" class="py-1 px-4 border border-gray-300 rounded-sm">Unfollow</button>
                    <button @click="handleToMessages" class="py-1 px-4 rounded-sm hover:bg-gray-200 border border-gray-300">Message</button>
                </div>
                <div v-else class="flex justify-end items-center p-2 text-gray-800">
                    <button @click="handleUpdateProfile" class="px-4 rounded-sm border hover:bg-gray-100">Edit</button>
                    <button @click="handleCopyUrl" class="px-2">
                        <Copy v-if="!copy" class="w-6 h-6" />
                        <CheckCheck v-else class="w-6 h-6 text-orange-500" />
                    </button>
                </div>
            </div>
            <div class="flex items-center md:justify-end gap-4 w-full font-semibold">
                <RouterLink :to="`/followers/${user?.username}`" class="flex flex-col items-center px-4 rounded-sm">
                    <p>Follower</p>
                    <div class="text-xs">{{ user?.total_follower }}</div>
                </RouterLink>
                <RouterLink :to="`/followings/${user?.username}`" class="flex flex-col items-center px-4 rounded-sm">
                    <p>Following</p>
                    <div class="text-xs">{{ user?.total_following }}</div>
                </RouterLink>
                <button class="px-4 rounded-sm">
                    <p>postingan</p>
                    <div class="text-xs">{{ user?.total_posting }}</div>
                </button>
            </div>
        </div>
        <div v-for="(posting, index) in postings" :key="posting?.posting_id" class="w-full">
            <div class="flex items-center gap-3 p-2">
                <div class="w-10 h-10 shrink-0">
                    <img :src="user?.profile.profile_picture || '/images/foto_default.jpg'" alt="profile" class="w-full h-full object-cover rounded-full border-1">
                </div>
                <div class="w-full">
                    <h2 class="text-lg font-semibold">{{ user?.profile?.name }}</h2>
                    <p class="text-sm text-gray-600">{{ user?.username }}</p>
                </div>
                <button>
                    <EllipsisVertical class="w-6 h-6" />
                </button>
            </div>
            <div class="w-full">
                <p class="px-2 md:px-0 text-gray-800 py-2">
                    <span v-for="content in parseContent(posting?.content)">
                        <RouterLink :to="`/search/${content.slice(1)}`" v-if="content.startsWith('#')"
                            class="text-blue-600 hover:underline">{{ content }}</RouterLink>
                        <span v-else>{{ content }}</span>
                    </span>
                </p>
                <!-- untuk gambar kurang dari 2 -->
                <div v-if="posting?.images.length == 1" class="flex flex-wrap justify-around items-center">
                    <div class="flex items-center w-full bg-black">
                        <img v-for="(image, indexImage) in posting.images" :src="image.image" :key="image.image_id" @click="handleShowImages(index, indexImage)"
                            alt="image posting" class="w-full max-h-150 object-cover">
                    </div>
                </div>
                <!-- untuk gambar 2 -->
                <div v-if="posting?.images.length < 3 && posting?.images.length > 1" class="flex flex-wrap justify-center items-center">
                    <div class="grid grid-cols-2 gap-[1px] w-full max-h-150">
                        <img v-for="(image, indexImage) in posting.images" :src="image.image" :key="image.image_id"  @click="handleShowImages(index, indexImage)"
                            alt="image posting" class="w-full h-full object-cover">
                    </div>
                </div>
                <!-- untuk gambar lebih dari 2 -->
                <div v-if="posting?.images.length > 2" class="flex items-center justify-center">
                    <div class="grid grid-cols-3 gap-1 grid-rows-2 w-full max-h-150">
                        <img v-for="(image, indexImage) in posting.images.slice(0, 3)" :key="image.image_id"  @click="handleShowImages(index, indexImage)"
                            :src="image.image" alt="image posting" class="h-full w-full object-cover"
                            :class="[indexImage === 0 ? 'col-span-2 row-span-1 row-span-2' : '']">
                    </div>
                </div>
                <div class="flex items-center gap-2 text-sm">
                    <button>{{ posting?.total_likes }} likes</button>
                    <button>{{ posting?.total_comments + posting?.total_mentions }} comments</button>
                    <button>{{ posting?.total_shares }} shares</button>
                </div>
                <div class="flex items-center py-2 border-b-1 border-gray-600">
                    <button @click="likePosting(posting?.posting_id)" class="p-2 cursor-pointer">
                        <Heart class="w-6 h-6"
                            :class="[posting?.is_like ? 'fill-orange-600 text-orange-600' : 'text-gray-800']" />
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
    </div>
</template>