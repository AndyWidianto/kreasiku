<script setup>
import { Edit, Save, X } from 'lucide-vue-next';
import { nextTick, onMounted, reactive, ref } from 'vue';
import UpdateProfilePresenter from '../../presenters/UpdateProfilePresenter';
import data from '../../models/data';
import { useRouter } from 'vue-router';
import Loading from '../components/loadings/Loading.vue';

const router = useRouter();
const user = ref();
const changeProfil = ref(null);
const image = ref(null);
const loading = ref();
const formData = reactive({
  username: '',
  name: '',
  description: '',
  address: '',
  gender: '',
  date_of_birth: '',
  profile_picture: ''
})
const presenter = new UpdateProfilePresenter({
  model: new data(),
  view: {
    loading: loading,
    router: router,
    user: user
  }
})
function handleChangeProfile(e) {
  const file = e.target.files[0];
  formData.profile_picture = URL.createObjectURL(file);
  image.value = file;
}
function handleBack() {
  if (confirm("Perubahan belum disimpan. Lanjutkan tanpa menyimpan?")) {
    router.push(`/profile/${user.value?.username}`);
  }
}
async function saveUpdate() {
  await presenter.updateProfile(formData, image.value);
}
onMounted(async () => {

  await presenter.getUser();
  await nextTick();
  const date = new Date(user.value?.profile.date_of_birth);
  formData.date_of_birth = date.toISOString().split("T")[0];
  formData.username = user.value?.username;
  formData.name = user.value?.profile.name;
  formData.description = user.value?.profile.description;
  formData.address = user.value?.profile.address;
  formData.gender = user.value?.profile.gender;
  formData.profile_picture = user.value?.profile.profile_picture;
})
</script>
<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="w-full p-2 py-4">
      <h2 class="text-3xl font-bold text-center pb-2">Update Profile</h2>
      <p class="text-center text-base">Kelola informasi akun dan foto profil Anda di sini.</p>
    </div>
    <div class="border w-full md:w-4/5 lg:w-3/5 bg-white border-gray-300 rounded-sm p-2 md:p-4">
      <div class="py-4"></div>
      <form @submit.prevent="saveUpdate" class="flex flex-col gap-2">
        <div class="flex flex-col items-center relative w-full">
          <label for="profile" class="font-semibold text-sm">Foto Profile</label>
          <input type="file" name="images" id="images" @change="handleChangeProfile" ref="changeProfil" hidden>
          <button type="button" @click="() => changeProfil.click()"
            class="relative rounded-full group transition-all duration-300">
            <img :src="formData.profile_picture || '/images/foto_default.jpg'" alt="profile"
              class="shadow-md object-cover w-50 h-50 rounded-full" />
            <div class="hidden group-hover:block absolute left-[40%] top-[40%] text-white">
              <Edit class="w-8 h-8" />
            </div>
          </button>
        </div>
        <div class="w-full p-1">
          <label for="username" class="font-semibold text-sm">username<span class="text-orange-500">*</span></label>
          <input type="text" name="username" id="username" v-model="formData.username" placeholder="masukan username"
            class="w-full p-2 border border-gray-300 rounded-md px-2">
          <span class="text-xs font-semibold">gunakan _ jika terdapat spasi*</span>
        </div>
        <div class="w-full">
          <label for="name" class="font-semibold text-sm">name<span class="text-orange-500">*</span></label>
          <input type="text" name="name" id="name" v-model="formData.name"
            placeholder="masukan nama paggilan atau nama panjang"
            class="w-full p-2 border border-gray-300 rounded-md px-2">
        </div>
        <div class="w-full">
          <label for="description" class="font-semibold text-sm">Description</label>
          <textarea name="description" id="description" v-model="formData.description"
            class="w-full h-30 border border-gray-300 rounded-md px-2">
          </textarea>
          <span class="text-xs font-semibold">ceritakan bakat atau pengalaman paling menarik menurutmu</span>
        </div>
        <div class="w-full">
          <label for="address" class="font-semibold text-sm">Address</label>
          <input type="text" name="address" id="address" v-model="formData.address" placeholder="alamat..."
            class="w-full p-2 border border-gray-300 rounded-md px-2">
        </div>
        <div class="w-full">
          <label for="address" class="font-semibold text-sm">Gender</label>
          <div class="flex items-center gap-5 w-full">
            <label>
              <input type="radio" name="gender" id="dender" v-model="formData.gender" class="p-2 px-2" value="man">
              Laki-Laki
            </label>
            <label>
              <input type="radio" name="gender" id="gender" v-model="formData.gender" class="p-2 px-2" value="woman">
              Perempuan
            </label>
            <label>
              <input type="radio" name="gender" id="gender" v-model="formData.gender" class="p-2 px-2" value="private">
              Prefer Not To say
            </label>
          </div>
        </div>
        <div class="w-full">
          <label for="date_of_birth" class="font-semibold text-sm">Date Of Birth</label>
          <input type="date" name="date_of_birth" v-model="formData.date_of_birth" id="date_of_birth"
            placeholder="alamat..." class="w-full p-2 border border-gray-300 rounded-md px-2">
        </div>
        <div class="flex items-center justify-end gap-3 py-4">
          <button type="button" @click="handleBack"
            class="p-2 px-5 border border-white hover:border-gray-200 hover:bg-gray-200 rounded-sm">Cancel</button>
          <button type="submit"
            class="p-2 px-5 border bg-orange-500 hover:bg-orange-600 rounded-sm text-white"
            :disabled="loading">
            <div v-if="!loading" class="flex items-center gap-2">
              <Save class="w-5 h-5" />Save
            </div>
            <div v-else class="flex items-center gap-2">
              <Loading :size="5" :borderSize="3" />
              update profile
            </div>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>