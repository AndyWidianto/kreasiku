<script setup>
import { EllipsisVertical, Heart, MessageCircle, Share2, SendHorizonal } from 'lucide-vue-next';
import CommentsDashboardPresenter from '../../presenters/CommentsDashboardPresenter';
import data from '../../models/data';
import { computed, inject, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Loading from '../components/loadings/Loading.vue';

const route = useRoute();
const { id } = route.params;
const QueryCommentId = route.query.comment;
const QueryMentionId = route.query.mention;
const socket = inject("socket");

const posting = ref(null);
const comments = ref([]);
const user = ref(null);
const refContent = ref(null);
const showDropdownUser = ref(false);
const content = ref('');
const suggestions = ref(null);
const mentionActive = ref(false);
const mentions = ref([]);
const commentId = ref(null);
const limit = ref(8);
const page = ref(1);
const hasMore = ref(true);
const loadMore = ref(null);
const loading = ref(false);
const limitMentions = ref(5);
const pageMentions = ref(1);
const loadingMentions = ref(false);
const showImages = ref(false);
const images = ref({});
const name = ref('');
const startImage = ref(0);

const presenter = new CommentsDashboardPresenter({
    model: new data(),
    view: {
        posting: posting,
        user: user,
        content: content,
        suggestions: suggestions,
        showDropdownUser: showDropdownUser,
        hasMore: hasMore,
        page: page,
        loading: loading,
        mentions: mentions,
        comments: comments,
        pageMentions: pageMentions,
        loadingMentions: loadingMentions,
    }
});
function handleShowImages(indexImage) {
    images.value = posting.value.images;
    name.value = posting.value.user.value.profile.name;
    startImage.value = indexImage;
    showImages.value = true;
}
function handleDestroyShowImages() {
    images.value = [];
    showImages.value = false;
    name.value = '';
    startImage.value = 0;
}
function handleSelectKey() {
    presenter.handleSelectKey(content.value);
}
function likePosting() {
    presenter.handleActionsLike(posting.value, user.value.user_id);
}
function handleSelectUser(user) {
    content.value = content.value.replace(/@(\w*)$/, `@${user.username} `);
    mentions.value.push({ username: user.username, id: user.user_id });
    refContent.value.focus();
    showDropdownUser.value = false;
}
function createComment() {
    if (mentionActive.value && commentId.value) {
        return presenter.createMention(socket, commentId.value, comments.value, user.value, content.value, mentions.value);
    }
    presenter.createComment(socket, posting.value, user.value, content.value);
}
function handleMantion(user, id) {
    content.value = `@${user.username} `;
    refContent.value.focus();
    mentionActive.value = true;
    commentId.value = id;
    mentions.value.push({ username: user.username, id: user.user_id });
}
function handleAddMention(id) {
    presenter.getMentions(id, limitMentions.value, comments.value, QueryMentionId);
}
function handleTotalMentions(comment) {
    const mentions = comment.mentions;
    const total = mentions ? comment.total_mentions - mentions.length : comment.total_mentions;
    return total;
}
function toComment(id) {
    if (id) {
        const el = document.getElementById(`comment-${id}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('bg-orange-100');
            setTimeout(() => {
                el.classList.remove('bg-orange-100');
            }, 2000);
        }
    }
}
let observer;
function initObserver(posting_id) {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver((enteries) => {
        enteries.forEach(entry => {
            if (entry.isIntersecting) {
                presenter.getComments(limit.value, page.value, posting_id, hasMore.value, comments.value);
            }
        })
    })
    if (loadMore.value) {
        observer.observe(loadMore.value);
    }
}
onMounted(async () => {
    await presenter.getUser();
    await presenter.getPosting(id);
    await presenter.getComments(limit.value, page.value, id, hasMore.value, comments.value, QueryCommentId);
    await nextTick();
    initObserver(id);
    if (QueryMentionId && QueryCommentId) {
        await presenter.getMention(QueryCommentId, QueryMentionId, comments.value);
    }
    if (QueryCommentId && !QueryMentionId) {
        toComment(QueryCommentId);
    } else {
        toComment(QueryMentionId);
    }
});
watch(() => route.params.id, async (newValue) => {
    comments.value = [];
    page.value = 1;
    hasMore.value = true;
    await presenter.getPosting(newValue);
    await presenter.getComments(newValue);
    await nextTick();
    initObserver(newValue);
});
watch(() => route.query.comment && !route.query.mention, (newValue) => {
    toComment(newValue);
})
watch(() => route.query.comment && route.query.mention, (newValue) => {
    toComment(newValue);
})
watch(content, (newValue) => {
    if (mentionActive.value && !newValue.startsWith('@')) {
        mentionActive.value = false;
        commentId.value = null;
    }
    const newMentions = mentions.value.filter(user => newValue.includes(`@${user?.username}`));
    mentions.value = newMentions;
})
</script>

<template>
    <ShowImagePage v-if="showImages" :images="images" :start="startImage" :goBack="handleDestroyShowImages" :Name="name" />
    <div class="flex justify-center w-full md:p-2">
        <div class="w-full lg:w-2xl">
            <RouterLink :to="`/profile/${posting?.user.username}`" class="flex items-center gap-3 p-2">
                <div class="w-10 h-10 shrink-0">
                    <img :src="posting?.user.profile.profile_picture ? posting?.user.profile.profile_picture : '/images/foto_default.jpg'"
                        alt="image posting" class="w-full h-full object-cover rounded-full border-1">
                </div>
                <div class="w-full">
                    <h2 class="text-lg font-semibold">{{ posting?.user.profile?.name }}</h2>
                    <p class="text-sm text-gray-600">{{ posting?.user.username }}</p>
                </div>
                <button>
                    <EllipsisVertical class="w-6 h-6" />
                </button>
            </RouterLink>
            <div class="w-full">
                <p class="px-1 md:px-0 text-gray-800">
                    <span v-for="content in posting?.content.split(/(#\w+)/g)">
                        <RouterLink :to="`/search/${content.slice(1)}`" v-if="content.startsWith('#')"
                            class="text-blue-600 hover:underline">{{ content }}</RouterLink>
                        <span v-else>{{ content }}</span>
                    </span>
                </p>
                <!-- untuk gambar kurang dari 2 -->
                <div v-if="posting?.images.length == 1" class="flex flex-wrap justify-around items-center">
                    <div class="flex items-center w-full bg-black">
                        <img v-for="(image, indexImage) in posting.images" :src="image.image" :key="image.image_id" @click="handleShowImages(indexImage)"
                            alt="image posting" class="w-full max-h-150 object-cover">
                    </div>
                </div>
                <!-- untuk gambar 2 -->
                <div v-if="posting?.images.length < 3 && posting?.images.length > 1" class="flex flex-wrap justify-center items-center">
                    <div class="grid grid-cols-2 gap-[1px] w-full max-h-150">
                        <img v-for="(image, indexImage) in posting.images" :src="image.image" :key="image.image_id" @click="handleShowImages(indexImage)"
                            alt="image posting" class="w-full h-full object-cover">
                    </div>
                </div>
                <!-- untuk gambar lebih dari 2 -->
                <div v-if="posting?.images.length > 2" class="flex items-center justify-center">
                    <div class="grid grid-cols-3 gap-1 grid-rows-2 w-full max-h-150">
                        <img v-for="(image, indexImage) in posting.images.slice(0, 3)" :key="image.image_id" @click="handleShowImages(indexImage)"
                            :src="image.image" alt="image posting" class="h-full w-full object-cover"
                            :class="[indexImage === 0 ? 'col-span-2 row-span-1 row-span-2' : '']">
                    </div>
                </div>
                <div class="px-1 md:px-0 flex items-center gap-2 text-sm">
                    <button>{{ posting?.total_likes }} likes</button>
                    <button>{{ posting?.total_comments + posting?.total_mentions }} comments</button>
                    <button>{{ posting?.total_shares }} shares</button>
                </div>
                <div class="flex items-center">
                    <button @click="likePosting" class="p-2 px-4">
                        <Heart class="w-6 h-6"
                            :class="[posting?.is_like ? 'fill-orange-600 text-orange-600' : 'text-gray-800']" />
                    </button>
                    <button class="p-2 px-4">
                        <MessageCircle class="w-6 h-6 text-gray-800" />
                    </button>
                    <button class="p-2 px-4">
                        <Share2 class="w-6 h-6 text-gray-800" />
                    </button>
                </div>
            </div>
            <div class="p-2 pb-15 border-t border-gray-400">
                <div class="pl-1 md:p-1" v-for="comment in comments" :key="comment.comment_id"
                    :id="`comment-${comment.comment_id}`">
                    <div class="flex items-start w-full gap-2">
                        <img :src="comment.user.profile.profile_picture ? comment.user.profile.profile_picture : '/images/book.jpg'"
                            alt="" class="w-9 h-9 rounded-full space-x-2 shrink-0">
                        <div class="p-0 m-0 w-full">
                            <RouterLink :to="`/profile/${comment.user.username}`" class="font-semibold">{{
                                comment.user.username }}</RouterLink>
                            <p class="px-1 md:px-0 text-gray-800 leading-none">
                                <span v-for="content in comment.content.split(/(@\w+)/g)">
                                    <RouterLink v-if="content.startsWith('@')" :to="`/profile/${content.slice(1)}`"
                                        class="text-blue-600 hover:underline">{{ content }}</RouterLink>
                                    <span v-else>{{ content }}</span>
                                </span>
                            </p>
                            <div class="flex items-center gap-2">
                                <button @click="handleMantion(comment.user, comment.comment_id)"
                                    class="text-xs text-orange-600 font-semibold">balas</button>
                            </div>
                        </div>
                        <div class="p-0 md:px-1">
                            <button>
                                <Heart class="w-5 h-5" />
                            </button>
                            <div class="text-center text-xs">{{ comment.likes?.length }}</div>
                        </div>
                    </div>
                    <div v-for="mention in comment?.mentions" class="flex items-start justify-between gap-2 pl-4 py-1"
                        :id="`comment-${mention.id}`"
                        :key="mention.id">
                        <img :src="mention.user.profile.profile_picture ? mention.user.profile.profile_picture : '/images/book.jpg'"
                            alt="" class="w-9 h-9 rounded-full shrink-0">
                        <div class="w-full leading-none">
                            <RouterLink :to="`/profile/${mention.user.username}`" class="font-semibold">{{
                                mention.user.username }}</RouterLink>
                            <p class="text-gray-800">
                                <span v-for="content in mention.content.split(/(@\w+)/g)">
                                    <RouterLink v-if="content.startsWith('@')" :to="`/profile/${content.slice(1)}`"
                                        class="text-blue-600 hover:underline">{{ content }}</RouterLink>
                                    <span v-else>{{ content }}</span>
                                </span>
                            </p>
                            <div class="flex items-center gap-2">
                                <button @click="handleMantion(mention.user, comment.comment_id)"
                                    class="text-xs text-orange-600 font-semibold">balas</button>
                            </div>
                        </div>
                        <div class="p-1">
                            <button>
                                <Heart class="w-5 h-5" />
                            </button>
                            <div class="text-center text-xs">0</div>
                        </div>
                    </div>
                    <button v-if="handleTotalMentions(comment) > 0" @click="handleAddMention(comment.comment_id)"
                        class="w-full text-start text-xs font-semibold text-gray-700 p-1">lihat balasan({{
                            handleTotalMentions(comment) }})</button>
                </div>
                <p class="flex justify-center text-orange-500 p-2" ref="loadMore" v-if="hasMore">
                    <Loading :size="6" :borderSize="3" />
                </p>
            </div>
            <div
                class="fixed bottom-0 w-full left-0 md:left-[320px] md:w-[calc(100%-320px)] px-3 py-2 border-t border-gray-400 color-app">
                <form @submit.prevent="createComment" class="relative">
                    <div class="w-70 bg-white border-1 border-gray-400 absolute bottom-11 left-0 overflow-hidden"
                        :hidden="!showDropdownUser">
                        <ul class="overflow-x-auto max-h-60">
                            <li v-for="user in suggestions">
                                <button type="button" @click="handleSelectUser(user)"
                                    class="flex items-center gap-2 p-1">
                                    <img src="/images/tuanCrabs.jpeg" alt=""
                                        class="w-10 h-10 object-cover rounded-full shrink-0">
                                    <h2 class="font-semibold">{{ user.username }}</h2>
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div class="flex items-center relative">
                        <input type="text" name="content" id="content" autocomplete="off" ref="refContent"
                            @input="handleSelectKey" v-model="content"
                            class="w-full p-2 pr-10 border-1 border-gray-400 focus:outline focus:outline-orange-500 rounded-sm"
                            placeholder="comments...">
                        <button type="submit" class="absolute right-0 p-2 text-blue-600">
                            <SendHorizonal class="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>