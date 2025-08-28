<script setup>
import { inject, nextTick, onMounted, ref } from 'vue';
import { RouterView } from 'vue-router';
import AppPresenter from './presenters/AppPresenter';
import data from './models/data';
import { useConverstationStore } from './stores/converstationStore';

const socket = inject("socket");
const converstationStore = useConverstationStore();
const presenter = new AppPresenter({
  model: new data()
})
async function handleMessageSended(data) {
  presenter.handleMessageSended(data);
}
async function handlePrivateMessage(data) {
  if (!converstationStore.secret) {
    await converstationStore.getSecret();
  }
  if (converstationStore.converstations) {
    converstationStore.converstations = converstationStore.converstations.map(converstation => {
      if (converstation.id === data.message.converstation_id) {
        converstation.last_message = data.message;
        converstation.unread_count = converstation.unread_count + 1;
      }
      return { ...converstation };
    })
  }
  await nextTick(() => {
    presenter.handlePrivateMessage(data, converstationStore.secret);
  })
}
async function handlePrivateMessages(datas) {
  if (!converstationStore.secret) {
    await converstationStore.getSecret();
  }
  presenter.handlePrivateMessages(datas, converstationStore.secret);
}
function handlePrivateMessagesRead(data) {
  presenter.handlePrivateMessagesRead(data);
}
function handleMessagesSended(data) {
  presenter.handleMessagesSended(data);
}
onMounted(() => {
  socket.on("message_sended", handleMessageSended);
  socket.on("messages_sended", handleMessagesSended);
  socket.on("private_message", handlePrivateMessage);
  socket.on("private_messages", handlePrivateMessages);
  socket.on("private_message_unread", handlePrivateMessagesRead);
})
</script>

<template>
  <RouterView />
</template>
