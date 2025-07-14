<script setup>
</script>
<template>
    <div class="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Profil Pengguna -->
        <div class="flex items-center p-4 border-b">
            <img src="/images/tuanCrabs.jpeg" alt="Foto Profil" class="w-12 h-12 rounded-full mr-3">
            <div>
                <h2 class="font-semibold text-lg">Nama Pengguna</h2>
                <p class="text-gray-500 text-sm">Tanggal/Timestamp Post</p>
            </div>
        </div>

        <!-- Konten Utama -->
        <div class="p-4">
            <h3 class="font-bold text-xl mb-2">Judul Postingan</h3>
            <p class="text-gray-700 mb-4">Deskripsi atau isi postingan yang lebih panjang dapat ditulis di sini.</p>
            <img src="/images/tuanCrabs.jpeg" alt="Gambar Postingan" class="w-full rounded-lg">
        </div>

        <!-- Bagian Interaksi -->
        <div class="flex justify-between items-center p-4 border-t">
            <button class="flex items-center text-blue-500">
                👍 <span class="ml-1">Jumlah Like</span>
            </button>
            <button class="flex items-center text-blue-500">
                💬 <span class="ml-1">Jumlah Komentar</span>
            </button>
            <button class="text-blue-500">🔄 Share</button>
        </div>

        <!-- Bagian Komentar -->
        <div class="p-4 border-t">
            <h4 class="font-semibold mb-2">Komentar:</h4>
            <div class="mb-4">
                <div class="flex justify-between mb-2">
                    <span class="font-semibold">Nama Komentator</span>
                    <span class="text-gray-500 text-sm">Waktu Komentar</span>
                </div>
                <p class="text-gray-700">Isi komentar singkat di sini.</p>
            </div>
            <!-- Tambahkan komentar baru -->
            <div class="flex">
                <input type="text" placeholder="Tulis komentar..." class="flex-1 border rounded-lg p-2 mr-2">
                <button class="bg-blue-500 text-white rounded-lg px-4">Kirim</button>
            </div>
        </div>
    </div>
</template>