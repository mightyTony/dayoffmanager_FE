<template>
  <v-app>
    <v-container>
      <v-navigation-drawer class="bg-grey-lighten-2" permanent>
        <v-list color="transparent">
          <v-list-item :prepend-avatar="isLoggedIn ? 'https://randomuser.me/api/portraits/women/81.jpg' : 'https://randomuser.me/api/portraits/lego/7.jpg'">
            <v-list-item-content>
              <!-- userName과 departmentName 결합하여 표시 -->
              <v-list-item-title>{{ userName }}</v-list-item-title>
              <v-list-item-subtitle v-text="isLoggedIn ? departmentName : '로그인 해주세요'"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard"></v-list-item>
          <v-list-item prepend-icon="mdi-account-box" title="Account"></v-list-item>
          <v-list-item v-if="isAdmin" prepend-icon="mdi-gavel" title="Admin"></v-list-item>
          <v-list-item v-if="isMaster" prepend-icon="mdi-crown" title="Master"></v-list-item>
        </v-list>

        <template v-if="isLoggedIn" v-slot:append>
          <div class="pa-2">
            <v-btn block @click="logout">Logout</v-btn>
          </div>
        </template>
        <template v-if="!isLoggedIn" v-slot:append>
          <div class="pa-2">
            <v-btn block @click="goToLogin">Login</v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <v-main scrollable permanent class="bg-blue pt-8">
        <router-view></router-view>
      </v-main>
    </v-container>
  </v-app>
</template>

<script setup>
import {computed, onMounted} from 'vue';
import { useUserStore } from './store/userStore.js';
import {useRouter} from "vue-router";
import apiClient from "./config/axios.js";

const userStore = useUserStore();
const router = useRouter();

const isAdmin = computed(()=> userStore.isAdmin);
const isMaster = computed(()=> userStore.isMaster);
const isLoggedIn = computed(() => userStore.isLoggedIn);
const userName = computed(() => userStore.userName);
const departmentName = computed(() => userStore.departmentName);

onMounted(async () => {
  await userStore.checkTokenExpirationAndRefreshToken();
  //console.log("갱신 필요한지 체크");
  //userStore.checkTokenExpiration(); // 페이지 로드 시 토큰 만료 확인, 만료 시 로그아웃
})
const logout = () => {
  userStore.logout();
};

// const handleLoginSuccess = () => {
//   // 로그인 성공 후 적절한 라우팅으로 대체해야 할 수 있습니다.
//   // 예: router.push('/dashboard');
// };
//
// const handleSignupSuccess = () => {
//   // 회원가입 성공 후 적절한 라우팅으로 대체해야 할 수 있습니다.
//   // 예: router.push('/login');
// };

// 로그인 페이지로 이동
const goToLogin = () => {
  router.push('/login');
};

// apiClient.interceptors.response.use(null, (error) => {
//   return error.response.use(null, userStore.refreshAccessTokenByRefreshToken);
// })



</script>


<style>
/* 추가 스타일이 필요한 경우 여기에 작성하세요 */
</style>
