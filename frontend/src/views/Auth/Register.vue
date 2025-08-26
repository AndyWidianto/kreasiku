<script setup>
import { User2, Hash, LockOpen, Lock } from 'lucide-vue-next';
import { reactive, ref } from 'vue';
import RegisterPresenter from '../../presenters/RegisterPresenter';
import data from '../../models/data';
import LoadingSpinner from '../components/loadings/LoadingSpinner.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const lockPassword = ref(true);
const formData = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
});
const message = ref('');
const loading = ref(false);
const presenter = new RegisterPresenter({
    model: new data(),
    view: {
        loading: loading,
        message: message,
        router: router
    }
})
function Register() {
    console.log(formData);
    presenter.Register(formData.username, formData.email, formData.password, formData.confirmPassword);
}
function handleAuthGoogle() {
    window.location.href = 'http://localhost:3000/auth/google';
}
</script>
<template>
    <div class="flex justify-center">
        <div class="flex justify-center w-full">
            <div class="px-5 w-110 pb-8 md:pb-6 bg-white shadow-md">
                <form @submit.prevent="Register" class="w-full">
                    <h2 class="text-2xl font-semibold py-5 w-full text-center">Create Account</h2>
                    <div class="p-2">
                        <label for="username">username</label>
                        <div class="flex items-center relative w-full">
                            <div class="absolute left-2">
                                <User2 class="w-5 h-5 text-gray-600" />
                            </div>
                            <input type="text" name="username" id="username" v-model="formData.username" placeholder="syarah latunisa"
                                class="w-full p-2 pl-8 border-1 border-gray-400 rounded-md">
                        </div>
                    </div>
                    <div class="p-2">
                        <label for="email">email</label>
                        <div class="flex items-center relative w-full">
                            <div class="absolute left-2">
                                <User2 class="w-5 h-5 text-gray-600" />
                            </div>
                            <input type="email" name="email" id="email" v-model="formData.email" placeholder="syarah@gmail.com"
                                class="w-full p-2 pl-8 border-1 border-gray-400 rounded-md">
                        </div>
                    </div>
                    <div class="p-2">
                        <label for="password">password</label>
                        <div class="flex items-center relative w-full">
                            <input :type="lockPassword ? 'password' : 'text'" name="" id="password" v-model="formData.password"
                                class="w-full p-2 border-1 border-gray-400 rounded-md">
                            <div class="absolute right-0 px-2" @click="() => lockPassword = !lockPassword">
                                <Lock v-if="lockPassword" class="w-5 h-5 text-gray-800" />
                                <LockOpen v-else class="w-5 h-5 text-gray-800" />
                            </div>
                        </div>
                    </div>
                    <div class="p-2">
                        <label for="confirm_password">confirm password</label>
                        <div class="flex items-center relative w-full">
                            <input :type="lockPassword ? 'password' : 'text'" name="confirmPassword" id="confirmPassword" v-model="formData.confirmPassword"
                                class="w-full p-2 border-1 border-gray-400 rounded-md">
                            <div class="absolute right-0 px-2" @click="() => lockPassword = !lockPassword">
                                <Lock v-if="lockPassword" class="w-5 h-5 text-gray-800" />
                                <LockOpen v-else class="w-5 h-5 text-gray-800" />
                            </div>
                        </div>
                        <div class="px-2 text-xs font-semibold text-red-600">{{ message }}</div>
                    </div>
                    <div class="p-2">
                        <button type="submit" class="flex items-center justify-center gap-2 w-full p-2 bg-blue-700 text-gray-200 rounded-sm">
                            <LoadingSpinner v-if="loading" :LoadingSize="'6'" :hieghtContent="'6'" :widthContent="'6'" :color="'white'" />
                            Create Account
                        </button>
                    </div>
                    <p class="w-full text-gray-500 py-1 text-center">or</p>
                </form>
                <div class="flex justify-center gap-4">
                    <button @click="handleAuthGoogle" class="flex justify-center items-center w-11 h-11 border-1 border-gray-300 text-gray-300 rounded-full">
                        <img src="/images/logo_google.png" alt="" class="w-8 h-8 object-cover">
                    </button>
                </div>
                <div class="text-center mt-4">
                    <span>if have account <RouterLink to="/login" class="text-blue-500 hover:underline">login</RouterLink></span>
                </div>
            </div>
            <div class="hidden md:block w-1/2 h-150">
                <img src="/images/logo_hobi2.jpg" alt="" class="w-full h-full object-cover shadow-sm">
            </div>
        </div>
    </div>
</template>