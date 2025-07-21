<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { EllipsisVertical, Heart, MessageCircle, Search, Share2 } from 'lucide-vue-next';
import SearchPresenter from '../../presenters/SearchPresenter';
import data from '../../models/data';
import { useRoute, RouterLink, useRouter } from 'vue-router';
import LoadingSpinner from '../components/loadings/LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();
const { search } = route.params;
const postings = ref();
const state = reactive({
    search: '',
    loading: false,
});
const presenter = new SearchPresenter({
    model: new data(),
    view: {
        postings: (value) => postings.value = value,
        loading: (value) => state.loading = value
    }
})
function isLike(likes) {
    // return presenter.isLike(likes, user.value);
}
function likePosting(id) {
    // presenter.handleActionsLike(id, postings.value, user.value?.user_id);
}
function parseContent(content) {
    const newContent = content.split(/(#\w+)/g);
    console.log(newContent);
    return newContent;
}
function SearchPostings() {
    router.replace(`/search/${state.search}`);
}
onMounted(() => {
    presenter.SearchPostings(search);
});
watch(() => route.params.search, async (newSearch, oldSearch) => {
    await presenter.SearchPostings(newSearch);
});
</script>
<template>
    <div class="flex justify-center">
        <div class="w-full md:w-4/5 lg:w-3/5">
            <div class="w-full md:w-4/5 lg:w-3/5 p-2 fixed top-0 color-app">
                <form @submit.prevent="SearchPostings" class="flex items-center">
                    <button type="submit" class="absolute left-4"><Search class="w-5 h-5" /> </button>
                    <input type="text" name="search" id="search" v-model="state.search" class="w-full p-2 pl-8 rounded-full border-1 border-gray-400">
                </form>
            </div>
            <div class="w-full py-8"></div>
            <div class="flex justify-center text-blue-500" v-if="state.loading">
                <LoadingSpinner :hieght-content="30" :widthContent="'full'" :LoadingSize="10" />
            </div>
            <div v-else v-for="posting in postings" :key="posting?.posting_id" class="w-full p-2">
                <div class="flex items-center gap-3 p-2">
                    <div class="w-10 h-10 shrink-0">
                        <img src="/images/tuanCrabs.jpeg" alt=""
                            class="w-full h-full object-cover rounded-full border-1">
                    </div>
                    <div class="w-full">
                        <h2 class="text-lg font-semibold">{{ posting?.user?.profile?.name }}</h2>
                        <p class="text-sm text-gray-600">{{ posting?.user?.username }}</p>
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
                        <div class="flex items-center w-full min-h-100 max-h-200 bg-black">
                            <img v-for="image in posting.images" :src="image.image" :key="image.image_id"
                                alt="image posting" class="w-full h-auto object-cover border-1">
                        </div>
                    </div>
                    <!-- untuk gambar 2 -->
                    <div v-if="posting?.images.length < 3" class="flex flex-wrap justify-center items-center">
                        <div class="grid grid-cols-2 w-full min-h-100 max-h-200 bg-black">
                            <img v-for="image in posting.images" :src="image.image" :key="image.image_id"
                                alt="image posting" class="w-full h-full object-cover border-1">
                        </div>
                    </div>
                    <!-- untuk gambar lebih dari 2 -->
                    <div v-if="posting?.images.length > 2" class="flex items-center justify-center">
                        <div class="grid grid-cols-3 grid-rows-2 w-full bg-black min-h-100 max-h-200">
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
    </div>
</template>