<script setup>
import { onMounted, ref, watch } from 'vue';
import { Copy, Edit2, EllipsisVertical, Heart, MessageCircle, Share, Share2 } from 'lucide-vue-next';
import { RouterLink, useRoute } from 'vue-router';
import ProfilePresenter from '../../presenters/ProfilePresenter';
import data from '../../models/data';
import CreateCover from './CreateCover.vue';
import UpdateProfile from './UpdateProfile.vue';

const route = useRoute();
const { username } = route.params;
const user = ref(null);
const posting = ref();
const loading = ref(false);
const updateProfileActive = ref(false);
const presenter = new ProfilePresenter({
    model: new data(),
    view: {
        user: user,
        posting: posting,
        loading: loading
    }
});
function isLike(likes) {
    return presenter.isLike(likes, user.value);
}
function likePosting(id) {
    presenter.handleActionsLike(id, posting.value, user.value?.user_id);
}
function parseContent(content) {
    const newContent = content.split(/(#\w+)/g);
    console.log(newContent);
    return newContent;
}
function handleUpdateProfile() {
    updateProfileActive.value = !updateProfileActive.value;
}
onMounted(() => {
    presenter.getUser(username);
});
watch(() => route.params.username, (newUsername, oldUsername) => {
    if (newUsername !== oldUsername) {
        presenter.getUser(newUsername);
    }
})
</script>
<template>
    <UpdateProfile :user="user" :handleUpdateProfile="handleUpdateProfile" v-if="updateProfileActive" />
    <div v-else class="md:px-5 lg:px-30 w-full">
        <div class="flex w-full pb-5 md:pb-0 relative z-5">
            <div class="flex w-full border-1 relative right-0">
                <img :src="user?.profile.cover_picture ? user?.profile.cover_picture : '/images/book.jpg'" alt=""
                    class="w-full h-30 md:h-50 object-cover z-5">
                <RouterLink to="/edit/cover"
                    class="flex items-center absolute bg-gray-200 rounded-md bottom-0 right-0 text-gray-800 active:bg-gray-300 text-sm px-2 py-1 z-10">
                    <Edit2 class="w-4 h-4" />edit
                </RouterLink>
            </div>
            <img :src="user?.profile.profile_picture || '/images/book.jpg'" alt="profile"
                class="w-15 h-15 md:w-25 md:h-25 object-cover rounded-full border-2 md:border-4 border-gray-100 absolute bottom-0 z-10">
        </div>
        <div class="pb-4 mb-1 border-b-1 border-gray-600">
            <div class="flex w-full p-2">
                <div class="w-full">
                    <h2 class="text-2xl font-bold">
                        {{ user?.profile.name }}
                    </h2>
                    <p class="text-gray-700">
                        {{ user?.profile.description }}
                    </p>
                </div>
                <div v-if="!user?.mine" class="flex items-center gap-4 p-2">
                    <button class="py-1 px-4 rounded-sm border">Follow</button>
                    <button class="py-1 px-4 rounded-sm border">Message</button>
                </div>
                <div v-else class="flex items-center p-2 text-gray-800">
                    <button @click="handleUpdateProfile" class="px-4 rounded-sm border hover:bg-gray-100">Edit</button>
                    <button class="px-2"><Copy class="w-6 h-6" /> </button>
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
        <div v-for="posting in posting" :key="posting?.posting_id" class="w-full">
            <div class="flex items-center gap-3 p-2">
                <div class="w-10 h-10 shrink-0">
                    <img src="/images/tuanCrabs.jpeg" alt="" class="w-full h-full object-cover rounded-full border-1">
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
                        <img v-for="image in posting.images" :src="image.image" :key="image.image_id"
                            alt="image posting" class="w-full max-h-150 object-cover">
                    </div>
                </div>
                <!-- untuk gambar 2 -->
                <div v-if="posting?.images.length < 3 && posting?.images.length > 1" class="flex flex-wrap justify-center items-center">
                    <div class="grid grid-cols-2 gap-[1px] w-full max-h-150">
                        <img v-for="image in posting.images" :src="image.image" :key="image.image_id"  @click="handleShowImage(posting.images, image.image_id)"
                            alt="image posting" class="w-full h-full object-cover">
                    </div>
                </div>
                <!-- untuk gambar lebih dari 2 -->
                <div v-if="posting?.images.length > 2" class="flex items-center justify-center">
                    <div class="grid grid-cols-3 gap-1 grid-rows-2 w-full max-h-150">
                        <img v-for="(image, indexImage) in posting.images.slice(0, 3)" :key="image.image_id"  @click="handleShowImage(posting.images, image.image_id)"
                            :src="image.image" alt="image posting" class="h-full w-full object-cover"
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