// router/userStore.js 파일

import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import UserUpdate from "../components/UserUpdate.vue";
import SignUp from "../components/SignUp.vue";
import Home from "../components/Home.vue";
import {useUserStore} from "../store/userStore.js";
import CompanyRegister from "../components/CompanyCheck.vue";
import CompanyEnroll from "../components/CompanyEnroll.vue"; // 로그인 컴포넌트 경로에 맞게 수정

const routes = [
    // 다른 라우트 설정
    // meta: { requiresAuth : true } 로그인 필요 시
    {
        path: '/',
        component: Home,
        meta: { auth : false }
    },
    {
        path: '/login',
        component: Login,
        meta: { auth : false }
    },
    {
        path: '/account/:userId',
        name: 'Account',
        component: UserUpdate,
        meta: { auth : true }, // 로그인 필요
        props: true // props로 userId 전달
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp,
        meta: { auth : false }
    },
    {
        path: '/register/company',
        name: 'CompanyEnroll',
        component: CompanyEnroll,
        meta: { auth: false }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 전역 전처리 가드
router.beforeEach((to, from, next) => {
    // pinia store
    const userStore = useUserStore();

    if(to.matched.some( record => record.meta.auth ) && !userStore.isLoggedIn) {
        next({ name : 'Login'})
    } else {
        next();
    }
})

export default router;
