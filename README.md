# 🚀 Kreasiku

A simple fullstack social media app built with **Express.js** (Backend) and **Vue.js** (Frontend).  
Features include **JWT authentication**, **create post**, **like**, **comment**, **share**, and **notifications**.

---

## ✨ Features

✅ **User Authentication**
- Register & Login with JWT
- Secure routes with token validation

✅ **Posts**
- Create Post
- Read All Posts
- Read Single Post
- Delete Own Post

✅ **Likes**
- Like/Unlike Post
- Get Like Count per Post

✅ **Comments**
- Add Comment to Post
- Get Comments for a Post
- Delete Own Comment

✅ **Share**
- Share an existing post to your timeline

✅ **Notifications**
- Receive notification when:
  - Someone likes your post
  - Someone comments on your post
  - Someone shares your post
- Mark notifications as read/unread

---

## ⚙️ Tech Stack

**Backend:**  
- Node.js
- Express.js
- JWT (jsonwebtoken)
- Sequelize ORM (MySQL/PostgreSQL)
- bcryptjs

**Frontend:**  
- Vue.js 3
- Vue Router
- Axios
- Tailwind CSS

---
## 📁 Project Structure

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
├── public/          # File statis: misal upload gambar, file post image, dsb.
│
└── index.js         # Entry point: inisialisasi server Express, pasang middleware global, mount routes

/frontend
│
└── src/
     ├── models/        # Berisi definisi data & API handler
     ├── views/         # Komponen tampilan (page/screen)
     ├── presenters/    # Menghubungkan view & model (logika presentation)
     ├── router/        # Routing Vue (Vue Router)
     └── App.vue        # Root komponen Vue

---

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





