<template>
  <v-app>
    <v-container>
      <v-navigation-drawer class="bg-grey-lighten-2" permanent>
        <v-list color="transparent">
          <!-- 사용자 정보 -->
          <v-list-item :prepend-avatar="userProfile">
            <v-list-item-title>{{ userName }}</v-list-item-title>
            <v-list-item-subtitle v-text="isLoggedIn ? departmentName : '로그인 해주세요'"></v-list-item-subtitle>
          </v-list-item>

          <!-- 대시보드 -->
          <v-list-item prepend-icon="mdi-view-dashboard" title="대시보드" v-if="isLoggedIn" @click="handleNavigate('dashboard')">
          </v-list-item>

          <!-- 내 정보 -->
          <v-list-item v-if="isLoggedIn" prepend-icon="mdi-account-box" title="내 정보" @click="navigateToAccount"></v-list-item>

          <!-- 관리자 메뉴 -->
          <v-menu v-model="menuOpen" offset-y v-if="isAdmin">
            <template #activator="{ props, on }">
              <v-list-item v-bind="props" prepend-icon="mdi-gavel">
                <v-list-item-title>관리자</v-list-item-title>
              </v-list-item>
            </template>
            <v-list>
              <v-list-item @click="handleNavigate('admin-dashboard')">등록 신청 목록</v-list-item>
              <v-list-item @click="handleNavigate('dayOff-requests')">휴가 신청 목록</v-list-item>
              <v-list-item @click="handleNavigate('dayOff-history')">휴가 히스토리</v-list-item>
              <v-list-item @click="handleNavigate('employee-management')">사원 관리</v-list-item>
            </v-list>
          </v-menu>
          <v-list-item
              title="테스트" prepend-icon="mdi-rabbit">
          </v-list-item>
          <!-- 마스터 -->
          <v-list-item v-if="isMaster" prepend-icon="mdi-crown" title="마스터"></v-list-item>
        </v-list>

        <!-- 로그인/로그아웃 버튼 -->
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

      <!-- 메인 콘텐츠 -->
      <v-main scrollable permanent class="bg-blue pt-8">
        <router-view></router-view>
      </v-main>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from './store/userStore';
import { useRouter } from "vue-router";
import {mdi} from "vuetify/iconsets/mdi";

const userStore = useUserStore();
const router = useRouter();
const menuOpen = ref(false); // 메뉴 열기 상태를 관리하는 ref

const isAdmin = computed(() => userStore.isAdmin);
const isMaster = computed(() => userStore.isMaster);
const isLoggedIn = computed(() => userStore.isLoggedIn);
const userName = computed(() => userStore.userName);
const departmentName = computed(() => userStore.departmentName);
const userProfile = computed(() => userStore.userProfileImage);

onMounted(async () => {
  await userStore.checkTokenExpirationAndRefreshToken();
});

const logout = () => {
  userStore.logout();
  router.push('/login');
};

const goToLogin = () => {
  router.push('/login');
};

const navigateToAccount = () => {
  if(isLoggedIn.value) {
    router.push(`/account/${userStore.userData.userId}`);
  } else {
    router.push('/login');
  }
};

const handleNavigate = (path) => {
  router.push(`/${path}`);
  menuOpen.value = false; // 네비게이션 후 메뉴 닫기
};
</script>
