<script setup>
import { Edit, Save, X } from 'lucide-vue-next';
import { onMounted, reactive, ref } from 'vue';

const props = defineProps({
  user: Object,
  handleUpdateProfile: Function
});
const changeProfil = ref(null);
const image = ref();
const rawDate = props.user?.profile.date_of_birth;
const formData = reactive({
  username: props.user?.username,
  name: props.user?.profile.name,
  description: props.user?.profile.description,
  address: props.user?.profile.address,
  gender: props.user?.profile.gender,
  date_of_birth: '',
  profile_picture: props.user?.profile.profile_picture
})
function handleChangeProfile(e) {
  const file = e.target.files[0];
  formData.profile_picture = URL.createObjectURL(file);
  image.value = file;
}
onMounted(() => {
  const date = new Date(rawDate);
  console.log(date.toISOString().split("T"));
  formData.date_of_birth = date.toISOString().split("T")[0];
})
</script>
<template>
  <div class="flex flex-col items-center justify-center w-full py-10">
    <div class="border w-full lg:w-4/5 bg-white border-gray-300 rounded-sm p-2 md:p-4">
      <div class="w-full relative">
        <button class="absolute right-0 z-5 font-semibold text-black" @click="props.handleUpdateProfile"><X class="w-6 h-6" /></button>
      </div>
      <div class="py-4"></div>
      <form class="flex flex-col gap-2">
        <div class="flex flex-col items-center relative w-full">
          <label for="profile">Foto Profile</label>
          <input type="file" name="images" id="images" @change="handleChangeProfile" ref="changeProfil" hidden>
          <div class="relative">
            <img :src="formData.profile_picture || '/images/book.jpg'" alt="profile" class="border border-gray-200 object-cover w-50 h-50 rounded-full"></img>
            <button type="button" @click="() => changeProfil.click()"
              class="flex items-center absolute font-semibold text-white bg-gray-800 bottom-0 right-15 rounded-md px-4">
              <Edit class="w-5 h-5" />edit
            </button>
          </div>
        </div>
        <div class="w-full p-1">
          <label for="username">username<span class="text-orange-500">*</span></label>
          <input type="text" name="username" id="username" v-model="formData.username" placeholder="masukan username"
            class="w-full p-2 border border-gray-300 rounded-md px-2">
          <span class="text-xs font-semibold">gunakan _ jika terdapat spasi*</span>
        </div>
        <div class="w-full">
          <label for="name">name<span class="text-orange-500">*</span></label>
          <input type="text" name="name" id="name" v-model="formData.name" placeholder="masukan nama paggilan atau nama panjang"
            class="w-full p-2 border border-gray-300 rounded-md px-2">
        </div>
        <div class="w-full">
          <label for="description">Description</label>
          <textarea name="description" id="description" v-model="formData.description" class="w-full h-30 border border-gray-300 rounded-md px-2">
          </textarea>
          <span class="text-xs font-semibold">ceritakan bakat atau pengalaman paling menarik menurutmu</span>
        </div>
        <div class="w-full">
          <label for="address">Address</label>
          <input type="text" name="address" id="address" v-model="formData.address" placeholder="alamat..."
            class="w-full p-2 border border-gray-300 rounded-md px-2">
        </div>
        <div class="w-full">
          <label for="address">Gender</label>
          <div class="flex items-center gap-5 w-full">
            <label>
              <input type="radio" name="gender" id="dender" v-model="formData.gender" class="p-2 px-2" value="man"> Laki-Laki
            </label>
            <label>
              <input type="radio" name="gender" id="gender" v-model="formData.gender" class="p-2 px-2" value="woman"> Perempuan
            </label>
            <label>
              <input type="radio" name="gender" id="gender" v-model="formData.gender" class="p-2 px-2" value="private"> Prefer Not To say
            </label>
          </div>
        </div>
        <div class="w-full">
          <label for="date_of_birth">Date Of Birth</label>
          <input type="date" name="date_of_birth" v-model="formData.date_of_birth" id="date_of_birth" placeholder="alamat..."
            class="w-full p-2 border border-gray-300 rounded-md px-2">
        </div>
        <div class="flex items-center justify-end gap-3 py-4">
          <button type="button"class="p-2 px-5 border border-white hover:border-gray-200 hover:bg-gray-200 rounded-sm">Cancel</button>
          <button type="submit" class="flex items-center p-2 px-5 border bg-orange-500 hover:bg-orange-600 rounded-sm text-white"><Save class="w-5 h-4" />Save</button>
        </div>
      </form>
    </div>
  </div>
</template>