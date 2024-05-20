<template>
  <v-app>
    <v-navigation-drawer class="bg-gray" app permanent>
      <v-list color="transparent">
        <v-list-item
            lines="two"
            :prepend-avatar="isLoggedIn ? 'https://randomuser.me/api/portraits/women/81.jpg' : 'https://randomuser.me/api/portraits/lego/7.jpg'"
            :subtitle="isLoggedIn ? '로그인 중' : '로그인 해주세요'"
            :title="userName"
        ></v-list-item>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard"></v-list-item>
        <v-list-item prepend-icon="mdi-account-box" title="Account"></v-list-item>
        <v-list-item prepend-icon="mdi-gavel" title="Admin"></v-list-item>
      </v-list>

      <template v-if="isLoggedIn" v-slot:append>
        <div class="pa-2">
          <v-btn block @click="logout">Logout</v-btn>
        </div>
      </template>
      <template v-else v-slot:append>
        <div class="pa-2">
          <v-btn block @click="showLoginForm = true">Login</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main class="main-content">
      <v-container class="fill-height d-flex align-center justify-center">
        <div v-if="showLoginForm">
          <Login @login-success="handleLoginSuccess" />
        </div>
        <div v-else>
          <h1>Welcome to the Dashboard</h1>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed, ref } from 'vue';
import Login from './components/Login.vue';
import { useUserStore } from './store/userStore.js'; // 로그인 컴포넌트 경로에 맞게 수정

const userStore = useUserStore();

const isLoggedIn = computed(() => userStore.isLoggedIn);
const userName = computed(() => userStore.userName);
const showLoginForm = ref(true);

const logout = () => {
  userStore.logout();
};

const handleLoginSuccess = () => {
  showLoginForm.value = false;
};
</script>

<style scoped>
.main-content {
  height: 100vh;
  width: 100vw; /* 네비게이션 드로어의 너비만큼 뺀다 */
  max-width: calc(100vw - 256px);
  background: #535bf2;
}

.fill-height {
  height: 100%;
}

.right {
  padding-right: 0;
}
</style>
