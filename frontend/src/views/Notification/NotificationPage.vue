<script setup>
import { onMounted, ref } from 'vue';
import NotificationPresenter from '../../presenters/NotificationPresenter';
import data from '../../models/data';
import LoadingSpinner from '../components/loadings/LoadingSpinner.vue';
import { Heart, MessageCircle, UserPlus2 } from 'lucide-vue-next';


const notifications = ref([]);
const loading = ref();
const presenter = new NotificationPresenter({
    model: new data(),
    view: {
        notifications: notifications,
        loading: loading
    }
});
function handleCutContent(data) {
    const content = JSON.parse(data).content;
    if (content?.length < 50) {
        return content
    }
    return `${content?.slice(1, 50)}...`;
}
onMounted(() => {
    presenter.getNotifications();
})
</script>
<template>
    <ul class="flex flex-col bg-gray-100 absolute right-0 w-full max-h-80 overflow-y-scroll scroll-hidden">
        <li v-if="loading" class="flex justify-center">
            <LoadingSpinner :LoadingSize="'6'" :hieghtContent="'6'" :widthContent="'6'" />
        </li>
        <li v-else v-for="(notification, index) in notifications">
            <RouterLink class="flex gap-2 p-2" @click="handleUpdateNotif(index)"
                v-if="notification?.verb === 'comment'">
                <div class="flex items-end relative">
                    <img src="/images/samsung2.jpg" alt="" class="w-10 h-10 object-cover p-2 rounded-full">
                    <div class="absolute right-0">
                        <MessageCircle class="w-4 h-4 text-green-500" />
                    </div>
                </div>
                <div class="">
                    <h2><span class="font-bold">{{ notification.receiver.username }}</span> telah mengomentari
                        postingan anda</h2>
                </div>
            </RouterLink>
            <RouterLink class="flex gap-2 p-2" @click="handleUpdateNotif(index)"
                v-else-if="notification?.verb === 'follow'">
                <div class="flex items-end relative">
                    <img src="/images/samsung2.jpg" alt="" class="w-10 h-10 object-cover p-2 rounded-full">
                    <div class="absolute right-0">
                        <UserPlus2 class="w-4 h-4 text-blue-500" />
                    </div>
                </div>
                <div class="">
                    <h2><span class="font-bold">{{ notification.receiver.username }}</span> Mengirim permintaan
                        pertemanan</h2>
                    <button
                        class="text-orange-500 font-semibold text-xs rounded-md p-2 px-3 border-1 border-gray-300">follback</button>
                </div>
            </RouterLink>
            <RouterLink :to="`/posting/${notification.object_id}`" @click="handleUpdateNotif(index)"
                v-else-if="notification?.verb === 'like'" class="flex gap-2 p-2"
                :class="[notification.is_read === 'false' ? 'bg-orange-100' : '']">
                <div class="flex items-end relative">
                    <img :src="notification.receiver.profile.profile_url || '/images/book.jpg'" alt="profile" class="w-10 h-10 object-cover p-2 rounded-full">
                    <div class="absolute right-0">
                        <Heart class="w-4 h-4 text-orange-500" />
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
        <li class="flex justify-center">No more notification</li>
    </ul>
</template>