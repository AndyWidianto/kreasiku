<script setup>
import { onMounted, ref } from 'vue';
import CreateCoverPresenter from '../../presenters/CreateCoverPresenter';
import data from '../../models/data';
import { ArrowLeft, ArrowRight, Camera, Save, Trash2 } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

const showImage = ref();
const image = ref();
const user = ref();
const loading =ref();

const Edit = ref();
const presenter = new CreateCoverPresenter({
    model: new data(),
    view: {
        user: user,
        loading: loading
    }
});
function handleSelectImage(e) {
    const file = e.target.files[0];
    showImage.value = URL.createObjectURL(file);
    image.value = file;
}
function deleteImage() {
    showImage.value = null;
    image.value = null;
}
async function SaveImageCover() {
    if (!image) return;
    await presenter.updateCover(user.value.profile.profile_id, image.value);
}
onMounted(() => {
    presenter.getUser();
})
</script>
<template>
    <div v-if="loading" class="flex items-center justify-center absolute w-full h-full z-10">
        <div class="rounded-full border-4 border-r-0 border-t-transparent border-white w-15 h-15 animate-spin"></div>
    </div>
    <div class="flex flex-col items-center h-screen pt-10" :class="[loading ? 'brightness-60' : '']">
        <div class="w-full pl-10 py-3">
            <RouterLink :to="`/profile/${user?.username}`"><ArrowLeft class="w-8 h-8" /></RouterLink>
        </div>
        <div class="w-4/5 h-100 bg-black">
            <img v-if="showImage" :src="showImage" alt="" class="w-full h-full object-cover">
            <img v-else :src="user?.profile.cover_picture ? user?.profile.cover_picture : '/images/book.jpg'" alt="" class="w-full h-full object-cover">
            <input type="file" @change="handleSelectImage" name="edit" id="edit" accept="image/*" ref="Edit" hidden>
            <div class="flex items-center justify-center gap-5 p-3">
                <button @click="deleteImage" class="text-gray-700"><Trash2 class="w-6 h-6" /></button>
                <button @click="() => Edit.click()" class="text-gray-700"><Camera class="w-6 h-6" /></button>
                <button @click="SaveImageCover" class="text-gray-700"><Save class="w-6 h-6" /> </button>
            </div>
        </div>
    </div>
</template>