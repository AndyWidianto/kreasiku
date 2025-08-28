<script setup>
import { Bell, Heart, MessageCircle, Search, UserPlus2, User2, LogOut, Home, AtSign, HeartPlus } from 'lucide-vue-next';
import { inject, onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useNotifStore } from '../../stores/notifStore';
import Loading from '../components/loadings/Loading.vue';


const props = defineProps({
    user: Object,
    width: Boolean
});
const DropDownNotifikasi = ref(false);
const refDropDownProfile = ref(false);
const router = useRouter();
const profile = ref();
const notif = ref();
const socket = inject("socket");
const loadMore = ref(null);

const notifStore = useNotifStore();
function handleShowDropDown() {
    if (window.innerWidth < 750) {
        return router.push("/notifications");
    }
    if (notifStore.notifications.length < 0) {
        notifStore.getNotifications();
    }
    DropDownNotifikasi.value = !DropDownNotifikasi.value;
}
function handleClick(e) {
    if (profile.value && !profile.value.contains(e.target)) {
        refDropDownProfile.value = false;
    }
    if (notif.value && !notif.value.contains(e.target)) {
        DropDownNotifikasi.value = false;
    }
}
function handleSearch() {
    router.push(`/search/${notifStore.search}`);
}
function handleCutContent(data) {
    if (!data) return;
    const content = JSON.parse(data).content;
    if (content?.length < 30) {
        return content
    }
    return `${content?.slice(1, 30)}...`;
}
function handleNotifications(newNotif) {
    const icon = newNotif.receiver.profile.profile_picture ? newNotif.receiver.profile.profile_picture : '/images/book.jpg';
    new Notification(newNotif.receiver.username,
        {
            icon: icon,
            body: newNotif.message
        });
    notifStore.addNotifNotRead(newNotif);
    notifStore.addNotif(newNotif);
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
onMounted(() => {
    notifStore.getNotificationNotRead();
    notifStore.getNotifications();
    window.addEventListener("click", handleClick);
    socket.on("notifications", handleNotifications);
});
</script>
<template>
    <ul
        class="flex items-center gap-4 p-2 px-6 color-app z-10 transition-all duration-300 fixed left-[0px] top-0 w-[calc(100%-0px)] md:left-[320px] md:w-[calc(100%-320px)]">
        <li class="w-3/5 md:w-2/5">
            <form @submit.prevent="handleSearch" class="flex items-center relative">
                <button class="absolute left-4 text-gray-800">
                    <Search class="w-4 h-4" />
                </button>
                <input type="search" name="search" id="search" v-model="notifStore.search" placeholder="Search"
                    class="p-[8px] pl-10 border-1 border-gray-300 bg-white w-full rounded-full">
            </form>
        </li>
        <li class="md:hidden">
            <RouterLink to="/" v-slot="{ isExactActive }">
                <div :class="[isExactActive ? 'text-orange-500' : 'text-gray-800']">
                    <Home class="w-5 h-5" />
                </div>
            </RouterLink>
        </li>
        <li class="md:hidden">
            <RouterLink to="/chat" v-slot="{ isExactActive }">
                <div :class="[isExactActive ? 'text-orange-500' : 'text-gray-800']">
                    <MessageCircle class="w-5 h-5" />
                </div>
            </RouterLink>
        </li>
        <li class="md:hidden">
            <RouterLink to="/not/followers" v-slot="{ isExactActive }">
                <div :class="[isExactActive ? 'text-orange-500' : 'text-gray-800']">
                    <HeartPlus class="w-5 h-5" />
                </div>
            </RouterLink>
        </li>
        <li class="ml-auto relative">
            <button class="flex items-center realtive" @click="handleShowDropDown" ref="notif">
                <Bell class="w-6 h-6 fill-gray-600 text-gray-600" />
                <div class="flex items-center absolute left-3 justify-center text-xss"
                    :class="[notifStore.NotificationsNotRead.length !== 0 ? 'rounded-full w-4 h-4 p-1 bg-red-500 text-gray-100' : '']">
                    {{ notifStore.NotificationsNotRead.length !== 0 ? notifStore.NotificationsNotRead.length : '' }}
                </div>
            </button>
            <ul class="flex-col bg-gray-100 absolute right-0 w-100 max-h-80 overflow-y-scroll scroll-hidden"
                :class="[DropDownNotifikasi ? 'flex' : 'hidden']">
                <li v-for="(notification, index) in notifStore.notifications">
                    <RouterLink
                        :to="`/posting/${notification.object_id}?comment=${JSON.parse(notification.data).comment_id}`"
                        v-if="notification?.verb === 'comment'" class="flex gap-2 p-2"
                        :class="[notification.is_read === 'false' ? 'bg-orange-100' : '']"
                        @click="notifStore.updateNotif(index)">
                        <div class="flex items-end relative">
                            <img :src="notification.receiver.profile.profile_url || '/images/foto_default.jpg'" alt=""
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
        </li>
        <li class="grid items-center shrink-0 w-10 h-10 relative" ref="profile">
            <button @click="() => refDropDownProfile = !refDropDownProfile">
                <img :src="[props.user?.profile?.profile_picture ? props.user.profile?.profile_picture : '/images/tuanCrabs.jpeg']"
                    alt="" class="w-8 h-8 object-cover rounded-full">
            </button>
            <ul class="absolute top-10 right-0 w-30 max-h-100 bg-gray-100 text-center"
                :class="[refDropDownProfile ? 'block' : 'hidden']">
                <li class="w-full">
                    <RouterLink :to="`/profile/${props.user?.username}`"
                        class="flex justify-center items-center gap-1 hover:bg-gray-200 p-2 px-3 text-gray-600">
                        <User2 class="w-4 h-4" />
                        Profile
                    </RouterLink>
                </li>
                <li class="w-full">
                    <button @click="notifStore.logout()"
                        class="flex justify-center items-center gap-1 w-full hover:bg-gray-200 p-2 px-3 text-red-600">
                        <LogOut class="w-4 h-4" />
                        Logout
                    </button>
                </li>
            </ul>
        </li>
    </ul>
</template>