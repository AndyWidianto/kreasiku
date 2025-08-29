# 🚀 Kreasiku

Kreasiku adalah platform interaktif yang saya kembangkan sebagai project pribadi untuk melatih kemampuan **Fullstack Development**. Aplikasi ini memiliki fitur **real-time communication** menggunakan **Socket.IO**.

---

## ✨ Fitur Utama

- 🔔 Notifikasi real-time  
- 💬 Pesan real-time (chat)  
- 👍 Like, Comment, & Share  
- 🔐 Autentikasi menggunakan **JWT & OAuth**

---

## ⚙️ Tech Stack

**Backend:**  
- Node.js
- Express.js
- JWT (jsonwebtoken)
- Sequelize ORM (MySQL)
- bcryptjs
- Oauth

**Frontend:**  
- Vue.js 3
- Vue Router
- Axios
- Tailwind CSS
- pinia
- indexedDB

---
## 📁 Project Structure

```bash
/backend
│
├── config/          # Konfigurasi database, JWT, atau env settings
│
├── controllers/     # Logika handler: terima request, validasi, panggil service/model, kirim response
│
├── middlewares/     # Middleware Express: auth JWT, error handler, logger, dll.
│
├── models/          # Definisi tabel Sequelize (User, Post, Comment, Like, Notification)
│
├── routes/          # Routing Express: mendefinisikan endpoint & menghubungkan ke controller
│
├── services/        # Logika bisnis murni: fungsi helper, query, atau proses yang dipanggil controller
│
├── public/          # File statis: gambar, file post image, dsb.
│
├── socket.js        # Konfigurasi Socket.IO: menangani event pesan & notifikasi real-time.
│
└── index.js         # Entry point: inisialisasi server Express, pasang middleware global, mount routes

/frontend
│
└── src/
     ├── models/        # Berisi definisi data & API handler
     ├── views/         # Komponen tampilan (page/screen)
     ├── presenters/    # Menghubungkan view & model (logika presentation)
     ├── router/        # Routing Vue (Vue Router)
     ├── stores/        # State management menggunakan Pinia (cache & global store)
     ├── until/         # Konfigurasi socket.io-client
     └── App.vue        # Root komponen Vue

```

## 🚀 Getting Started

### 1️⃣ Clone Repo

```bash
git clone https://github.com/yourusername/my-social-app.git
```

### 2️⃣ Enter Directory

```bash
cd frontend
cd backend
```

### 3️⃣ Setup Backend and Frontend

```bash
npm install
```

### 4️⃣ Start Backend and Frontend

```bash
npm run dev
```





