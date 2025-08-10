<script setup>
import { LayoutDashboard, MessageCircle } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

const props = defineProps({
    width: Boolean
});
</script>
<template>
    <div class="p-0 m-0">
        <nav class="fixed top-0 left-0 bg-white h-full text-gray-800 transition-all duration-300 w-0 overflow-hidden md:overflow-none md:w-80">
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
                    <RouterLink to="/chat" v-slot="{ isExactActive }">
                        <div class="flex items-center gap-2 p-2 border-r-3"
                            :class="isExactActive ? 'border-orange-600 bg-orange-100 font-semibold text-orange-600' : 'border-transparent'">
                            <MessageCircle class="w-5 h-5" />Messages
                        </div>
                    </RouterLink>
                </li>
            </ul>
        </nav>
    </div>
</template>