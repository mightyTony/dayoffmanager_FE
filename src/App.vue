<template>
  <v-app>
    <v-container>
      <v-navigation-drawer class="bg-green-accent-3" permanent>
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

      <v-main scrollable permanent class="bg-blue" >
          <div v-if="showLoginForm">
            <Login @login-success="handleLoginSuccess" />
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

const userStore = useUserStore();

const isLoggedIn = computed(() => userStore.isLoggedIn);
const userName = computed(() => userStore.userName);
const showLoginForm = computed(() => !userStore.isLoggedIn);

const logout = () => {
  userStore.logout();
};

const handleLoginSuccess = () => {
  showLoginForm.value = false;
};
</script>

<style>

</style>