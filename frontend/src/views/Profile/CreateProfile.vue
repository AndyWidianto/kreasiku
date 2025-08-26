<script setup>
import { Camera } from 'lucide-vue-next';
import { onMounted, reactive, ref } from 'vue';
import CreateProfilePresenter from '../../presenters/createProfilePresenter';
import data from '../../models/data';
import { useRouter } from 'vue-router';
import LoadingSpinner from '../components/loadings/LoadingSpinner.vue';

const changeProfile = ref();
const loading = ref(false);
const user = ref({});
const state = reactive({
    previewProfile: '',
    previewCover: '',
    Pagnation: 1,
    MaxPagnation: 4,
});

const name = ref('');
const image = ref();
const router = useRouter();
const formData = reactive({
    description: '',
    gender: '',
    date_of_birth: '',
    address: ''
});
const presenter = new CreateProfilePresenter({
    model: new data(),
    view: {
        loading: loading,
        user: user,
        name: name,
        router: router
    }
})

function ChangeProfile(e) {
    const file = e.target.files[0];
    state.previewProfile = URL.createObjectURL(file);
    image.value = file;
}
function handlePlusPagnation() {
    if (state.Pagnation > state.MaxPagnation) state.Pagnation = 1;
    state.Pagnation += 1;
}
function CreateProfile() {
    presenter.CreateProfile(formData, image.value);
}
onMounted(() => {
    presenter.getUser();
})
</script>
<template>
    <Transition name="fade-slide">
        <div v-if="state.Pagnation === 1" class="flex flex-col items-center justify-center gap-6 h-screen w-full absolute">
            <input type="file" name="profile" id="profile" @change="ChangeProfile" ref="changeProfile" hidden>
            <div class="flex flex-col items-center justify-center w-xl gap-1">
                <h2 class="text-lg text-center font-bold">Foto Profile</h2>
                <button @click="() => changeProfile.click()" class="w-50 h-50 rounded-full border-1 relative">
                    <img :src="state.previewProfile !== '' ? state.previewProfile : '/images/foto_default.jpg'" alt=""
                        class="w-full h-full object-cover rounded-full">
                    <div class="absolute bottom-0 right-5 p-1 px-3 border-1 rounded-md bg-gray-100 border-gray-300">
                        <Camera class="w-5 h-5 text-gray-700" />
                    </div>
                </button>
                <div class="w-full p-2">
                    <label for="name">your Name</label>
                    <input type="text" name="name" id="name" v-model="formData.name" class="p-2 rounded-md border-1 border-gray-300 w-full">
                </div>
                <div class="w-full p-2">
                    <label for="description">description</label>
                    <textarea name="description" id="description" v-model="formData.description" class="w-full h-30 rounded-md border-1 border-gray-300"></textarea>
                </div>
            </div>
            <button @click="handlePlusPagnation"
                class="px-3 p-1 rounded-md font-semibold border-1 border-gray-100 bg-blue-500 text-gray-100">next</button>
        </div>
        <div v-else-if="state.Pagnation === 2" class="flex flex-col items-center justify-center gap-10 h-screen w-full absolute">
            <div class="p-2 w-sm">
                <select name="gender" id="gender" v-model="formData.gender" class="w-full p-2 px-4 rounded-md border-1 border-gray-300">
                    <option value="" selected>Gender</option>
                    <option value="men">Man</option>
                    <option value="woman">Woman</option>
                    <option value="private">Private</option>
                </select>
            </div>
            <button @click="handlePlusPagnation"
                class="px-3 p-1 rounded-md font-semibold border-1 border-gray-100 bg-blue-500 text-gray-100">next</button>
        </div>
        <div v-else-if="state.Pagnation === 3" class="flex flex-col items-center justify-center gap-2 h-screen w-full absolute">
            <div class="w-xl flex flex-col justify-center">
                <div class="p-2">
                    <label for="tanggal lahir">Tanggal Lahir</label>
                    <input type="date" name="date_of_birth" id="date_of_birth" v-model="formData.date_of_birth" class="w-full p-2 rounded-md border-1 border-gray-300">
                </div>
                <div class="p-2">
                    <label for="tanggal lahir">Address</label>
                    <textarea name="address" id="address" v-model="formData.address" class="w-full h-40 rounded-md border-1 border-gray-300"></textarea>
                </div>
            <button @click="CreateProfile"
                class="px-3 p-2 rounded-md font-semibold border-1 border-gray-100 bg-blue-500 text-gray-100">
                <LoadingSpinner v-if="loading" :LoadingSize="'6'" :hieghtContent="'6'" :widthContent="'6'" />
                Create Profile
            </button>
            </div>
        </div>
    </Transition>
</template>
<style>
@keyframes fade-slide-in {
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0%);
    }
}
@keyframes fade-slide-out {
    to {
        transform: translateX(-100%);
    }
}
</style>