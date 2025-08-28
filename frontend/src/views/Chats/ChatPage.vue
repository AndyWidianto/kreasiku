<script setup>
import { ref, computed, nextTick, onMounted, inject, watch } from "vue";
import { ArrowLeft, ArrowRight, Check, CheckCheck, ChevronLeft, Clock, Search, Trash2 } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import { useConverstationStore } from "../../stores/converstationStore";


const socket = inject("socket");
const route = useRoute();
const username = route.query.name;
const converstationStore = useConverstationStore();

const users = ref([]);
const CopyUsers = ref([]);
const searchActive = ref(false);
const messageContainer = ref(null);
const user_is_active = ref(false);
const router = useRouter();
const searchUsername = ref("");
const width = ref(window.innerWidth);

function goBack() {
  router.push("/");
  socket.emit("leave_private_chat");
  converstationStore.userActive = null;
}
async function selectUser(converstation_id, user) {
  await converstationStore.getMessages(converstation_id, user, socket);
  await nextTick(() => {
    scrollToBottom();
  });
}
function scrollToBottom() {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
}
async function sendMessage() {
  await converstationStore.sendMessage(socket);
  await nextTick(() => {
    scrollToBottom();
  });
}
function handleMessageSended(data) {
  converstationStore.handleMessageSended(data);
}
function handlePrivateMessage(data) {
  converstationStore.handlePrivateMessage(data);
}
function updateWidth() {
  width.value = window.innerWidth;
}
function handleDeleteActive() {
  converstationStore.handleDeleteActive(socket);
}
function handleCutContent(content) {
  if (!content) return;
  const decrypted = converstationStore.decryptMessage(content);
  if (width.value > 300 && width.value < 800) {
    return decrypted;
  }
  if (decrypted.length > 30) {
    return `${decrypted.slice(0, 25)}...`;
  }
  return decrypted;
}
function handleUserActive(data) {
  if (converstationStore.userActive?.user.user_id === data.from) {
    user_is_active.value = data.is_active;
  }
}
function handleDecryptedMessage(message) {
  const decrypted = converstationStore.decryptMessage(message);
  return decrypted;
}
function handleMessagesSended(data) {
  converstationStore.handleMessagesSended(data);
}
function handlePrivateMessagesRead(data) {
  converstationStore.handlePrivateMessagesRead(data);
}
onMounted(async () => {
  await converstationStore.getSecret();
  await converstationStore.getConverstations();
  await nextTick();
  if (username) {
    await converstationStore.guestConverstation(username, socket);
  }
  window.addEventListener('resize', updateWidth);
  socket.on("message_sended", handleMessageSended);
  socket.on("private_message", handlePrivateMessage);
  socket.on("user_active", handleUserActive);
  socket.on("messages_sended", handleMessagesSended);
  socket.on("private_message_unread", handlePrivateMessagesRead);
})
watch(searchUsername, (newValue) => {
  const search = CopyUsers.value.filter(user => user.user.username.toLowerCase().includes(newValue.toLowerCase()));
  users.value = search;
  if (newValue !== "") {
    return searchActive.value = true;
  }
  searchActive.value = false;
});
watch(() => route.query.name, async (newValue) => {
  await converstationStore.guestConverstation(newValue, socket);
});
</script>
<template>
  <div class="flex h-screen bg-[#f0ede7] text-gray-900">
    <!-- Sidebar -->
    <div class="flex-col bg-[#f0ede7] border-r border-gray-300"
      :class="[width < 800 ? converstationStore.userActive ? 'hidden' : 'flex w-full' : 'flex w-72']">
      <header class="flex items-center py-4 px-3 border-b border-gray-300">
        <button @click="goBack" aria-label="Back" class="pr-3">
          <ChevronLeft class="w-7 h-7" />
        </button>
        <h1 class="font-bold text-lg select-none">Message</h1>
      </header>
      <div class="flex flex-col flex-grow overflow-y-auto scroll-hidden">
        <div class="flex items-center relative p-2">
          <input type="search" v-model="searchUsername" class="w-full p-2 rounded-full border border-gray-300 px-4" placeholder="Search" name="search" id="search">
          <button class="absolute right-0 mr-5" :class="[searchActive ? 'hidden' : 'block']"><Search class="w-4 h-4" /></button>
        </div>
        <template v-for="(user, index) in converstationStore.converstations" :key="user.id">
          <button @click="selectUser(user.id, user)" :class="['flex items-center p-3 cursor-pointer hover:bg-gray-200 transition-colors rounded-r-lg',
            converstationStore.userActive?.id === user.id ? 'bg-white font-semibold text-orange-600' : 'text-gray-800']">
            <div class="flex-shrink-0 rounded-full w-10 h-10 bg-emerald-700">
              <img :src="user.user.profile.profile_picture || '/images/foto_default.jpg'" :alt="user.user.username"
                class="w-full h-full object-cover rounded-full">
            </div>
            <div class="ml-3 flex flex-col items-start">
              <span
                :class="converstationStore.userActive?.id === user.id ? 'text-orange-600 font-semibold' : (user?.isUnread ? 'text-orange-600 font-semibold' : 'font-bold')">
                {{ user.user.username }}
              </span>
              <small class="text-gray-700 text-start lowercase">{{ handleCutContent(user.last_message?.content) }}</small>
            </div>
            <div v-if="user?.unread_count > 0"
              class="ml-auto bg-orange-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center select-none">
              {{ user?.unread_count }}
            </div>
          </button>
        </template>
      </div>
    </div>

    <!-- Chat area -->
    <section v-if="converstationStore.userActive !== null" class="flex-col flex-grow bg-[#f9fbfe]"
      :class="[width < 800 ? converstationStore.userActive ? 'flex w-full' : 'hidden' : 'flex']">
      <!-- Chat header -->
      <header class="flex items-center justify-between p-3 border-b border-gray-300 select-none">
        <button v-if="width < 800" @click="handleDeleteActive" class="px-2">
          <ArrowLeft class="w-6 h-6" />
        </button>
        <div class="flex items-center space-x-3 w-full">
          <div class="w-12 h-12 rounded-full bg-emerald-700">
            <img :src="converstationStore.userActive.user.profile.profile_picture || '/images/foto_default.jpg'" :alt="converstationStore.userActive.user.username"
              class="w-full h-full object-cover rounded-full">
          </div>
          <div class="flex flex-col">
            <span class="font-bold text-lg">{{ converstationStore.userActive.user.username }}</span>
            <div v-if="user_is_active" class="flex items-center space-x-1">
              <span class="w-3 h-3 rounded-full bg-orange-500 inline-block"></span>
              <small class="text-orange-500 lowercase font-semibold">online</small>
            </div>
            <div v-else class="flex items-center space-x-1">
              <small class="lowercase font-semibold">offline</small>
            </div>
          </div>
        </div>
        <div class="flex space-x-5 text-gray-700">
          <!-- <button aria-label="Call" class="hover:text-gray-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2 8.5v7a2 2 0 002 2h1.586a1 1 0 00.707-.293l2.707-2.707a1 1 0 011.414 0L12 16.414a1 1 0 001.414 0l2.707-2.707a1 1 0 011.414 0l1.172 1.172A2 2 0 0020 15.5v-7a2 2 0 00-2-2H4a2 2 0 00-2 2z" />
            </svg>
          </button> -->
          <!-- <button aria-label="Video Call" class="hover:text-gray-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h9a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
            </svg>
          </button>
          <button aria-label="More options" class="hover:text-gray-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 " fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v.01M12 12v.01M12 18v.01" />
            </svg>
          </button> -->
        </div>
      </header>

      <!-- Messages area -->
      <main ref="messageContainer" class="flex-grow p-6 overflow-y-auto space-y-4">
        <div v-if="converstationStore.messages <= 0" class="flex flex-col h-full items-center justify-center">
          <img :src="converstationStore.userActive.user.profile.profile_picture" alt="profile" class="w-40 h-40 rounded-full object-cover">
          <h2 class="text-black font-semibold text-xl">{{ converstationStore.userActive.user.username }}</h2>
          <p class="text-gray-600">Tidak ada pesan di sini. Mulailah percakapan dengan sapaan hangat ✨</p>
        </div>
        <div v-for="(msg, index) in converstationStore.messages" :key="index"
          :class="['flex items-start gap-2', msg.sender_id === converstationStore.userActive.my_id ? 'justify-end space-x-reverse' : '']">
          <div class="flex flex-col items-center group"> 
            <div :class="[
              'inline-block rounded-2xl max-w-xs',
              msg.sender_id === converstationStore.userActive.my_id ? 'text-white bg-orange-500' : 'border border-gray-300 text-gray-700 bg-white'
            ]">
              <p class="px-4" :class="[converstationStore.userActive.my_id === msg.sender_id ? 'pt-2' : 'py-2']">{{ handleDecryptedMessage(msg.content) }}</p>
              <div v-if="converstationStore.userActive.my_id === msg.sender_id" class="flex px-2 justify-end">
                <Check v-if="msg.sended === 'pending'" class="w-4 h-4" />
                <CheckCheck v-else-if="msg.sended === 'sended' && msg.is_read === 'false'" class="w-4 h-4" />
                <CheckCheck v-else-if="msg.sended === 'sended' && msg.is_read === 'true'"
                  class="w-4 h-4 text-green-700" />
                <Clock v-else class="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Input area -->
      <footer class="p-3 border-t border-gray-300">
        <form @submit.prevent="sendMessage" class="flex items-center">
          <input v-model="converstationStore.message" type="text" placeholder="Type your message"
            class="flex-grow border border-gray-300 rounded-full px-5 py-2 mr-4 outline-none focus:ring-2 focus:ring-orange-400" />
          <button type="submit" aria-label="Send message"
            class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-orange-400 transition-colors">
            <ArrowRight />
          </button>
        </form>
      </footer>
    </section>
  </div>
</template>
<style scoped>
/* Customize scrollbar for chat messages */
main::-webkit-scrollbar {
  width: 8px;
}

main::-webkit-scrollbar-thumb {
  background: #f97316;
  /* orange-500 */
  border-radius: 4px;
}

main::-webkit-scrollbar-track {
  background: transparent;
}
</style>
