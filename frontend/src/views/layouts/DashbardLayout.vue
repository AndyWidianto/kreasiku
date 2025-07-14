<template>
    <div class="grid grid-cols-[350px_1fr]">
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
<script setup>
import { onMounted, ref } from 'vue';
import data from '../../models/data';
import DashboardLayoutPresenter from '../../presenters/DashboardLayoutPresenter';
import NavbarDashboard from '../Navbar/NavbarDashboard.vue';
import NavbarLeftDashboard from '../Navbar/NavbarLeftDashboard.vue';
import { RouterView } from 'vue-router';

const user = ref(null);
const presenter = new DashboardLayoutPresenter({
    model: new data(),
    view: {
        user: (value) => user.value = value
    }
})
onMounted(() => {
    presenter.getUser();
})
</script>