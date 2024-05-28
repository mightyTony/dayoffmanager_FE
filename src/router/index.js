// router/userStore.js 파일

import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import UserUpdate from "../components/UserUpdate.vue";
import SignUp from "../components/SignUp.vue";
import Home from "../components/Home.vue"; // 로그인 컴포넌트 경로에 맞게 수정

const routes = [
    // 다른 라우트 설정
    {
        path: '/',
        component: Home,
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
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
