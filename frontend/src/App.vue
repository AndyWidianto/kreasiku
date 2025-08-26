<script setup>
import { inject, nextTick, onMounted, ref } from 'vue';
import { RouterView } from 'vue-router';
import AppPresenter from './presenters/AppPresenter';
import data from './models/data';

const socket = inject("socket");
const secret = ref('');
const presenter = new AppPresenter({
  model: new data(),
  view: {
    secret: secret
  }
})
async function handleMessageSended(data) {
  console.log(data);
  presenter.handleMessageSended(data);
}
async function handlePrivateMessage(data) {
  await nextTick(() => {
    presenter.handlePrivateMessage(data, secret.value);
  })
}
async function handlePrivateMessages(datas) {
  await nextTick(() => {
    presenter.handlePrivateMessages(datas, secret.value);
  })
}
function handlePrivateMessagesRead(data) {
  console.log(data);
  presenter.handlePrivateMessagesRead(data);
}
function handleMessagesSended(data) {
  presenter.handleMessagesSended(data);
}
onMounted(() => {
  presenter.getSecret();
  socket.on("message_sended", handleMessageSended);
  socket.on("messages_sended", handleMessagesSended);
  socket.on("private_message", handlePrivateMessage);
  socket.on("private_messages", handlePrivateMessages);
  socket.on("private_message_read", handlePrivateMessagesRead);
})
</script>

<template>
  <RouterView />
</template>
