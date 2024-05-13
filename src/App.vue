<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer class="bg-gray" theme="dark" permanent>
        <v-list color="transparent">
          <v-list-item
              lines="two"
              :prepend-avatar="isLoggedIn ? 'https://randomuser.me/api/portraits/women/81.jpg' : 'https://randomuser.me/api/portraits/lego/7.jpg'"
              :subtitle="isLoggedIn ? '로그인 중' : '로그인 해주세요' "
              :title="isLoggedIn ? 'Jane Smith' : 'Anonymous'"
          ></v-list-item>
          <v-list-item
              prepend-icon="mdi-view-dashboard"
              title="Dashboard"
          ></v-list-item>
          <v-list-item
              prepend-icon="mdi-account-box"
              title="Account"
          ></v-list-item>
          <v-list-item prepend-icon="mdi-gavel" title="Admin"></v-list-item>
        </v-list>

        <template v-if="isLoggedIn" v-slot:append>
          <div class="pa-2">
            <v-btn block @click="logout"> Logout </v-btn>
          </div>
        </template>
        <template v-else v-slot:append>
          <div class="pa-2">
            <v-btn block @click="showLoginForm = true"> Login </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <v-main style="height: 600px; width: 1200px;">
        <!-- 조건부 렌더링을 통해 로그인 폼을 표시 -->
        <div v-if="showLoginForm">
          <Login />
        </div>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import Login from './components/Login.vue'; // 로그인 컴포넌트 경로에 맞게 수정

const isLoggedIn = ref(false);
const showLoginForm = ref(false);

const logout = () => {
  // 로그아웃 처리 로직
  isLoggedIn.value = false;
};

const login = () => {
  // 로그인 처리 로직
  isLoggedIn.value = true;
  // 로그인 성공 후 로그인 폼 숨기기
  showLoginForm.value = false;
};
</script>
