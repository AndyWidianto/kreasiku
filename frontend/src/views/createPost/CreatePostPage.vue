<script setup>
</script>
<template>
    <div class="flex justify-center p-3">
        <div class="w-2xl p-5 rounded-md bg-gray-100">
            <h2 class="w-full text-center text-2xl font-bold">Create Story</h2>
            <form @submit.prevent="props.createPosting">
                <div class="p-2">
                    <textarea name="content" id="content" class="px-2 p-1 w-full h-50 border-1 border-gray-400 rounded-md focus:outline focus:outline-orange-500"></textarea>
                    <span class="text-xs text-gray-700">Ceritakan semua yang ingin anda ceritakan</span>
                </div>
                <div class="flex items-center flex-wrap gap-2 p-2">
                    <div class="group relative w-20 h-20"  v-for="(image, index) in state.previewImages" @click="handleDeleteImage(index)" :key="index">
                        <img :src="image" alt="preview image" class="absolute left-0 top-0 w-full h-full rounded-md group-hover:brightness-80 border-1 border-gray-400">
                        <div class="absolute hidden group-hover:flex items-center justify-center h-full w-full"><Trash2 class="w-5 h-5 text-gray-100" /> </div>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <input type="file" name="image" id="image" ref="refImage" @change="handleChangeImage" multiple hidden>
                    <button type="button" @click="() => refImage.click()" class="flex items-center justify-center gap-1 w-60 border-1 border-orange-500 rounded-md p-2"><Camera class="w-5 h-5" /> Gambar</button>
                    <button type="submit" class="p-2 w-full border-1 border-gray-100 bg-orange-400 rounded-md text-gray-100">Create Story</button>
                </div>
            </form>
        </div>
    </div>
</template>
