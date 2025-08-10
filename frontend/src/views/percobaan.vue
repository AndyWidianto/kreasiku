<script setup>
import axios from "axios";
import { inject, onMounted, ref } from "vue";

const newMessage = ref();
const active = ref(false);
const messages = ref([
  "aku adalah",
  "aku aku",
  "ya ya yah"
]);
const socket = inject("socket");

function handleSubmit() {
  socket.emit("private_message", ({ id_target: 1, message: newMessage.value }));
  newMessage.value = '';
}
onMounted(() => {
  socket.on("connect_error", async (err) => {
    console.log(err);
    try {
      const res = await axios.get("http://localhost:3000/refreshToken", {
        withCredentials: true
      });
      console.log(res.data);
      localStorage.setItem("kreasiku", res.data.token);
      socket.connect();
    } catch (err) {
      console.log(err);
    }
  });
  socket.on("private_message", (data) => {
    messages.value = [...messages.value, data.message];
  });
})
</script>
<template>
  <div class="w-full">
    <h2 class="font-bold text-2xl" v-if="active">
        User sedang aktif nih
    </h2>
    <div class="h-100 overflow-scroll">
      <li class="" v-for="message in messages">{{ message }}</li>
    </div>
    <div class="">
      <form @submit.prevent="handleSubmit">
        <input type="text" name="" id="" v-model="newMessage" class="w-full p-2 border-1 border-gray-600">
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
</template>