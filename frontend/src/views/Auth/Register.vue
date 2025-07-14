<script setup>
import { User2, Hash } from 'lucide-vue-next';
</script>
<template>
    <div class="flex justify-center">
        <div class="flex justify-center w-full">
            <div class="px-5 w-110 bg-white shadow-md">
                <form class="w-full">
                    <h2 class="text-2xl font-semibold pb-20 pt-10 w-full text-center">Kreasiku</h2>
                    <h2 class="font-semibold text-xl">Welcome Back</h2>
                    <div class="p-2">
                        <label for="">username</label>
                        <div class="flex items-center relative w-full">
                            <div class="absolute left-2">
                                <User2 class="w-5 h-5 text-gray-600" />
                            </div>
                            <input type="text" name="" id="username"
                                class="w-full p-2 pl-8 border-1 border-gray-400 rounded-md">
                        </div>
                    </div>
                    <div class="p-2">
                        <label for="">password</label>
                        <div class="flex items-center relative w-full">
                            <div class="absolute left-2">
                                <Hash class="w-5 h-5 text-gray-600" />
                            </div>
                            <input type="password" name="" id="password"
                                class="w-full p-2 pl-8 border-1 border-gray-400 rounded-md">
                        </div>
                    </div>
                    <div class="pt-10 p-2">
                        <button type="submit" class="w-full p-2 bg-blue-700 text-gray-300 rounded-sm">Log In</button>
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