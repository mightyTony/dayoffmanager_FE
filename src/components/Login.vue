<template>
  <div>
    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <div class="text-subtitle-1 text-medium-emphasis">로그인</div>
      <v-text-field
          v-model="userId"
          dense
          placeholder="아이디 입력"
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
      ></v-text-field>
      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        비밀번호
        <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer" target="_blank">
          비밀번호를 잊어버리셨나요?
        </a>
      </div>
      <v-text-field
          v-model="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          dense
          placeholder="비밀번호 입력"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="toggleVisibility"
      ></v-text-field>
      <v-card class="mb-12" color="surface-variant" variant="tonal">
        <v-card-text class="text-medium-emphasis text-caption">
          경고: 연속 3회 실패한 경우 계정이 3시간 동안 임시로 잠깁니다. 지금 로그인해야하는 경우 "비밀번호를 잊어버리셨나요?"를 클릭하여 로그인 비밀번호를 재설정할 수도 있습니다.
        </v-card-text>
      </v-card>
      <v-btn class="mb-8" color="blue" size="large" variant="tonal" block @click="handleLogin">
        로그인
      </v-btn>
      <v-card-text class="text-center">
        <router-link class="text-blue text-decoration-none" to="/signup">
          지금 가입하기 <v-icon icon="mdi-chevron-right"></v-icon>
        </router-link>
      </v-card-text>
      <v-card-text class="text-center">
        <router-link class="text-blue text-decoration-none" to="/register/company">
          회사 등록하기 <v-icon icon="mdi-chevron-right"></v-icon>
        </router-link>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from "axios";
import apiClient from "../config/axios.js";
import { useUserStore } from '../store/userStore.js';
import {useRouter} from "vue-router";

const userId = ref('');
const password = ref('');
const visible = ref(false);
const userStore = useUserStore();
const emits = defineEmits(['login-success', 'show-signup']);
const router = useRouter();

const toggleVisibility = () => {
  visible.value = !visible.value;
};

// 로그인 함수 정의

// 로그인 처리 메서드
const handleLogin = async () => {
  try {
    await userStore.login(userId.value, password.value);

    //const userData = userStore.setUserData(userData);
    emits('login-success');
    router.push('/');
  } catch (error) {
    console.error('로그인 실패:', error);
    alert(error.message);
  }
};

const showSignup = () => {
  emits('show-signup');
};
</script>

<style scoped>
</style>
