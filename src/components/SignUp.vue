<template>
  <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
    <div class="text-subtitle-1 text-medium-emphasis">회원가입</div>
    <br/>
    <v-form ref="form" v-model="valid">

      <v-text-field
          v-model="businessNumber"
          dense
          placeholder="회사 사업자번호"
          prepend-inner-icon="mdi-domain"
          variant="outlined"
          :rules="businessNumberRules"
      ></v-text-field>

      <v-text-field
          v-model="userId"
          dense
          placeholder="아이디"
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
          :rules="userIdRules"
      ></v-text-field>
      <v-text-field
          v-model="password"
          :type="visible ? 'text' : 'password'"
          dense
          placeholder="비밀번호"
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
          :rules="[v => !!v || '이름을 입력해 주세요']"
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

<!--      <v-text-field-->
<!--          v-model="hireDate"-->
<!--          dense-->
<!--          placeholder="고용 날짜"-->
<!--          prepend-inner-icon="mdi-calendar"-->
<!--          variant="outlined"-->
<!--          :rules="[v => !!v || '고용 날짜를 입력해 주세요']"-->
<!--      ></v-text-field>-->
      <div>
        <DatePicker v-model="hireDate" :format="formatDate" locale="ko" :enable-time-picker="false" placeholder="입사 날짜" />
<!--        <p>선택된 날짜: {{ hireDate }}</p>-->
      </div>

      <br/>
      <v-btn
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          block
          @click="handleSignup"
          :disabled="!valid"
      >회원가입</v-btn>
    </v-form>
  </v-card>
</template>

<script setup>
import {ref, watch} from 'vue';
import apiClient from "../config/axios.js";
import DatePicker from '@vuepic/vue-datepicker';
import {useRouter} from "vue-router";

const router= useRouter();
const userId = ref('');
const password = ref('');
const name = ref('');
const email = ref('');
const phoneNumber = ref('');
const businessNumber = ref('');
const visible = ref(false);
const valid = ref(false);
const form = ref(null);
const hireDate = ref(null);

// 날짜 형식 설정 함수
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`; // 월은 0부터 시작하므로 1을 추가합니다.
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  // 한 자리 수 월과 일에 '0'을 추가합니다.
  month = month.length < 2 ? '0' + month : month;
  day = day.length < 2 ? '0' + day : day;

  return `${year}-${month}-${day}`; // ISO 형식인 YYYY-mm-DD 로 변환
  //return date.toISOString().substring(0,10); Timezone 이슈
}

const businessNumberRules = [
    v => !!v || '사업자 번호를 입력해 주세요',
    v => (v && v.length === 10) || '사업자등록번호는 10자리여야 합니다.'
]

const userIdRules = [
  v => !!v || '아이디를 입력해 주세요',
  v => v.length >= 4 || '아이디는 4글자 이상이어야 합니다.',
  v => /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/.test(v) || '아이디는 영어와 숫자를 혼합하거나 영어로만 이루어져야 합니다.'
];

const passwordRules = [
  v => !!v || '비밀번호를 입력해 주세요',
  v => v.length >= 4 || '비밀번호는 4글자 이상이어야 합니다.',
  v => v.length <= 30 || '비밀번호는 30글자 이하이어야 합니다.'
];

const emailRules = [
  v => !!v || '이메일을 입력해 주세요',
  v => /.+@.+\..+/.test(v) || '유효한 이메일을 입력해 주세요'
];

const phoneNumberRules = [
  v => !!v || '전화번호를 입력해 주세요',
  v => /^010[0-9]{8}$/.test(v) || '010으로 시작해서 총 11자 이어야 합니다.'
];

const toggleVisibility = () => {
  visible.value = !visible.value;
};

const emits = defineEmits(['signup-success', 'show-login']);

// 회원 가입
const handleSignup = async () => {
  if (!form.value.validate()) {
    return;
  }

  try {
    const response = await apiClient.post('/auth/join', {
      user_id: userId.value,
      password: password.value,
      name: name.value,
      email: email.value,
      phone_number: phoneNumber.value,
      hire_date: hireDate.value,
      b_no: businessNumber.value,
    });

    if (response.status === 200) {
      alert('회원가입 성공');
      emits('signup-success');
      await router.push('/');
    } else if(response.status === 400){
      throw new Error(`에러: ${response.status} - ${response.data.message}`);
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      // 서버에서 제공한 에러 메시지를 alert로 보여줌
      alert(`회원가입 요청 실패: ${error.response.data.message}`);
    }else {
      // 기타 에러 메시지
      alert(`회원가입 요청 실패: ${error.message}`);
    }
  }
};

const showLogin = () => {
  emits('show-login');
};
</script>

<style scoped>
@import '@vuepic/vue-datepicker/dist/main.css';
</style>
