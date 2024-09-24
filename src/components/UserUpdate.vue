<template>
  <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
    <div class="caption mb-2 bold font-weight-bold">정보 수정</div>
    <br>
    <v-form ref="form" v-model="valid">

      <div class="caption mb-2">아이디</div>
      <v-text-field
          v-model="userId"
          dense
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
          :rules="userIdRules"
          readonly
      ></v-text-field>
      <div class="caption mb-2">비밀번호</div>
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
      <div class="caption mb-2">이름</div>
      <v-text-field
          v-model="name"
          dense
          placeholder="이름"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          :rules="nameRules"
      ></v-text-field>
      <div class="caption mb-2">이메일</div>
      <v-text-field
          v-model="email"
          dense
          placeholder="이메일"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          :rules="emailRules"
      ></v-text-field>
      <div class="caption mb-2">전화번호</div>
      <v-text-field
          v-model="phoneNumber"
          dense
          prepend-inner-icon="mdi-phone"
          variant="outlined"
          :rules="phoneNumberRules"
      ></v-text-field>
      <div class="caption mb-2">회사명</div>
      <v-text-field
          v-model="companyName"
          dense
          prepend-inner-icon="mdi-domain"
          variant="outlined"
          :rules="companyNameRules"
          readonly
      ></v-text-field>
      <div class="caption mb-2">입사날짜</div>
      <v-text-field
          v-model="hireDate"
          dense
          :format="formatDate"
          prepend-inner-icon="mdi-calendar-account"
          variant="outlined"
          readonly>
      </v-text-field>
<!--      <div>-->
<!--        <DatePicker v-model="hireDate" -->
<!--                    :format="formatDate" -->
<!--                    locale="ko" -->
<!--                    :enable-time-picker="false" -->
<!--                    :disabled/>-->
<!--      </div>-->

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
const { userId, name, email, phoneNumber, companyName, hireDate } = userStore.userData;
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
const companyNameRules = [
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
      company_name: companyName.value,
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
.v-text-field--disabled .v-label,
.v-text-field--disabled .v-input__control {
  color: #000; /* 검은색으로 설정 */
}

.v-text-field--disabled {
  opacity: 1; /* 기본적인 투명도 제거 */
}
</style>
