<script setup>
import { onMounted, ref } from 'vue';
import data from '../../models/data';
import { RouterLink } from 'vue-router';
import NotFollowingPresenter from '../../presenters/NotFollowingPresenter';


const followers = ref([]);
const loading = ref(false);
const presenter = new NotFollowingPresenter({
    model: new data(),
    view: {
        followers: followers,
        loading: loading
    }
});
function handleActionFollow(id) {
    presenter.handleActionFollow(id, followers.value);
}
onMounted(async () => {
    await presenter.getFollowersNotFollowing();
})
</script>
<template>
    <div class="w-full mx-auto p-4">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-800">Aplikasi Media Sosial</h1>
            <p class="text-gray-600">Kelola koneksi dan temukan teman baru</p>
        </div>

        <!-- Bagian Permintaan Pertemanan -->
        <div class="mb-12">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-semibold text-gray-700">Followers</h2>
                <span class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">3 baru</span>
            </div>

            <div class="divider mb-6"></div>

            <div class="grid gap-4">
                <div v-for="follower in followers"
                    class="friend-card bg-white rounded-lg p-4 shadow transition-all duration-300 ease-in-out flex items-center">
                    <img :src="follower.follower.profile.profile_picture || '/images/book.jpg'"
                        alt="Profil wanita asia usia 20-an dengan senyum ramah, mengenakan kemeja denim, background biru muda"
                        class="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover mr-4">
                    <RouterLink :to="`/profile/${follower.follower.username}`" class="flex-1">
                        <h3 class="font-medium text-gray-800">{{ follower?.follower.profile.name }}</h3>
                        <p class="text-sm text-gray-500">{{ follower?.follower.username }}</p>
                    </RouterLink>
                    <div class="flex space-x-2">
                        <button @click="handleActionFollow(follower.id)"
                            class="px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base transition" :class="[follower.folback ? 'bg-white hover:bg-gray-200 text-gray-800 border border-orange-100' : 'bg-orange-600 hover:bg-orange-700 text-white']">
                            {{ !follower.folback ? 'Follback' : 'Unfollow' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bagian Saran Pertemanan -->
        <!-- <div>
            <h2 class="text-2xl font-semibold text-gray-700 mb-4">Orang yang Mungkin Anda Kenal</h2>

            <div class="divider mb-6"></div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="friend-card bg-white rounded-lg p-4 shadow transition-all duration-300 ease-in-out">
                    <div class="flex items-center mb-3">
                        <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/311532ff-3b12-43e1-b658-521a1bc8fb78.png"
                            alt="Profil pria setengah baya berambut pendek dengan senyum hangat, mengenakan kemeja kotak-kotak merah, background kayu"
                            class="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover mr-4">
                        <div>
                            <h3 class="font-medium text-gray-800">Budi Santoso</h3>
                            <p class="text-sm text-gray-500">12 teman bersama</p>
                        </div>
                    </div>
                    <button class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        Tambah Teman
                    </button>
                </div>

                <div class="friend-card bg-white rounded-lg p-4 shadow transition-all duration-300 ease-in-out">
                    <div class="flex items-center mb-3">
                        <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3e20f989-1a0d-4bb4-a1d4-4a33c90542b5.png"
                            alt="Profil wanita asia muda dengan rambut ikal panjang, mengenakan sweter oversized putih, background kota malam hari"
                            class="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover mr-4">
                        <div>
                            <h3 class="font-medium text-gray-800">Lisa Anggraeni</h3>
                            <p class="text-sm text-gray-500">5 teman bersama</p>
                        </div>
                    </div>
                    <button class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        Tambah Teman
                    </button>
                </div>

                <div class="friend-card bg-white rounded-lg p-4 shadow transition-all duration-300 ease-in-out">
                    <div class="flex items-center mb-3">
                        <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/1a720949-c93a-4fe4-8738-59fd1ececf54.png"
                            alt="Profil pria muda berambut keriting dengan senyum lebar, mengenakan jaket kulit hitam, background jalan kota"
                            class="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover mr-4">
                        <div>
                            <h3 class="font-medium text-gray-800">Riko Chandra</h3>
                            <p class="text-sm text-gray-500">8 teman bersama</p>
                        </div>
                    </div>
                    <button class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        Tambah Teman
                    </button>
                </div>

                <div class="friend-card bg-white rounded-lg p-4 shadow transition-all duration-300 ease-in-out">
                    <div class="flex items-center mb-3">
                        <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b2d8288a-7e19-4091-9a7b-42af6c360619.png"
                            alt="Profil wanita paruh baya dengan rambut pendek rapi, mengenakan kacamata dan blazer biru, background perpustakaan"
                            class="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover mr-4">
                        <div>
                            <h3 class="font-medium text-gray-800">Dewi Kurnia</h3>
                            <p class="text-sm text-gray-500">3 teman bersama</p>
                        </div>
                    </div>
                    <button class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        Tambah Teman
                    </button>
                </div>
            </div>
        </div> -->
    </div>
</template>
