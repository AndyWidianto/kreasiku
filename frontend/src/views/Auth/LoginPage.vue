<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import data from '../../models/data';
import LoginPresenter from '../../presenters/LoginPresenter';
import LoadingSpinner from '../components/loadings/LoadingSpinner.vue';

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
    <div class="flex items-center justify-center">
        <div class="w-2xl">
            <form @submit.prevent="Login">
                <div class="p-2">
                    <label for="username">Username</label>
                    <input type="text" v-model="state.username" name="username" id="username" class="w-full border-1 border-gray-300 p-2 rounded-md">
                </div>
                <div class="p-2">
                    <label for="password">Password</label>
                    <input type="password" v-model="state.password" name="password" id="password" class="w-full border-1 border-gray-300 p-2 rounded-md">
                </div>
                <button type="submit" class="flex items-center justify-center gap-2 w-full p-2 border-1 border-gray-100 bg-blue-400">
                    <LoadingSpinner v-if="state.loading" :LoadingSize="'6'" :hieghtContent="'6'" :widthContent="'6'" />
                    Login
                </button>
            </form>
        </div>
    </div>
</template>