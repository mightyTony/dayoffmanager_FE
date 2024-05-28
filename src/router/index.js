// router/userStore.js 파일

import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import App from "../App.vue";
import UserUpdate from "../components/UserUpdate.vue"; // 로그인 컴포넌트 경로에 맞게 수정

const routes = [
    // 다른 라우트 설정
    {
        path: '/',
        component: App,
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/setting',
        name: 'Setting',
        component: UserUpdate
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
