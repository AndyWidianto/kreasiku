<template>
  <div class="gallery">
    <!-- Thumbnail -->
    <img
      src="/images/book.jpg"
      class="thumb"
      @click="open($event)"
    />

    <!-- Overlay preview -->
    <Transition name="zoom">
      <div v-if="show" class="overlay" @click="close">
        <img
          ref="preview"
          src="/images/book.jpg"
          class="preview"
          :style="previewStyle"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from "vue";

const show = ref(false);
const previewStyle = ref({});
const preview = ref(null);

function open(e) {
  const rect = e.target.getBoundingClientRect();

  // hitung posisi awal sesuai thumbnail
  previewStyle.value = {
    position: "fixed",
    top: rect.top + "px",
    left: rect.left + "px",
    width: rect.width + "px",
    height: rect.height + "px",
    transform: "translate(0,0) scale(1)",
    transition: "all 0.3s ease"
  };

  show.value = true;

  // next tick → animasikan ke tengah
  requestAnimationFrame(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const targetSize = 500; // ukuran akhir preview

    previewStyle.value = {
      position: "fixed",
      top: vh / 2 - targetSize / 2 + "px",
      left: vw / 2 - targetSize / 2 + "px",
      width: targetSize + "px",
      height: targetSize + "px",
      transform: "translate(0,0) scale(1)",
      transition: "all 0.3s ease"
    };
  });
}

function close() {
  show.value = false;
}
</script>

<style>
.gallery {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.thumb {
  cursor: pointer;
  border-radius: 6px;
  width: 40px;
  height: 40px;
}
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
}
.preview {
  border-radius: 10px;
  object-fit: cover;
}
</style>
