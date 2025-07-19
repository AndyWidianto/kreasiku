<template>
  <button @click="show = !show">Toggle</button>
  <Transition name="fade-slide">
    <div v-if="show" class="w-40 h-40 bg-blue-500 text-white flex items-center justify-center">
      Animated Box
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
const show = ref(true)
</script>

<style>
@keyframes fade-slide-in {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-slide-out {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.fade-slide-enter-active {
  animation: fade-slide-in 0.5s ease-out forwards;
}

.fade-slide-leave-active {
  animation: fade-slide-out 0.5s ease-in forwards;
}
</style>