<script setup>
import { onMounted, ref } from 'vue';
import { EllipsisVertical, Heart, MessageCircle, Share2 } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import ProfilePresenter from '../../presenters/ProfilePresenter';
import data from '../../models/data';

const user = ref(null);
const posting = ref();
const loading = ref(false);
const presenter = new ProfilePresenter({
    model: new data(),
    view: {
        user: (value) => user.value = value,
        posting: (value) => posting.value = value,
        loading: (value) => loading.value = value
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
onMounted(() => {
    presenter.getUser();
});
</script>
<template>
    <div class="px-5 lg:px-10 w-full">
        <div class="flex w-full pb-5 md:pb-0 relative z-5">
            <img src="/images/book.jpg" alt="" class="aspect-4/1 object-cover z-5">
            <img :src="user?.profile.profile_picture" alt=""
                class="w-15 h-15 md:w-20 md:h-20 lg:w-40 lg:h-40 object-cover rounded-full border-2 md:border-4 border-gray-100 absolute bottom-0 z-10">
        </div>
        <div class="pb-4 mb-1 border-b-1 border-gray-600">
            <h2 class="text-2xl font-bold">{{ user?.profile.name }}</h2>
            <p class="text-gray-700">
                {{ user?.profile.description }}
            </p>
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
                <p class="text-gray-800 py-2">
                    <span v-for="content in parseContent(posting?.content)">
                        <RouterLink :to="`/search/${content.slice(1)}`" v-if="content.startsWith('#')"
                            class="text-blue-600 hover:underline">{{ content }}</RouterLink>
                        <span v-else>{{ content }}</span>
                    </span>
                </p>
                <!-- untuk gambar kurang dari 2 -->
                <div v-if="posting?.images.length < 1" class="flex flex-wrap justify-around items-center">
                    <div class="flex items-center w-full max-h-200 bg-black">
                        <img v-for="image in posting.images" :src="image.image" :key="image.image_id"
                            alt="image posting" class="w-full h-auto object-cover border-1">
                    </div>
                </div>
                <!-- untuk gambar 2 -->
                <div v-if="posting?.images.length < 3" class="flex flex-wrap justify-center items-center">
                    <div class="grid grid-cols-2 w-full max-h-200 bg-black">
                        <img v-for="image in posting.images" :src="image.image" :key="image.image_id"
                            alt="image posting" class="w-full h-full object-cover border-1">
                    </div>
                </div>
                <!-- untuk gambar lebih dari 2 -->
                <div v-if="posting?.images.length > 2" class="flex items-center justify-center">
                    <div class="grid grid-cols-3 grid-rows-2 w-full bg-black max-h-200">
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