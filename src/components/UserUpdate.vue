<template>
  <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
    <div class="text-subtitle-1 text-medium-emphasis">정보 수정</div>
    <v-form ref="form" v-model="valid">
      <v-text-field
          v-model="userId"
          dense
          placeholder="아이디"
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
          :rules="userIdRules"
          disabled
      ></v-text-field>
      <v-text-field
          v-model="password"
          :type="visible ? 'text' : 'password'"
          dense
          placeholder="새 비밀번호 (변경시 입력)"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="toggleVisibility"
          :rules="passwordRules"
      ></v-text-field>
      <v-text-field
          v-model="name"
          dense
          placeholder="이름"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          :rules="nameRules"
      ></v-text-field>
      <v-text-field
          v-model="email"
          dense
          placeholder="이메일"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          :rules="emailRules"
      ></v-text-field>
      <v-text-field
          v-model="phoneNumber"
          dense
          placeholder="전화번호"
          prepend-inner-icon="mdi-phone"
          variant="outlined"
          :rules="phoneNumberRules"
      ></v-text-field>
      <v-text-field
          v-model="brandName"
          dense
          placeholder="회사명"
          prepend-inner-icon="mdi-domain"
          variant="outlined"
          :rules="brandNameRules"
      ></v-text-field>
      <div>
        <DatePicker v-model="hireDate" :format="formatDate" locale="ko" :enable-time-picker="false"/>
      </div>

      <v-btn
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          block
          @click="handleUpdate"
          :disabled="!valid"
      >정보 수정</v-btn>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import apiClient from "../config/axios.js";
import DatePicker from '@vuepic/vue-datepicker';
import { useUserStore } from '../store/userStore';

const userStore = useUserStore();
const { userId, name, email, phoneNumber, brandName, hireDate } = userStore.userData;
const password = ref('');
const visible = ref(false);
const valid = ref(false);
const form = ref(null);

// 날짜 형식 함수
const formatDate = (date) => {
  return date.toISOString().substring(0,10);
}

const userIdRules = [
  v => !!v || '아이디를 입력해 주세요',
];
const passwordRules = [
  v => !v || v.length >= 4 || '비밀번호는 4글자 이상이어야 합니다.',
  v => !v || v.length <= 30 || '비밀번호는 30글자 이하이어야 합니다.',
];
const emailRules = [
  v => !!v || '이메일을 입력해 주세요',
  v => /.+@.+\..+/.test(v) || '유효한 이메일을 입력해 주세요',
];
const phoneNumberRules = [
  v => !!v || '전화번호를 입력해 주세요',
  v => /^010[0-9]{8}$/.test(v) || '010으로 시작해서 총 11자 이어야 합니다.',
];
const nameRules = [
  v => !!v || '이름을 입력해 주세요',
];
const brandNameRules = [
  v => !!v || '회사명을 입력해 주세요',
];

const toggleVisibility = () => {
  visible.value = !visible.value;
};

const handleUpdate = async () => {
  if (!form.value.validate()) {
    return;
  }

  try {
    const response = await apiClient.put('/user/update', {
      user_id: userId.value,
      password: password.value,
      name: name.value,
      email: email.value,
      phone_number: phoneNumber.value,
      hire_date: hireDate.value,
      brand_name: brandName.value,
    });

    if (response.status === 200) {
      alert('정보 수정 성공');
    } else {
      throw new Error('정보 수정 실패');
    }
  } catch (error) {
    alert('정보 수정 요청 실패: ' + error.message);
  }
};
</script>

<style scoped>
@import '@vuepic/vue-datepicker/dist/main.css';
</style>
