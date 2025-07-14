<script setup>
import { EllipsisVertical, Heart, MessageCircle, Share2, SendHorizonal } from 'lucide-vue-next';
import CommentsDashboardPresenter from '../../presenters/CommentsDashboardPresenter';
import data from '../../models/data';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { id } = route.params;

const posting = ref(null);
const user = ref(null);
const refContent = ref(null);
const state = reactive({
    showDropdownUser: false,
    content: '',
    suggestions: null
})

const presenter = new CommentsDashboardPresenter({
    model: new data(),
    view: {
        posting: (value) => posting.value = value,
        user: (value) => user.value = value,
        content: (value) => state.content = value,
        suggestions: (value) => state.suggestions = value,
        showDropdownUser: (value) => state.showDropdownUser = value
    }
});
function isLike(likes) {
    if (!likes) return;
    const findLike = likes.find(like => like.user_id === user.value?.user_id);
    if (!findLike) {
        return false;
    }
    return true;
};
function handleSelectKey() {
    presenter.handleSelectKey(state.content);
}
function likePosting(id) {
    presenter.handleActionsLike(id, posting.value, user.value.user_id);
}
function handleSelectUser(username) {
    state.content = state.content.replace(/@(\w*)$/, `@${username} `);
    refContent.value.focus();
    state.showDropdownUser = false;
}
function createComment() {
    presenter.createComment(posting.value, user.value, state.content);
}
onMounted(() => {
    presenter.getUser();
    presenter.getPosting(id);
})
</script>

<template>
    <div class="flex justify-center p-2">
        <div class="w-2xl">
            <div class="flex items-center gap-3 p-2">
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
                <p class="text-gray-800">
                    <span v-for="content in posting?.content.split(/(#\w+)/g)">
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
                    <button>{{ posting?.likes.length }} likes</button>
                    <button>{{ posting?.comments.length }} comments</button>
                    <button>111 shares</button>
                </div>
                <div class="flex items-center">
                    <button @click="likePosting(posting?.posting_id)" class="p-2 px-4">
                        <Heart class="w-6 h-6"
                            :class="[isLike(posting?.likes) ? 'fill-orange-600 text-orange-600' : 'text-gray-800']" />
                    </button>
                    <button class="p-2 px-4">
                        <MessageCircle class="w-6 h-6 text-gray-800" />
                    </button>
                    <button class="p-2 px-4">
                        <Share2 class="w-6 h-6 text-gray-800" />
                    </button>
                </div>
            </div>
            <div class="p-2 border-t-1 border-gray-600">
                <div class="pl-1" v-for="comment in posting?.comments">
                    <div class="flex items-start w-full gap-1">
                        <img :src="comment.user.profile_picture ? comment.user.profile_picutre : '/images/tuanCrabs.jpeg'"
                            alt="" class="w-10 h-10 rounded-full shrink-0">
                        <div class="p-0 m-0 w-full">
                            <h2 class="font-semibold">{{ comment.user.username }}</h2>
                            <p class="text-gray-800">
                                <span v-for="content in comment.content.split(/(@\w+)/g)">
                                    <RouterLink v-if="content.startsWith('@')" :to="`/profile/${content.slice(1)}`" class="text-blue-600 hover:underline">{{ content }}</RouterLink>
                                    <span v-else>{{ content }}</span>
                                </span>
                            </p>
                            <div class="flex items-center gap-2">
                                <button class="text-orange-600">balas</button>
                                <button class="w-full text-start text-xs font-semibold text-gray-700 p-1">lihat
                                    semuanya</button>
                            </div>
                        </div>
                        <div class="p-1">
                            <button>
                                <Heart class="w-5 h-5" />
                            </button>
                            <div class="text-xs">{{ comment.likes?.length }}</div>
                        </div>
                    </div>
                    <!-- <div class="flex items-start gap-1 p-4">
                        <img src="/images/tuanCrabs.jpeg" alt="" class="w-10 h-10 rounded-full shrink-0">
                        <div class="">
                            <h2 class="font-semibold">Andy Widianto</h2>
                            <p class="text-gray-800">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut
                                voluptatem
                                pariatur magnam sit atque doloribus reprehenderit ducimus eum porro sapiente, quis
                                deserunt
                                nihil? Omnis porro deserunt ipsam, quam animi eaque.</p>
                            <div class="flex items-center gap-2">
                                <button class="text-orange-600">balas</button>
                            </div>
                        </div>
                        <div class="p-1">
                            <button>
                                <Heart class="w-5 h-5" />
                            </button>
                            <div class="text-xs">11rb</div>
                        </div>
                    </div> -->
                </div>
            </div>
            <form @submit.prevent="createComment" class="relative">
                <div class="w-70 bg-white border-1 border-gray-400 absolute bottom-11 left-0 overflow-hidden" :hidden="!state.showDropdownUser">
                    <ul class="overflow-x-auto max-h-60">
                        <li v-for="name in state.suggestions">
                            <button type="button" @click="handleSelectUser(name?.username)" class="flex items-center gap-2 p-1">
                                <img src="/images/tuanCrabs.jpeg" alt="" class="w-10 h-10 object-cover rounded-full shrink-0">
                                <h2 class="font-semibold">{{ name.username }}</h2>
                            </button>
                        </li>
                    </ul>
                </div>
                <div class="flex items-center relative">
                    <input type="text" name="content" id="content" autocomplete="off" ref="refContent" @input="handleSelectKey" v-model="state.content"
                        class="w-full p-2 pr-10 border-1 border-gray-400 focus:outline focus:outline-orange-500 rounded-sm"
                        placeholder="comments...">
                    <button type="submit" class="absolute right-0 p-2 text-blue-600">
                        <SendHorizonal class="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>