<template>
  <v-app>
    <v-container>
      <v-navigation-drawer class="bg-grey-lighten-2" permanent>
        <v-list color="transparent">
          <!-- 사용자 정보 -->
          <v-list-item :prepend-avatar="userProfile">
            <v-list-item-title>{{ userName }}</v-list-item-title>
            <v-list-item-subtitle v-text="isLoggedIn ? departmentName : '로그인 해주세요'"></v-list-item-subtitle>
            <v-list-item-subtitle>{{ roleDisplay }}</v-list-item-subtitle>
          </v-list-item>

          <!-- 대시보드 -->
          <v-list-item prepend-icon="mdi-view-dashboard" title="대시보드" v-if="isLoggedIn" @click="handleNavigate('')">
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
<!--              <v-list-item @click="handleNavigate('dayOff-history')">휴가 히스토리</v-list-item>-->
              <v-list-item @click="handleNavigate('employee-management')">사원 관리</v-list-item>
            </v-list>
          </v-menu>
<!--          <v-list-item-->
<!--              title="테스트" prepend-icon="mdi-rabbit">-->
<!--          </v-list-item>-->

          <!-- 휴가 카테고리 메뉴 -->
          <v-menu v-if="isLoggedIn" v-model="holidayMenuOpen" offset-y>
            <template #activator="{ props, on }">
              <v-list-item prepend-icon="mdi-beach" v-bind="props">
                <v-list-item-title>휴가 관리</v-list-item-title>
              </v-list-item>
            </template>
            <v-list>
              <v-list-item @click="handleNavigate('dayOff-apply')">휴가 신청</v-list-item>
              <v-list-item @click="handleNavigate('dayOff-list')">휴가 목록</v-list-item>
            </v-list>
          </v-menu>

          <!-- 마스터 -->
          <v-list-item v-if="isMaster" prepend-icon="mdi-crown" title="마스터"></v-list-item>

          <!-- 팀장 -->
          <v-menu v-model="menuOpen" offset-y v-if="isTeamLeader">
            <template #activator="{ props, on }">
              <v-list-item v-bind="props" prepend-icon="mdi-gavel">
                <v-list-item-title>팀장</v-list-item-title>
              </v-list-item>
            </template>
            <v-list>
              <v-list-item @click="handleNavigate('team-leader/dashboard')">팀 구성</v-list-item>
              <v-list-item @click="handleNavigate('team-leader/dayOff-list')">휴가 신청 목록</v-list-item>

            </v-list>
          </v-menu>
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

const isTeamLeader = computed(() => userStore.isTeamLeader);
const isAdmin = computed(() => userStore.isAdmin);
const isMaster = computed(() => userStore.isMaster);
const isLoggedIn = computed(() => userStore.isLoggedIn);
const userName = computed(() => userStore.userName);
const departmentName = computed(() => userStore.departmentName);
const userProfile = computed(() => userStore.userProfileImage);
const role = computed(() => userStore.role);

const holidayMenuOpen = ref(false); // 휴가 메뉴 열기 상태

const roleDisplay = computed(() => {
  const role = userStore.role;
  if (role === 'TEAM_LEADER') {
    return '팀장';
  } else if (role === 'ADMIN') {
    return '어드민';
  } else if (role === 'MASTER') {
    return '마스터';
  }
  return ''; // 기본값, 역할이 지정되지 않은 경우
});


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

// const handleNavigate = (path) => {
//   router.push(`/${path}`);
//   menuOpen.value = false; // 네비게이션 후 메뉴 닫기
// };

const handleNavigate = (path) => {
  router.push(`/${path}`);
  menuOpen.value = false; // 네비게이션 후 메뉴 닫기
  holidayMenuOpen.value = false; // 휴가 메뉴 닫기
};

</script>
