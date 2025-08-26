<script setup>
import { inject, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { EllipsisVertical, Flag, Heart, MessageCircle, Search, Share2, Trash2 } from 'lucide-vue-next';
import SearchPresenter from '../../presenters/SearchPresenter';
import data from '../../models/data';
import { useRoute, RouterLink, useRouter } from 'vue-router';
import Loading from '../components/loadings/Loading.vue';

const route = useRoute();
const router = useRouter();
const { search } = route.params;
const socket = inject('socket');

const filter = ref('all');
const postings = ref([]);
const users = ref([]);
const user = ref({});
const countUsers = ref(0);
const loadingPosting = ref(false);
const loadingUser = ref(false);
const limit = ref(5);
const limitUsers = ref(5);
const hasMore = ref(true);
const loadMore = ref(null);
const itemsRef = ref({});
const state = reactive({
    search: '',
});
const presenter = new SearchPresenter({
    model: new data(),
    view: {
        postings: postings,
        users: users,
        countUsers: countUsers,
        hasMore: hasMore,
        user: user
    }
})
function likePosting(posting, user_id) {
    presenter.handleActionsLike(posting, postings.value, user.value, user_id, socket);
}
function parseContent(content) {
    const newContent = content.split(/(#\w+)/g);
    return newContent;
}
function SearchPostings() {
    if (state.search !== "") {
        router.replace(`/search/${state.search}`);
    }
}
function handleFilter(value) {
    filter.value = value;
}
function SetItemRef(el, id) {
    if (el) {
        itemsRef.value[id] = el;
    }
}
function Follow(id) {
    presenter.createFollow(id, users.value);
}
function unFollow(id) {
    presenter.deleteFollow(id, users.value);
}
async function handleAddUsers() {
    loadingUser.value = true;
    await presenter.searchUsersFromUsername(search, limitUsers.value, users.value);
    loadingUser.value = false;
}
function handleUpdateShow(index) {
    postings.value[index].showSetting = !postings.value[index].showSetting;
}
function handleClick(e) {
    postings.value.forEach((post, index) => {
        const elRef = itemsRef.value[post.posting_id];
        if (elRef && !elRef.contains(e.target)) {
            postings.value[index].showSetting = false;
        }
    })
}

// observer
let observer;
function initObserver(value) {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver((enteries) => {
        enteries.forEach(entry => {
            if (entry.isIntersecting) {
                presenter.SearchPostings(value, limit.value, hasMore.value, postings.value);
            }
        })
    })
    if (loadMore.value) {
        observer.observe(loadMore.value);
    }
}
onMounted(async () => {
    await presenter.SearchPostings(search, limit.value, hasMore.value, postings.value);
    await presenter.searchUsersFromUsername(search, limitUsers.value, users.value);
    await presenter.getUser();
    await nextTick(() => {
        initObserver(search);
    });
    window.addEventListener('click', handleClick);
});
watch(() => route.params.search, async (newSearch) => {
    users.value = [];
    postings.value = [];
    hasMore.value = true;
    await presenter.SearchPostings(newSearch, limit.value, hasMore.value, postings.value);
    await presenter.searchUsersFromUsername(newSearch, limitUsers.value, users.value);
    await nextTick(() => {
        initObserver(newSearch);
    })
});

</script>
<template>
    <div class="flex justify-center">
        <div class="w-full md:w-4/5 lg:w-3/5">
            <div class="w-full md:w-4/5 lg:w-3/5 p-2 fixed z-10 top-0 color-app">
                <form @submit.prevent="SearchPostings" class="flex items-center">
                    <button type="submit" class="absolute left-5">
                        <Search class="w-5 h-5 text-gray-400" />
                    </button>
                    <input type="text" name="search" id="search" v-model="state.search" placeholder="Search"
                        class="w-full p-2 pl-10 rounded-full border-1 border-gray-400">
                </form>
                <div class="flex items-center gap-2 mt-2">
                    <button @click="handleFilter('all')" class="px-4 py-1 border border-gray-300 rounded-full"
                        :class="[filter === 'all' ? 'border-orange-300 bg-orange-500 text-white' : '']">all</button>
                    <button @click="handleFilter('users')" class="px-4 py-1 border border-gray-300 rounded-full"
                        :class="[filter === 'users' ? 'border-orange-300 bg-orange-500 text-white' : '']">users</button>
                    <button @click="handleFilter('postings')" class="px-4 py-1 border border-gray-300 rounded-full"
                        :class="[filter === 'postings' ? 'border-orange-300 bg-orange-500 text-white' : '']">postings</button>
                </div>
            </div>
            <div class="w-full my-25"></div>
            <div class="flex flex-col gap-3">
                <div v-show="filter === 'all' || filter === 'users'" class="grid gap-4 px-2">
                    <div v-for="user in users" :key="user.user_id"
                        class="friend-card bg-white rounded-lg p-4 shadow transition-all duration-300 ease-in-out flex items-center">
                        <img :src="user.profile.profile_picture || '/images/book.jpg'"
                            alt="Profil wanita asia usia 20-an dengan senyum ramah, mengenakan kemeja denim, background biru muda"
                            class="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover mr-4">
                        <RouterLink :to="`/profile/${user.username}`" class="flex-1">
                            <h3 class="font-medium text-gray-800">{{ user?.profile.name }}</h3>
                            <p class="text-sm text-gray-500">{{ user?.username }}</p>
                        </RouterLink>
                        <div v-if="user.my_following" class="flex space-x-2">
                            <button @click="unFollow(user.user_id)"
                                class="px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base bg-white hover:bg-gray-200 text-gray-800 border border-orange-100">
                                Unfollow
                            </button>
                        </div>
                        <div v-else class="flex space-x-2">
                            <button @click="Follow(user.user_id)"
                                class="px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base bg-orange-600 hover:bg-orange-700 text-white">Follow</button>
                        </div>
                    </div>
                    <div class="flex justify-center">
                        <Loading v-if="loadingUser" class="text-orange-500" :size="6" :borderSize="3" />
                        <button @click="handleAddUsers" v-if="countUsers > 0 && !loadingUser"
                            class="m-1 p-2 px-4 text-sm font-semibold hover:border-gray-800 rounded-full hover:shadow-sm">Load
                            More({{ countUsers }})</button>
                    </div>
                </div>
                <div v-show="filter === 'all' || filter === 'postings'">
                    <div v-for="(posting, index) in postings" :key="posting?.posting_id" class="px-0 md:px-2">
                        <div class="flex items-center p-2" :class="[index === 0 ? 'border-t-1 border-gray-600' : '']">
                            <RouterLink :to="`/profile/${posting?.user.username}`"
                                class="flex items-center gap-2 w-full">
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
                                <ul class="absolute right-0 w-30 bg-white border border-gray-100 z-5"
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
                                <button class="p-2">
                                    <Share2 class="w-6 h-6 text-gray-800" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <p class="flex justify-center text-orange-500 p-2" ref="loadMore" v-if="hasMore">
                        <Loading :size="8" :borderSize="3" />
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>