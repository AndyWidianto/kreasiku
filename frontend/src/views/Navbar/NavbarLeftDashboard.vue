<template>
    <div class="p-0 m-0">
        <nav class="fixed top-0 left-0 w-80 bg-white h-full text-gray-800">
            <ul class="">
                <li>
                    <div class="flex items-center justify-center text-gray-800 h-30 w-full text-orange-800">
                        <LayoutDashboard :size="40" />
                    </div>
                </li>
                <li>
                    <RouterLink to="/" v-slot="{ isExactActive }">
                        <div class="flex items-center gap-2 p-2 border-r-3"
                            :class="isExactActive ? 'border-orange-600 bg-orange-100 font-semibold text-orange-600' : 'border-transparent'">
                            <LayoutDashboard class="w-5 h-5" />Dashboard
                        </div>
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/messages" v-slot="{ isExactActive }">
                        <div class="flex items-center gap-2 p-2 border-r-3"
                            :class="isExactActive ? 'border-orange-600 bg-orange-100 font-semibold text-orange-600' : 'border-transparent'">
                            <MessageCircle class="w-5 h-5" />Messages
                        </div>
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/create-post" v-slot="{ isExactActive }">
                        <div class="flex items-center gap-2 p-2 border-r-3"
                            :class="isExactActive ? 'border-orange-600 bg-orange-100 font-semibold text-orange-600' : 'border-transparent'">
                            <Grid2X2Plus class="w-5 h-5" />Create Post
                        </div>
                    </RouterLink>
                </li>
            </ul>
        </nav>
    </div>
</template>
<script setup>
import { Grid2X2Plus, LayoutDashboard, MessageCircle } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

</script>