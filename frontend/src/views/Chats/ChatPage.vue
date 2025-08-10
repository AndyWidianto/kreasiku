<script setup>
import { ref, computed, nextTick, onMounted, inject } from "vue";
import ChatPresenter from "../../presenters/ChatPresenter";
import data from "../../models/data";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, Clock } from "lucide-vue-next";
import { useRouter } from "vue-router";


const socket = inject("socket");
const users = ref([]);
const userActive = ref(null);
const message = ref("");
const messageContainer = ref(null);
const user_is_active = ref(false);
const router = useRouter();
const width = ref(window.innerWidth);
const presenter = new ChatPresenter({
  model: new data(),
  view: {
    users: users,
    message: message
  }
});

function goBack() {
  router.push("/");
}
function selectUser(id) {
  message.value = "";
  const user = users.value.find(value => value.id === id);
  userActive.value = user;
  console.log(user.user.user_id);
  nextTick(() => {
    scrollToBottom();
  });
  socket.emit("user_active", ({ id: user.user.user_id, is_active: false }));
}
function scrollToBottom() {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
}
function sendMessage() {
  presenter.sendMessage(users.value, userActive.value, message.value, socket);
}
function handleMessageSended(data) {
  const findIndex = users.value.map(user => user.id === userActive.value.id);
  users.value[findIndex].messages = userActive.value.messages.map(value => {
    if (value.message_id === data.id) {
      value.sended = data.is_message;
    }
    return {
      ...value
    }
  });
}
function handlePrivateMessage(data) {
  users.value = users.value?.map(user => {
    if (data.from === user.user.user_id) {
      user.messages.push(data.message);
    }
    return user;
  });
}
function updateWidth() {
  width.value = window.innerWidth;
}
function handleDeleteActive() {
  userActive.value = null;
}
onMounted(() => {
  presenter.getConverstation();
  window.addEventListener('resize', updateWidth);
  socket.on("message_sended", handleMessageSended);
  socket.on("private_message", handlePrivateMessage);
  socket.on("user_active", (data) => {
    user_is_active.value = data.is_active;
  })
})

</script>
<template>
  <div class="flex h-screen bg-[#f0ede7] text-gray-900">
    <!-- Sidebar -->
    <div class="flex-col bg-[#f0ede7] border-r border-gray-300" :class="[width < 800 ? userActive ? 'hidden': 'flex w-full' : 'flex w-72']">
      <header class="flex items-center py-4 px-3 border-b border-gray-300">
        <button @click="goBack" aria-label="Back" class="pr-3">
          <ChevronLeft class="w-7 h-7" />
        </button>
        <h1 class="font-bold text-lg select-none">Message</h1>
      </header>
      <div class="flex flex-col flex-grow overflow-y-auto">
        <template v-for="(user, index) in users" :key="user.id">
          <div @click="selectUser(user.id)" :class="['flex items-center p-3 cursor-pointer hover:bg-gray-200 transition-colors rounded-r-lg',
            userActive?.id === user.id ? 'bg-white font-semibold text-orange-600' : 'text-gray-800']">
            <div class="flex-shrink-0 rounded-full w-10 h-10 bg-emerald-700">
              <img :src="user.user.profile.profile_picture" :alt="user.user.username"
                class="w-full h-full object-cover rounded-full">
            </div>
            <div class="ml-3 flex flex-col">
              <span
                :class="userActive?.id === user.id ? 'text-orange-600 font-semibold' : (user.isUnread ? 'text-orange-600 font-semibold' : 'font-bold')">
                {{ user.user.username }}
              </span>
              <small class="text-gray-700 lowercase">{{ user.messages[user.messages.length - 1]?.content }}</small>
            </div>
            <div v-if="user.unreadCount > 0"
              class="ml-auto bg-orange-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center select-none">
              {{ user.unreadCount }}
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Chat area -->
    <section v-if="userActive !== null" class="flex-col flex-grow bg-[#f9fbfe]" :class="[width < 800 ? userActive ? 'flex w-full': 'hidden' : 'flex']">
      <!-- Chat header -->
      <header class="flex items-center justify-between p-3 border-b border-gray-300 select-none">
        <button v-if="width < 800" @click="handleDeleteActive" class="px-2"><ArrowLeft class="w-6 h-6" /></button>
        <div class="flex items-center space-x-3 w-full">
          <div class="w-12 h-12 rounded-full bg-emerald-700">
            <img :src="userActive.user.profile.profile_picture" :alt="userActive.user.username"
              class="w-full h-full object-cover rounded-full">
          </div>
          <div class="flex flex-col">
            <span class="font-bold text-lg">{{ userActive.user.username }}</span>
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
          <button aria-label="Call" class="hover:text-gray-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2 8.5v7a2 2 0 002 2h1.586a1 1 0 00.707-.293l2.707-2.707a1 1 0 011.414 0L12 16.414a1 1 0 001.414 0l2.707-2.707a1 1 0 011.414 0l1.172 1.172A2 2 0 0020 15.5v-7a2 2 0 00-2-2H4a2 2 0 00-2 2z" />
            </svg>
          </button>
          <button aria-label="Video Call" class="hover:text-gray-900 transition-colors">
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
          </button>
        </div>
      </header>

      <!-- Messages area -->
      <main ref="messageContainer" class="flex-grow p-6 overflow-y-auto space-y-4">
        <div v-for="(msg, index) in userActive.messages" :key="index"
          :class="['flex items-start gap-2', msg.sender_id === userActive.my_id ? 'justify-end space-x-reverse' : '']">
          <div>
            <div :class="[
              'inline-block rounded-2xl max-w-xs',
              msg.sender_id === userActive.my_id ? 'text-white bg-orange-500' : 'border border-gray-300 text-gray-700 bg-white'
            ]">
              <p class="pt-2 px-4">{{ msg.content }}</p>
              <div v-if="!msg.sended" class="flex px-2" :class="[msg.sender_id === userActive.my_id ? 'justify-end' : 'justify-start']"><Clock class="w-3 h-3" /></div>
              <div v-else class="flex px-2" :class="[msg.sender_id === userActive.my_id ? 'justify-end' : 'justify-start']"><Check class="w-3 h-3" /></div>
          </div>
          </div>
        </div>
      </main>

      <!-- Input area -->
      <footer class="p-3 border-t border-gray-300">
        <form @submit.prevent="sendMessage" class="flex items-center">
          <input v-model="message" type="text" placeholder="Type your message"
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
