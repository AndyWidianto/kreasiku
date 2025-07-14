<script setup>
const props = defineProps({
    hieghtContent: String,
    widthContent: String,
    LoadingSize: String
});
</script>
<template>
    <div class="flex items-center justify-center animate-spin" :class="[props.hieghtContent && props.widthContent ? `w-${props.widthContent} h-${props.hieghtContent}` : 'w-100 h-100']">
        <div class="rounded-full border-3 border-r-0 border-t-transparent border-black" :class="[ props.LoadingSize ? `w-${props.LoadingSize} h-${props.LoadingSize}` : 'w-15 h-15']"></div>
    </div>
</template>