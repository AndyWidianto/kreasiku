import { createRouter, createWebHistory } from "vue-router";
import DashbardLayout from "../views/layouts/DashbardLayout.vue";
import Messages from "../views/Messages/Messages.vue";
import Dashboard from "../views/Dashboard/Dashboard.vue";
import Profile from "../views/Profile/Profile.vue";
import CommentsDashboard from "../views/Dashboard/CommentsDashboard.vue";
import CreatePostPage from "../views/createPost/CreatePostPage.vue";
import LoginPage from "../views/Auth/LoginPage.vue";
import Percobaan from "../views/percobaan.vue";
import Register from "../views/Auth/Register.vue";

const routes = [
    {
        path: "/",
        component: DashbardLayout,
        children: [
            {
                path: "/",
                component: Dashboard
            },
            {
                path: "/messages",
                component: Messages
            },
            {
                path: "/profile/:username",
                component: Profile
            },
            {
                path: "/comments/:id",
                component: CommentsDashboard
            },
            {
                path: "/create-post",
                component: CreatePostPage
            }
        ]
    },
    {
        path: "/login",
        component: LoginPage
    },
    {
        path: "/register",
        component: Register
    },
    {
        path: "/percobaan",
        component: Percobaan
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;