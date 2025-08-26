<script setup>
import { KeepAlive, onMounted, ref } from 'vue';
import data from '../../models/data';
import DashboardLayoutPresenter from '../../presenters/DashboardLayoutPresenter';
import NavbarDashboard from '../Navbar/NavbarDashboard.vue';
import NavbarLeftDashboard from '../Navbar/NavbarLeftDashboard.vue';
import { RouterView, useRouter } from 'vue-router';

const user = ref(null);
const router = useRouter();
const presenter = new DashboardLayoutPresenter({
    model: new data(),
    view: {
        user: user,
        router: router
    }
})
onMounted(() => {
    presenter.getUser();
})
</script>
<template>
    <div class="grid transition-all duration-300 grid-cols-[0px_1fr] md:grid-cols-[350px_1fr]">
        <NavbarLeftDashboard />
        <div class="p-0 m-0">
            <header>
                <NavbarDashboard :user="user" />
            </header>
            <main class="pt-15 flex justify-center">
                <RouterView />
            </main> 
            <footer></footer>
        </div>
    </div>
</template>