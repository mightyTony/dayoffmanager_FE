<template>
  <v-app>
    <v-container>
      <v-navigation-drawer class="bg-grey-lighten-2" permanent>
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
            <v-btn block @click="showLogin">Login</v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <v-main scrollable permanent class="bg-blue pt-8">
        <div v-if="showLoginForm">
          <Login @login-success="handleLoginSuccess" @show-signup="handleShowSignup" />
        </div>
        <div v-else-if="showSignupForm">
          <SignUp @signup-success="handleSignupSuccess" @show-login="handleShowLogin" />
        </div>
        <div v-else>
          <h1>Welcome to the Dashboard</h1>
        </div>
      </v-main>
    </v-container>
  </v-app>
</template>

<script setup>
import { computed, ref } from 'vue';
import Login from './components/Login.vue';
import { useUserStore } from './store/userStore.js';
import SignUp from "./components/SignUp.vue";

const userStore = useUserStore();

const isLoggedIn = computed(() => userStore.isLoggedIn);
const userName = computed(() => userStore.userName);
const showLoginForm = ref(true);
const showSignupForm = ref(false);

const logout = () => {
  userStore.logout();
};

const handleLoginSuccess = () => {
  showLoginForm.value = false;
  showSignupForm.value = false;
};

const handleSignupSuccess = () => {
  showSignupForm.value = false;
  showLoginForm.value = true;
};

const handleShowSignup = () => {
  showLoginForm.value = false;
  showSignupForm.value = true;
};

const showLogin = () => {
  showLoginForm.value = true;
  showSignupForm.value = false;
};

const handleShowLogin = () => {
  showLoginForm.value = true;
  showSignupForm.value = false;
};
</script>

<style>
/* 추가 스타일이 필요한 경우 여기에 작성하세요 */
</style>
