<template>
  <button @click="open = !open">Toggle Box</button>

  <Transition name="slide">
    <div v-if="open" class="w-40 h-20 bg-blue-400 text-white flex items-center justify-center">
      Box
    </div>
  </Transition>
</template>

<script setup>
import { ref } from "vue"
const open = ref(false)
</script>

<style>
.slide-enter-active, .slide-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
