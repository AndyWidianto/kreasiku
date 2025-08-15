import { createRouter, createWebHistory } from "vue-router";
import DashbardLayout from "../views/layouts/DashbardLayout.vue";
import Dashboard from "../views/Dashboard/Dashboard.vue";
import Profile from "../views/Profile/Profile.vue";
import CommentsDashboard from "../views/Dashboard/CommentsDashboard.vue";
import LoginPage from "../views/Auth/LoginPage.vue";
import Percobaan from "../views/percobaan.vue";
import Register from "../views/Auth/Register.vue";
import CreateProfile from "../views/Profile/CreateProfile.vue";
import SearchPage from "../views/search/SearchPage.vue";
import ChatPage from "../views/Chats/ChatPage.vue";
import CreateCover from "../views/Profile/CreateCover.vue";
import NotificationPage from "../views/Notification/NotificationPage.vue";
import NotFollowingPage from "../views/Follow/NotFollowingPage.vue";
import FollowerPage from "../views/Follow/FollowerPage.vue";
import FollowingsPage from "../views/Follow/FollowingsPage.vue";


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
                path: "/profile/:username",
                component: Profile
            },
            {
                path: "/posting/:id",
                component: CommentsDashboard
            },
            {
                path: "/not/followers",
                component: NotFollowingPage
            },
            {
                path: "/followers/:username",
                component: FollowerPage
            },
            {
                path: "/followings/:username",
                component: FollowingsPage
            },
            {
                path: "/notifications",
                component: NotificationPage
            },
            {
                path: "/percobaan",
                component: Percobaan
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
        path: "/create/profile",
        component: CreateProfile
    },
    {
        path: "/search/:search",
        component: SearchPage
    },
    {
        path: "/chat",
        component: ChatPage
    },
    {
        path: "/edit/cover",
        component: CreateCover
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;