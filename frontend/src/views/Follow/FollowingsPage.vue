<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import data from '../../models/data';
import { Search } from 'lucide-vue-next';
import { RouterLink, useRoute } from 'vue-router';
import FollowingsPresenter from '../../presenters/FollowingsPresenter';
import Loading from '../components/loadings/Loading.vue';

const followers = ref([]);
const loading = ref(false);
const route = useRoute();
const search = ref('');
const limit = ref(8);
const page = ref(1);
const hasMore = ref(true);
const loadMore = ref(null);
const username = route.params.username;
const presenter = new FollowingsPresenter({
    model: new data(),
    view: {
        followers: followers,
        loading: loading,
        page: page,
        hasMore: hasMore
    }
});
function handleActionFollow(id) {
    presenter.handleActionFollow(id, followers.value);
}
let observer;
function initObserver() {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver((enteries) => {
        enteries.forEach(entry => {
            if (entry.isIntersecting) {
                presenter.getFollowings(username, limit.value, page.value, hasMore.value, followers.value, search.value);
            }
        })
    })
    if (loadMore.value) {
        observer.observe(loadMore.value);
    }
}
onMounted(async () => {
    await presenter.getFollowings(username, limit.value, page.value, hasMore.value, followers.value, search.value);
    await nextTick();
    initObserver();
})
watch(search, async (newValue) => {
    page.value = 1;
    hasMore.value = true;
    followers.value = [];
    await presenter.getFollowings(username, limit.value, page.value, hasMore.value, followers.value, newValue);
    initObserver();
});
</script>
<template>
    <div class="w-full mx-auto p-4">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-800">Aplikasi Media Sosial</h1>
            <p class="text-gray-600">Kelola koneksi dan temukan teman baru</p>
        </div>

        <!-- Bagian Permintaan Pertemanan -->
        <div class="mb-12">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-semibold text-gray-700">Followers</h2>
            </div>

            <div class="flex items-center relative z-5">
                <div class="absolute left-3 z-5">
                    <Search class="w-5 h-5 text-gray-900" />
                </div>
                <input type="text" v-model="search" name="search" id="search" placeholder="Search"
                    class="w-full p-3 pl-10 border border-gray-300 bg-white rounded-md">
            </div>
            <div class="divider mb-6"></div>

            <div class="grid gap-4">
                <div v-for="follower in followers"
                    class="friend-card bg-white rounded-lg p-4 shadow transition-all duration-300 ease-in-out flex items-center">
                    <img :src="follower.following.profile.profile_picture || '/images/book.jpg'"
                        alt="Profil wanita asia usia 20-an dengan senyum ramah, mengenakan kemeja denim, background biru muda"
                        class="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover mr-4">
                    <RouterLink :to="`/profile/${follower.following.username}`" class="flex-1">
                        <h3 class="font-medium text-gray-800">{{ follower?.following.profile.name }}</h3>
                        <p class="text-sm text-gray-500">{{ follower?.following.username }}</p>
                    </RouterLink>
                    <div v-if="follower.my_following" class="flex space-x-2">
                        <button @click="handleActionFollow(follower.id)"
                            class="px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base transition"
                            :class="[follower.folback ? 'bg-white hover:bg-gray-200 text-gray-800 border border-orange-100' : 'bg-orange-600 hover:bg-orange-700 text-white']">
                            {{ !follower.folback ? 'Follback' : 'Unfollow' }}
                        </button>
                    </div>
                </div>
            </div>
            <p class="flex justify-center p-2" ref="loadMore" v-if="hasMore">
                <Loading :size="6" :borderSize="3" />
            </p>
        </div>
    </div>
</template>
