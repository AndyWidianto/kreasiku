<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import data from '../../models/data';
import LoginPresenter from '../../presenters/LoginPresenter';
import LoadingSpinner from '../components/loadings/LoadingSpinner.vue';
import { Hash, Lock, LockOpen, User2 } from 'lucide-vue-next';

const state = reactive({
    username: '',
    password: '',
    loading: false
});
const navigate = useRouter();

const presenter = new LoginPresenter({
    model: new data(),
    view: {
        loading: (value) => state.loading = value,
        navigate: navigate
    }
})
async function Login() {
    console.log("Username", state.username);
    console.log("Password", state.password);
    await presenter.Login(state.username, state.password);
}
</script>
<template>
    <div class="flex justify-center">
        <div class="flex justify-center w-full">
            <div class="px-5 w-110 bg-white shadow-md">
                <form @submit.prevent="Login" class="w-full">
                    <h2 class="text-2xl font-semibold pb-20 pt-10 w-full text-center">Kreasiku</h2>
                    <h2 class="font-semibold text-xl">Welcome Back</h2>
                    <div class="p-2">
                        <label for="">username</label>
                        <div class="flex items-center relative w-full">
                            <div class="absolute left-2">
                                <User2 class="w-5 h-5 text-gray-600" />
                            </div>
                            <input type="text" name="username" id="username" v-model="state.username"
                                class="w-full p-2 pl-8 border-1 border-gray-400 rounded-md">
                        </div>
                    </div>
                    <div class="p-2">
                        <label for="">password</label>
                        <div class="flex items-center relative w-full">
                            <div class="absolute left-2">
                                <Hash class="w-5 h-5 text-gray-600" />
                            </div>
                            <input :type="lockPassword ? 'password' : 'text'" v-model="state.password" name="password" id="password"
                                class="w-full p-2 pl-8 border-1 border-gray-400 rounded-md">
                            <div class="absolute right-0 px-2" @click="() => lockPassword = !lockPassword">
                                <Lock v-if="lockPassword" class="w-5 h-5 text-gray-800" />
                                <LockOpen v-else class="w-5 h-5 text-gray-800" />
                            </div>
                        </div>
                    </div>
                    <div class="pt-10 p-2">
                        <button type="submit" class="flex items-center justify-center gap-2 w-full p-2 bg-blue-700 text-gray-300 rounded-sm">
                            <LoadingSpinner v-if="state.loading" :LoadingSize="'6'" :hieghtContent="'6'" :widthContent="'6'" />
                            Log In
                        </button>
                    </div>
                    <p class="w-full text-gray-500 py-1 text-center">or</p>
                </form>
                <div class="flex justify-center gap-4">
                    <button class="flex justify-center items-center w-11 h-11 border-1 border-gray-300 text-gray-300 rounded-full">
                        <img src="/images/logo_google.png" alt="" class="w-8 h-8 object-cover">
                    </button>
                </div>
            </div>
            <div class="w-1/2 h-150">
                <img src="/images/logo_hobi2.jpg" alt="" class="w-full h-full object-cover shadow-sm">
            </div>
        </div>
    </div>
</template>