<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="primary">
            <span class="white--text">로그인</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
                v-model="username"
                label="사용자 이름"
                outlined
            ></v-text-field>
            <v-text-field
                v-model="password"
                label="비밀번호"
                outlined
                type="password"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="login">로그인</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');

const router = useRouter();

const login = () => {
  // 로그인 로직을 작성합니다.
  console.log('사용자 이름:', username.value);
  console.log('비밀번호:', password.value);

  // 로그인 성공 시 다음 페이지로 이동합니다.
  router.push('/dashboard');
};
</script>

<style scoped>
.primary {
  background-color: #1976d2;
}
.white--text {
  color: white;
}
</style>
