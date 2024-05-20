<template>
  <div>
    <!-- 로그인 폼 -->
    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <div class="text-subtitle-1 text-medium-emphasis">로그인</div>

      <!-- 아이디 입력 -->
      <v-text-field
        v-model="userId"
        dense
        placeholder="아이디 입력"
        prepend-inner-icon="mdi-account-outline"
        variant="outlined"
      ></v-text-field>

      <!-- 비밀번호 입력 -->
      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        비밀번호

        <!-- 비밀번호를 잊어버리셨나요? -->
        <a
          class="text-caption text-decoration-none text-blue"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
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

      <!-- 경고 메시지 -->
      <v-card class="mb-12" color="surface-variant" variant="tonal">
        <v-card-text class="text-medium-emphasis text-caption">
          경고: 연속 3회 실패한 경우 계정이 3시간 동안 임시로 잠깁니다. 지금 로그인해야하는 경우 "비밀번호를 잊어버리셨나요?"를 클릭하여 로그인 비밀번호를 재설정할 수도 있습니다.
        </v-card-text>
      </v-card>

      <!-- 로그인 버튼 -->
      <v-btn class="mb-8" color="blue" size="large" variant="tonal" block @click="handleLogin">
        로그인
      </v-btn>

      <!-- 회원가입 링크 -->
      <v-card-text class="text-center">
        <a
          class="text-blue text-decoration-none"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          지금 가입하기 <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>
    </v-card>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { useUserStore } from '../store/userStore.js';
import axios from "axios"; // UserStore import

const userId = ref('');
const password = ref('');
const visible = ref(false);
const emits = defineEmits(['login-success']);
const userStore = useUserStore(); // UserStore 사용


const toggleVisibility = () => {
  visible.value = !visible.value;
};

// 로그인 함수 정의
const login = async (userId, password) => {
  try {
    // const response = await fetch('http://localhost:8080/api/v1/auth/login', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ user_id: userId, password }),
    // });

    const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
      user_id : userId,
      password: password
    });

    if (!response.data.code || response.data.code !== 200) {
      throw new Error('로그인 실패');
    }

    // 응답 헤더에서 접근 토큰 추출
    const accessToken = response.headers.get('Authorization');
    if(accessToken == null) {
      throw new Error('토큰이 없습니다.');
    }

    // 로컬스토리지에 접근토큰 저장
    localStorage.setItem('accessToken', accessToken);
    // Pinia의 UserStore를 통해 접근 토큰 저장
    userStore.setAccessToken(accessToken);

    const expirationTime = Date.now() + 60 * 60 * 1000; // 1시간 (밀리/초)
    localStorage.setItem('accessTokenExpiration', expirationTime);



    console.log('AccessToken : ', accessToken.toString());

    const userData = response.data.data;

    if (userData.status === 'APPROVED') {
      return userData;
    } else if(userData.status === 'PENDING') {
      throw new Error('아직 승인 못 받았습니다!');
      alert('아직 승인 못 받았습니다!');
    }
  } catch (error) {
    throw new Error('로그인 요청 실패:', error);
  }
};

// 로그인 처리 메서드
const handleLogin = async () => {
  try {
    const userData = await login(userId.value, password.value);

    // FIXME
    console.log('userData : ', userData);
    console.log('username: ', userData.name)

    // Pinia에 유저 정보 저장
    userStore.setUserData(userData);

    emits('login-success');

    //에러가 발생하면 적절한 에러 처리 로직을 수행합니다.
  } catch (error) {
    console.error('로그인 실패:', error);
    alert(error.message);
    // 에러 처리 로직 추가
  }
};
</script>

