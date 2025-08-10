<script setup>
const props = defineProps({
    size: Number,
    borderSize: Number 
})
</script>
<template>
    <div class="rounded-full border-r-0 border-t-transparent animate-spin" :class="[props.size ? `w-${props.size} h-${props.size}` : 'w-10 h-10', props.borderSize ? `border-${props.borderSize}` : 'border-3']"></div>
</template>