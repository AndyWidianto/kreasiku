<script setup>
import { nextTick, onMounted, ref } from 'vue';
import { AtSign, Heart, MessageCircle, UserPlus2 } from 'lucide-vue-next';
import Loading from '../components/loadings/Loading.vue';
import { useNotifStore } from '../../stores/notifStore';


const loadMore = ref(null);
const notifStore = useNotifStore();

function handleCutContent(data) {
    const content = JSON.parse(data).content;
    if (content?.length < 50) {
        return content
    }
    return `${content?.slice(1, 50)}...`;
}

let observer;
function initObserver() {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver((enteries) => {
        enteries.forEach(entry => {
            if (entry.isIntersecting) {
                notifStore.getNotifications();
            }
        })
    })
    if (loadMore.value) {
        observer.observe(loadMore.value);
    }
}
onMounted(async () => {
    await nextTick(() => {
        initObserver();
    });
});
</script>
<template>
    <ul class="flex flex-col bg-gray-100 right-0 w-full overflow-y-scroll scroll-hidden">
        <li v-for="(notification, index) in notifStore.notifications">
            <RouterLink :to="`/posting/${notification.object_id}?comment=${JSON.parse(notification.data).comment_id}`"
                v-if="notification?.verb === 'comment'" class="flex gap-2 p-2"
                :class="[notification.is_read === 'false' ? 'bg-orange-100' : '']"
                @click="notifStore.updateNotif(index)">
                <div class="flex items-end relative">
                    <img :src="notification.receiver.profile.profile_url || '/images/book.jpg'" alt=""
                        class="w-10 h-10 object-cover p-2 rounded-full">
                    <div class="absolute right-0">
                        <MessageCircle class="w-4 h-4 text-green-500" />
                    </div>
                </div>
                <div class="">
                    <h2><span class="font-bold">{{ notification.receiver.username }}</span>{{
                        notification.message }}</h2>
                    <div class="">"{{ handleCutContent(notification.data) }}"</div>
                </div>
            </RouterLink>
            <RouterLink class="flex gap-2 p-2" @click="notifStore.updateNotif(index)"
                v-else-if="notification?.verb === 'follow'"
                :class="[notification.is_read === 'false' ? 'bg-orange-100' : '']">
                <div class="flex items-end relative">
                    <img :src="notification.receiver.profile.profile_url || '/images/book.jpg'" alt=""
                        class="w-10 h-10 object-cover p-2 rounded-full">
                    <div class="absolute right-0">
                        <UserPlus2 class="w-4 h-4 text-blue-500" />
                    </div>
                </div>
                <div class="">
                    <h2><span class="font-bold">{{ notification.receiver.username }}</span> Mengirim permintaan
                        pertemanan</h2>
                    <div class="">"{{ notification.data ? handleCutContent(notification.data) : '' }}"</div>
                    <button
                        class="text-orange-500 font-semibold text-xs rounded-md p-2 px-3 border-1 border-gray-300">follback</button>
                </div>
            </RouterLink>
            <RouterLink :to="`/posting/${notification.object_id}`" @click="notifStore.updateNotif(index)"
                v-else-if="notification?.verb === 'like'" class="flex gap-2 p-2"
                :class="[notification.is_read === 'false' ? 'bg-orange-100' : '']">
                <div class="flex items-end relative">
                    <img :src="notification.receiver.profile.profile_url || '/images/book.jpg'" alt="profile"
                        class="w-10 h-10 object-cover p-2 rounded-full">
                    <div class="absolute right-0">
                        <Heart class="w-4 h-4 text-orange-500 fill-orange-500" />
                    </div>
                </div>
                <div class="">
                    <h2><span class="font-bold">{{ notification.receiver.username }}</span>
                        menyukai postingan anda
                    </h2>
                    <div class="">"{{ handleCutContent(notification.data) }}"</div>
                </div>
            </RouterLink>
            <RouterLink
                :to="`/posting/${notification.object_id}?comment=${JSON.parse(notification.data).comment_id}&mention=${JSON.parse(notification.data).id}`"
                @click="notifStore.updateNotif(index)" v-else-if="notification?.verb === 'mention'"
                class="flex gap-2 p-2" :class="[notification.is_read === 'false' ? 'bg-orange-100' : '']">
                <div class="flex items-end relative">
                    <img :src="notification.receiver.profile.profile_url || '/images/book.jpg'" alt="profile"
                        class="w-10 h-10 object-cover p-2 rounded-full">
                    <div class="absolute right-0">
                        <AtSign class="w-4 h-4 text-blue-500" />
                    </div>
                </div>
                <div class="">
                    <h2><span class="font-bold">{{ notification.receiver.username }}</span>
                        menyukai postingan anda
                    </h2>
                    <div class="">"{{ handleCutContent(notification.data) }}"</div>
                </div>
            </RouterLink>
        </li>
        <li class="flex justify-center">
            <p class="flex justify-center text-orange-500 p-2" ref="loadMore" v-if="notifStore.hasMore">
                <Loading :size="6" :borderSize="3" />
            </p>
            <p v-else>No More notification</p>
        </li>
    </ul>
</template>