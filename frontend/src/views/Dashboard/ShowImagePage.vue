<script setup>
import { ArrowLeft } from 'lucide-vue-next';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';

const props = defineProps({
    images: Array,
    goBack: Function,
    Name: String,
    start: Number,
    transformOrigin: String
});

</script>
<template>
    <div class="fixed h-full w-full top-0 left-0 bg-gray-900 text-white z-10">
        <div class="flex justify-start items-center gap-2 p-2">
            <button @click="props.goBack"><ArrowLeft class="w-10 h-10 text-white" /></button>
            <h2 class="text-xl font-semibold">{{ props.Name }}</h2>
        </div>
        <Swiper 
        :modules="[Pagination, Scrollbar, Navigation]"
        :slide-per-view="1" 
        :space-between="50" 
        :pagination="{ clickable: true }" 
        :scrollbar="{ draggable: true }"
        :initial-slide="props.start"
        :navigation="true"
        class="w-full h-full text-center">
            <SwiperSlide v-for="(image, index) in props.images" :key="image.image_id">
                <div class="flex items-center justify-center h-full" :style="{ transformOrigin: props.transformOrigin }">
                    <img :src="image.image" alt="image posting" class="w-150 max-h-120 object-cover">
                </div>
            </SwiperSlide>
        </Swiper>
    </div>
</template>