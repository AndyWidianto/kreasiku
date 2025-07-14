<script setup>
import { Bell, Heart, MessageCircle, Search, UserPlus2 } from 'lucide-vue-next';
import { onMounted, reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import NavbarDashboardPresenter from '../../presenters/NavbarDashboardPresenter';
import data from '../../models/data';

const props = defineProps({
    user: Object
});
const state = reactive({
    DropDownNotifikasi: false,
    NitificationsNotRead: [],
    notifications: []
});

const presenter = new NavbarDashboardPresenter({
    model: new data(),
    view: {
        NotificationsNotRead: (value) => state.NitificationsNotRead = value,
        notifications: (value) => state.notifications = value
    }
})
function handleShowDropDown() {
    state.DropDownNotifikasi = !state.DropDownNotifikasi;
    if (state.DropDownNotifikasi) {
        presenter.getNotifications();
    }
}
onMounted(() => {
    presenter.getNotificationNotRead();
})
</script>
<template>
    <ul class="flex items-center gap-4 p-2 px-6 color-app border-b-1 border-gray-400 fixed left-[320px] top-0 w-[calc(100%-320px)] z-10">
        <li>
            <form class="flex items-center relative">
                <button class="absolute left-4">
                    <Search class="w-5 h-5" />
                </button>
                <input type="search" name="search" id="search" placeholder="Search"
                    class="p-2 pl-10 border-1 border-gray-400 bg-gray-100 w-100 rounded-full">
            </form>
        </li>
        <li class="ml-auto relative">
            <button class="flex items-center realtive" @click="handleShowDropDown">
                <Bell class="w-6 h-6 fill-gray-600 text-gray-600" />
                <div class="flex items-center absolute left-3 justify-center text-xss" :class="[state.NitificationsNotRead.length !== 0 ? 'rounded-full w-4 h-4 p-1 bg-red-500 text-gray-100' : '']">
                    {{ state.NitificationsNotRead.length !== 0 ? state.NitificationsNotRead.length : '' }}
                </div>
            </button>
            <ul class="flex-col gap-2 p-2 bg-gray-100 absolute right-0 w-100 max-h-80 overflow-y-scroll scroll-hidden" :class="[state.DropDownNotifikasi ? 'flex' : 'hidden']">
                <li v-for="notification in state.notifications">
                    <RouterLink class="flex gap-2" v-if="notification?.verb === 'comment'">
                        <div class="flex items-end relative">
                            <img src="/images/samsung2.jpg" alt="" class="w-10 h-10 object-cover p-2 rounded-full">
                            <div class="absolute right-0"><MessageCircle class="w-4 h-4 text-green-500" /></div>
                        </div>
                        <div class="">
                            <h2><span class="font-bold">Andy</span> telah mengomentari postingan anda</h2>
                            <p>"@rizka Apa kabar"</p>
                        </div>
                    </RouterLink>
                    <RouterLink class="flex gap-2" v-else-if="notification?.verb === 'follow'">
                        <div class="flex items-end relative">
                            <img src="/images/samsung2.jpg" alt="" class="w-10 h-10 object-cover p-2 rounded-full">
                            <div class="absolute right-0"><UserPlus2 class="w-4 h-4 text-blue-500" /></div>
                        </div>
                        <div class="">
                            <h2><span class="font-bold">Andy</span> Mengirim permintaan pertemanan</h2>
                            <button class="text-orange-500 font-semibold text-xs rounded-md p-2 px-3 border-1 border-gray-300">follback</button>
                        </div>
                    </RouterLink>
                    <RouterLink class="flex gap-2" v-else-if="notification?.verb === 'like'">
                        <div class="flex items-end relative">
                            <img src="/images/samsung2.jpg" alt="" class="w-10 h-10 object-cover p-2 rounded-full">
                            <div class="absolute right-0"><Heart class="w-4 h-4 text-orange-500" /></div>
                        </div>
                        <div class="">
                            <h2><span class="font-bold">Andy</span> menyukai postingan anda</h2>
                        </div>
                    </RouterLink>
                </li>
            </ul>
        </li>
        <li class="shrink-0 w-10 h-10">
            <RouterLink :to="`/profile/${props.user?.username}`">
                <img :src="[props.user?.profile.profile_picture ? props.user.profile.profile_picture : '/images/tuanCrabs.jpeg']" alt="" class="w-full h-full object-cover rounded-full">
            </RouterLink>
        </li>
    </ul>
</template>