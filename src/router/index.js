// router/userStore.js 파일

import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import UserUpdate from "../components/UserUpdate.vue";
import SignUp from "../components/SignUp.vue";
import Home from "../components/Home.vue";
import {useUserStore} from "../store/userStore.js";
import CompanyRegister from "../components/CompanyCheck.vue";
import CompanyEnroll from "../components/CompanyEnroll.vue";
import AdminDashboard from "../components/admin/AdminDashboard.vue";
import AdminApproveUser from "../components/admin/MemberEditModal.vue";
import AdminMemberList from "../components/admin/AdminMemberList.vue";
import DayOffEnroll from "../components/dayoff/DayOffEnroll.vue";


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
    {
        path: '/admin-dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { auth: true }
    },
    {
        path: '/approve-user/:userId',
        name: 'ApproveUser',
        component: AdminApproveUser,
        props: true,
        meta: { auth: true }
    },
    {
        path: '/employee-management',
        name: 'EmployeeManagement',
        component: AdminMemberList,
        meta: { auth: true },
        props: true
    },
    {
        path: '/dayOff-apply',
        name: 'DayOffApply',
        component: DayOffEnroll,
        meta: { auth: true },
    }
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
